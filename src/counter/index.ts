import type { VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import type { DOMSource } from '@cycle/dom';

export interface Sources {
  DOM: any;
  props?: Stream<any>;
}

export interface Sinks {
  DOM: Stream<VNode>;
}

export default function Counter(sources: Sources): Sinks {
  const vdom$ = xs.of(
    div('Hello from Cycle.js! Edit src/counter to get started.')
  );

  return {
    DOM: vdom$,
  };
}

const { div } = require('@cycle/dom');
