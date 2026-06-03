export type Theme = 'light' | 'dark';

export interface Plugin<T extends HTMLElement = HTMLElement> {
  el?: T;
  render(): void | T;
  onThemeChange?: (theme: Theme) => void;
  onDestroy?: () => void;
}

export interface Host {
  toggleTheme(): void;
  getCurrentTheme(): Theme;
  destroy(): void;
}

export interface PluginConstructor {
  pluginId: string;
  new (host: Host, options?: any): Plugin;
}

export interface Options {
  autoMatchTheme: boolean;
  useColorScheme: [string, string?];
  useStorage: 'local' | 'session' | 'none';
  usePlugins?: (PluginConstructor | [PluginConstructor, any])[];
}
