import { Umbra } from '@/core/umbra';

describe('Umbra', () => {
  const setupMatchMedia = (isDark: boolean = false) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: (query as string).includes('dark') ? isDark : false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });
  };

  const createButton = (id: string = 'el'): HTMLButtonElement => {
    const button = document.createElement('button');
    button.id = id;
    document.body.appendChild(button);
    return button;
  };

  beforeAll(() => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => undefined);
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => undefined);
  });

  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
    setupMatchMedia(true);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Initialization', () => {
    test('should initialize with dark theme when OS prefers dark', () => {
      createButton();
      const umbra = new Umbra('#el', {});
      expect(umbra.getCurrentTheme()).toBe('dark');
    });

    test('should respect autoMatchTheme "false" option', () => {
      setupMatchMedia(false);
      createButton();
      const freshUmbra = new Umbra('#el', { autoMatchTheme: false });
      expect(freshUmbra.getCurrentTheme()).toBe('light');
    });
  });

  describe('Storage', () => {
    test('should save theme to localStorage by default', () => {
      createButton();
      new Umbra('#el', {});
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    test('should use sessionStorage when specified', () => {
      createButton('el2');
      new Umbra('#el2', { useStorage: 'session' });

      expect(sessionStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(localStorage.removeItem).toHaveBeenCalledWith('theme');
    });

    test('should not save theme when useStorage is "none"', () => {
      createButton('el3');
      new Umbra('#el3', { useStorage: 'none' });

      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Theme toggle', () => {
    test('should toggle theme from dark to light', () => {
      createButton();
      const umbra = new Umbra('#el', {});
      umbra.toggleTheme();
      expect(umbra.getCurrentTheme()).toBe('light');
    });

    test('should toggle theme from light to dark', () => {
      setupMatchMedia(false);
      createButton();
      const freshUmbra = new Umbra('#el', {});
      freshUmbra.toggleTheme();
      expect(freshUmbra.getCurrentTheme()).toBe('dark');
    });
  });
});
