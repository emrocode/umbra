type ListenerTarget = Window | Document | HTMLElement | MediaQueryList;

export class EventListenerManager {
  private controller = new AbortController();

  /**
   * Adds an event listener and tracks it for cleanup
   */
  addListener<T extends Event>(
    target: ListenerTarget,
    event: string,
    handler: (event: T) => void,
    options?: AddEventListenerOptions
  ): void {
    target.addEventListener(event, handler as EventListener, {
      ...options,
      signal: this.controller.signal,
    });
  }

  /**
   * Removes all tracked event listeners
   */
  clearListeners(): void {
    this.controller.abort();
    this.controller = new AbortController();
  }
}
