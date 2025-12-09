import { EventRegistry } from "../domain/events/EventRegistry";

export type EventType = EventRegistry["type"];
export type Listener<TEvent extends EventType> = (
  event: EventRegistry & { type: TEvent },
) => void | Promise<void>;
export type ListenersMap = {
  [TEvent in EventType]?: Listener<TEvent>[];
};

export interface EventBus {
  subscribe<TEvent extends EventType>(type: TEvent, listener: Listener<TEvent>): () => void;
  dispatch(event: EventRegistry): void;
  cleanUp(): void;
}
