import fs from "fs";
import path from "path";

// https://github.com/jsdom/jsdom/issues/639#issuecomment-371278152
const mo = fs.readFileSync(path.resolve("node_modules", "mutationobserver-shim", "dist", "mutationobserver.min.js"), {
    encoding: "utf-8",
});
const moScript = window.document.createElement("script");
moScript.textContent = mo;

window.document.body.appendChild(moScript);

// https://github.com/gcedo/eventsourcemock
import EventSource from "eventsourcemock";

Object.defineProperty(window, "EventSource", {
    value: EventSource,
});
