// ReferenceError: MutationObserver is not defined
import "mutationobserver-shim";

// https://github.com/gcedo/eventsourcemock
import EventSource from "eventsourcemock";

Object.defineProperty(window, "EventSource", {
    value: EventSource,
});
