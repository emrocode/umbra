export type Theme = 'light' | 'dark';

export interface DarkifyPlugin<T extends HTMLElement = HTMLElement> {
  el?: T;
  render(): void | T;
  onThemeChange?: (theme: Theme) => void;
  onDestroy?: () => void;
}

export interface DarkifyHost {
  toggleTheme(): void;
  getCurrentTheme(): Theme;
  destroy(): void;
}

export interface DarkifyPluginConstructor {
  pluginId: string;
  new (host: DarkifyHost, options?: any): DarkifyPlugin;
}

export interface Options {
  autoMatchTheme: boolean;
  useColorScheme: [string, string?];
  useStorage: 'local' | 'session' | 'none';
  usePlugins?: (DarkifyPluginConstructor | [DarkifyPluginConstructor, any])[];
}
