# Keyboard Shortcut

Adds simple keyboard shortcut handling for Umbra. The plugin listens for keydown events and, when matched, calls the host's `toggleTheme()` method.

## Installation (copy files into your project)

Copy the `plugins/keyboard-shortcut` folder into your project's `plugins` directory.

Example layout after copying:

```text
project-root/
  plugins/
    keyboard-shortcut/
      keyboard-shortcut.plugin.ts
      README.md
```

## Usage

When creating an Umbra instance, add the plugin via the `usePlugins` array:

```ts
import Umbra from '@emrocode/umbra';
import { KeyboardShortcut } from './plugins/keyboard-shortcut/keyboard-shortcut.plugin';

const umb = new Umbra('#element', {
  usePlugins: [
    [
      KeyboardShortcut,
      {
        key: 'd', // default 'd'
        ctrl: false, // require Ctrl/Meta when true
        shift: false, // require Shift when true
        target: 'body', // 'body' | 'input' | 'all'
        cooldown: 300, // ms between triggers
      },
    ],
  ],
});
```

## Behavior

When the configured key combination matches, the plugin calls `host.toggleTheme()` on the Umbra host. It filters events based on `target` (skip when typing in inputs if `body`, or only when typing if `input`). A cooldown prevents rapid repeats.

## Options

- key: string — character to match (default: 'd')
- ctrl: boolean — require Ctrl (or Meta) modifier (default: false)
- shift: boolean — require Shift modifier (default: false)
- target: 'body' | 'input' | 'all' — when to respond (default: 'body')
- cooldown: number — debounce time in ms (default: 300)

## Lifecycle

- `render()` — attaches keydown listener
- `onDestroy()` — removes listener
