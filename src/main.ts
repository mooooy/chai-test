import { makeDOMDriver } from "@cycle/dom";
import { run } from "@cycle/run";
import CounterManager from "./components/CounterManager";

// Run the CounterManager component
run(CounterManager as any, {
  DOM: makeDOMDriver("#app"),
});
