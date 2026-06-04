import { EventListenerManager } from '@/core/event-listener';

describe('eventListenerManager', () => {
  test('clears click listeners', () => {
    const _elm = new EventListenerManager();
    const button = document.createElement('button');
    const clickHandler = jest.fn();
    _elm.addListener(button, 'click', clickHandler);

    button.click();
    expect(clickHandler).toHaveBeenCalledTimes(1);

    _elm.clearListeners();

    button.click();
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });
});
