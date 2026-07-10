# View Transitions

Adds View Transitions API support for Umbra theme toggling. The plugin wraps the host `toggleTheme()` call with `document.startViewTransition()` when available.

## Installation (copy files into your project)

Copy the `plugins/view-transitions` folder into your project's `plugins` directory.

Example layout after copying:

```text
project-root/
  plugins/
    view-transitions/
      view-transitions.plugin.ts
      README.md
```

## Usage

When creating an Umbra instance, add the plugin via the `usePlugins` array:

```ts
import Umbra from '@emrocode/umbra';
import { ViewTransitions } from './plugins/view-transitions/view-transitions.plugin';

const umb = new Umbra('#element', {
  usePlugins: [ViewTransitions],
});
```

## Behavior

On plugin initialization, `host.toggleTheme` is overridden. If the browser supports `document.startViewTransition`, the theme toggle runs inside a view transition callback. If not, it falls back to the original toggle behavior.

## Options

This plugin has no configuration options.

## Lifecycle

- `constructor(host)` — captures and wraps `host.toggleTheme`
- `render()` — no-op (required by plugin interface)
