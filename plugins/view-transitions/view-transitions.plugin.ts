import type { Plugin, Host } from '@emrocode/umbra';

export class ViewTransitions implements Plugin {
  public static readonly pluginId = 'u-view-transitions';

  constructor(host: Host) {
    const _toggle = host.toggleTheme.bind(host);

    host.toggleTheme = () => {
      if (!document.startViewTransition) return _toggle();
      document.startViewTransition(() => _toggle());
    };
  }

  render(): void {}
}
