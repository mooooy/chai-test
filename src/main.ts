import { makeDOMDriver } from "@cycle/dom";
import { run } from "@cycle/run";
import Counter from "./counter";

run(Counter, {
  DOM: makeDOMDriver("#app"),
});
