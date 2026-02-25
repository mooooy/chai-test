import type { VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import type { DOMSource } from '@cycle/dom';
import { div, button, h1, p } from '@cycle/dom';
import Counter, { type CounterSources, type CounterSinks } from '../Counter';

export interface CounterManagerSources {
  DOM: DOMSource;
  action$?: Stream<string>;
}

export interface CounterManagerSinks {
  DOM: Stream<VNode>;
  action$?: Stream<string>;
}

type ManagerAction = 'ADD_COUNTER' | 'REMOVE_COUNTER';

// Helper function to create isolated counter sources
function isolateCounterSources(domSource: DOMSource, counterId: string): CounterSources {
  const scopedDOMSource = domSource.select(`.counter-${counterId}`) as any;

  // Create a proper DOMSource that scopes selectors to this counter
  const isolatedDOM: DOMSource = {
    select: (selector: string) => scopedDOMSource.select(selector),
    elements: () => scopedDOMSource.elements(),
    events: (eventType: string, options?: any) => scopedDOMSource.events(eventType, options)
  } as DOMSource;

  return {
    DOM: isolatedDOM,
    props: xs.of({ initialCount: 0 }) as Stream<any>
  };
}

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

  // Model: Manage counter count
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
    // Generate counter IDs
    const counterIds = Array.from({ length: count }, (_, i) => `counter-${i}`);

    // Create isolated counter components
    const counterVNodes = counterIds.map((counterId) => {
      // Get isolated sources for this counter
      const counterSources = isolateCounterSources(sources.DOM, counterId);
      const counterSinks = Counter(counterSources);

      // Get the VNode from the counter's DOM stream
      let counterVNode: VNode | null = null;
      counterSinks.DOM.take(1).subscribe({
        next: (vnode) => {
          counterVNode = vnode;
        }
      });

      // Wrap the counter in a scoped div
      return div(`.counter-wrapper.${counterId}`, [
        counterVNode || div('.counter', ['Loading...'])
      ]);
    });

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
