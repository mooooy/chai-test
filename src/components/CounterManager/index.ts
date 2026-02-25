import type { VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import type { DOMSource } from '@cycle/dom';

import { div, button, h1, p, span } from '@cycle/dom';

export interface CounterManagerSources {
  DOM: DOMSource;
  action$?: Stream<string>;
}

export interface CounterManagerSinks {
  DOM: Stream<VNode>;
  action$?: Stream<string>;
}

type ManagerAction = 'ADD_COUNTER' | 'REMOVE_COUNTER';

export default function CounterManager(sources: CounterManagerSources): CounterManagerSinks {
  // Intent: Extract add/remove button clicks
  const addCounter$ = (sources.DOM.select('.add-counter') as any)
    .events('click')
    .mapTo('ADD_COUNTER' as ManagerAction);

  const removeCounter$ = (sources.DOM.select('.remove-counter') as any)
    .events('click')
    .mapTo('REMOVE_COUNTER' as ManagerAction);

  // Merge internal DOM events with external actions
  const internalAction$ = xs.merge(addCounter$, removeCounter$);
  const externalAction$ = sources.action$ || xs.never() as Stream<string>;
  const action$ = xs.merge(internalAction$, externalAction$) as Stream<string>;

  // Model: Manage counter count (simplified - just track count)
  const initialState = 1; // Start with 1 counter

  const count$ = action$
    .fold((count, action) => {
      if (action === 'ADD_COUNTER') {
        return count + 1;
      } else if (action === 'REMOVE_COUNTER') {
        return Math.max(1, count - 1); // Keep at least 1
      }
      return count;
    }, initialState);

  // View: Render counters and controls
  const vdom$ = count$.map((count) => {
    // Generate counter placeholders
    const counters = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      count: 0
    }));

    const counterVNodes = counters.map((counter) =>
      div('.counter-wrapper', [
        div('.counter', [
          button('.decrement', '-'),
          span('.count', String(counter.count)),
          button('.increment', '+')
        ])
      ])
    );

    return div('.counter-manager', [
      h1('Counter Manager'),
      p('Dynamically manage multiple counters'),
      div('.controls', [
        button('.add-counter', 'Add Counter'),
        button('.remove-counter', 'Remove Counter')
      ]),
      div('.counters', counterVNodes)
    ]);
  });

  return {
    DOM: vdom$,
    action$: action$ as any
  };
}
