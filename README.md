# Umbra
[![Run tests](https://github.com/emrocode/umbra/actions/workflows/tests.yml/badge.svg)](https://github.com/emrocode/umbra/actions/workflows/tests.yml)

🌚 A simple dark mode toggle library that makes it easy to implement dark mode on your website without additional configuration

> Please make sure to read the [Wiki] for detailed documentation and examples

### 📦 Installation

Use npm or any other package manager:

```bash
npm install @emrocode/umbra
```

### ⚙️ Setup

```js
// main.js
import Umbra from '@emrocode/umbra';

const options = {
  autoMatchTheme: true,
};

// autoMatchTheme: boolean,
// useColorScheme: ['#ffffff', '#000000'],
// useStorage: 'local' | 'session' | 'none',
// usePlugins: []

new Umbra('#element', options);
```

[Wiki]: https://github.com/emrocode/umbra/wiki
