import { EventListenerManager } from '@/core/event-listener';
import { defaultOptions } from '@/core/default';
import { isBrowser, isTheme } from '@/utils';
import type { Options, Plugin, Theme } from '@/types';

export class Umbra {
  private static readonly storageKey: string = 'theme';
  public readonly options: Options = defaultOptions;
  private plugins: Plugin[] = [];
  public theme: Theme = 'light';
  private _elm!: EventListenerManager;
  private _meta!: HTMLMetaElement;
  private _style!: HTMLStyleElement;

  /**
   * Creates a new Umbra instance with default options
   * @param element - Button ID (recommended) or HTML element selector
   */
  constructor(element: string);

  /**
   * Creates a new Umbra instance with custom options only
   * @param options - Options
   */
  constructor(options: Partial<Options>);

  /**
   * Creates a new Umbra instance for managing dark/light theme
   * @param element - Button ID (recommended) or HTML element selector
   * @param options - Options
   * @see {@link https://github.com/emrocode/umbra/wiki|Documentation}
   */
  constructor(element: string, options: Partial<Options>);

  constructor(element?: string | Partial<Options>, options?: Partial<Options>) {
    if (!isBrowser) return;

    this._elm = new EventListenerManager();

    const el = typeof element === 'string' ? element : undefined;
    const inputOpts =
      element && typeof element === 'object' ? (element as Partial<Options>) : options;
    const opts: Options = { ...defaultOptions, ...inputOpts };

    this.options = opts;
    this.theme = this.getInitialTheme();
    this._style = document.createElement('style');
    this._meta = document.createElement('meta');

    this.init(el); // always on top
    this.createAttribute();

    if (this.options.useStorage !== 'none') {
      this.syncThemeBetweenTabs();
    }
  }

  private init(element?: string): void {
    if (this.options.autoMatchTheme) {
      const q = window.matchMedia('(prefers-color-scheme: dark)');
      this._elm.addListener(q, 'change', ({ matches: isDark }: MediaQueryListEvent) => {
        this.applyTheme(isDark ? 'dark' : 'light');
      });
    }

    const setup = () => {
      this.initPlugins();
      const hasRenderedPlugin = this.plugins.some(plugin => plugin.el !== undefined);
      if (element && !hasRenderedPlugin) {
        const htmlElement = document.querySelector<HTMLElement>(element);
        if (htmlElement) {
          this._elm.addListener(htmlElement, 'click', () => this.toggleTheme());
        }
      }
    };

    if (document.readyState !== 'loading') {
      return setup();
    }

    this._elm.addListener(document, 'DOMContentLoaded', setup);
  }

  private initPlugins(): void {
    this.options.usePlugins?.forEach(p => {
      const [Plugin, pluginOptions] = Array.isArray(p) ? p : [p, undefined];
      const plugin = new Plugin(this, pluginOptions);

      const renderedNode = plugin.render();
      if (renderedNode) {
        plugin.el = renderedNode;
      }

      this.plugins.push(plugin);
    });
  }

  private notifyPlugins(theme: Theme) {
    this.plugins.forEach(plugin => {
      plugin.onThemeChange?.(theme);
    });
  }

  private getStorage(): Storage | undefined {
    const { useStorage } = this.options;
    if (useStorage === 'none') return undefined;
    return useStorage === 'local' ? window.localStorage : window.sessionStorage;
  }

  private getInitialTheme(): Theme {
    const storage = this.getStorage();

    if (storage) {
      const stored = storage.getItem(Umbra.storageKey);
      if (isTheme(stored)) return stored;
    }

    if (this.options.autoMatchTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return 'light';
  }

  private createAttribute(): void {
    const { useColorScheme } = this.options;
    const dataTheme = document.documentElement;
    const [lightColor, darkColor] = useColorScheme;

    const css = `/**! Umbra / A simple dark mode toggle library **/\n:root:where([data-theme="${this.theme}"]),[data-theme="${this.theme}"]{color-scheme:${this.theme}}`;

    dataTheme.dataset.theme = this.theme;

    this._meta.name = 'theme-color';
    this._meta.content = this.theme === 'light' ? lightColor : (darkColor ?? lightColor);
    this._style.innerHTML = css;

    const head = document.head;

    // avoid tags duplication
    if (!this._meta.parentNode) head.appendChild(this._meta);
    if (!this._style.parentNode) head.appendChild(this._style);

    this.persistTheme();
  }

  private persistTheme(): void {
    const { useStorage } = this.options;
    if (useStorage === 'none') return;
    const storage = useStorage === 'local';

    const STO = storage ? window.localStorage : window.sessionStorage;
    const OTS = storage ? window.sessionStorage : window.localStorage;

    OTS.removeItem(Umbra.storageKey);
    STO.setItem(Umbra.storageKey, this.theme);
  }

  private syncThemeBetweenTabs(): void {
    this._elm.addListener(window, 'storage', (e: StorageEvent) => {
      if (e.key === Umbra.storageKey && isTheme(e.newValue)) {
        this.applyTheme(e.newValue);
      }
    });
  }

  private applyTheme(newTheme: Theme): void {
    if (newTheme === this.theme) return;

    this.theme = newTheme;
    this.createAttribute();
    this.notifyPlugins(newTheme);
  }

  /**
   * Toggles the theme between light and dark modes
   */
  toggleTheme(): void {
    this.applyTheme(this.theme === 'light' ? 'dark' : 'light');
  }

  /**
   * Retrieves the currently active theme
   * @returns The current theme name ('light' or 'dark')
   */
  getCurrentTheme(): Theme {
    return this.theme;
  }

  /**
   * Destroys the Umbra instance and cleans up all resources
   *
   * Removes all event listeners (system theme changes, click handlers, storage events),
   * destroys all active plugins, removes injected DOM elements (<style> and <meta> tags),
   * and frees associated resources.
   * Call this method when the instance is no longer needed to prevent memory leaks.
   */
  destroy(): void {
    this._elm.clearListeners();

    // remove injected DOM elements
    this._style?.parentNode?.removeChild(this._style);
    this._meta?.parentNode?.removeChild(this._meta);

    // destroy plugins
    if (this.plugins.length > 0) {
      this.plugins.forEach(plugin => {
        plugin.onDestroy?.();
      });

      this.plugins = [];
    }
  }
}
