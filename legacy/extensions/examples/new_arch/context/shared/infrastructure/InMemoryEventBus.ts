import { EventBus, EventType, Listener, ListenersMap } from "../domain/EventBus";
import { EventRegistry } from "../domain/events/EventRegistry";

export const InMemoryEventBus: EventBus = class {
  private static listenersMap: ListenersMap = {};

  static subscribe<TEvent extends EventType>(type: TEvent, listener: Listener<TEvent>): () => void {
    const listeners = this.listenersMap[type] ?? [];
    this.listenersMap = {
      ...this.listenersMap,
      [type]: [...listeners, listener],
    };

    return () => {
      this.listenersMap = {
        ...this.listenersMap,
        [type]: this.listenersMap[type]?.filter(l => l !== listener),
      };
    };
  }

  static dispatch(event: EventRegistry): void {
    const listeners = this.listenersMap[event.type];

    listeners?.forEach(listener => {
      listener(event);
    });
  }

  static cleanUp(): void {
    this.listenersMap = {};
  }
};
