import type { VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import type { DOMSource } from '@cycle/dom';
import { div, button, span } from '@cycle/dom';

export interface CounterProps {
  initialCount?: number;
}

export interface CounterSources {
  DOM: DOMSource;
  props?: Stream<CounterProps>;
  action$?: Stream<string>;
}

export interface CounterSinks {
  DOM: Stream<VNode>;
  action$?: Stream<string>;
}

type CounterAction = 'INC' | 'DEC';

export default function Counter(sources: CounterSources): CounterSinks {
  // Intent: Extract user interactions
  const decrement$ = (sources.DOM
    .select('.decrement') as any)
    .events('click')
    .mapTo('DEC' as CounterAction);

  const increment$ = (sources.DOM
    .select('.increment') as any)
    .events('click')
    .mapTo('INC' as CounterAction);

  // Get initial count from props
  const props$ = sources.props || xs.of({ initialCount: 0 });

  // Merge DOM events with external actions
  const internalAction$ = xs.merge(decrement$, increment$);
  const externalAction$ = sources.action$ || xs.never();

  // Model: Manage state
  const state$ = props$
    .map((props) => {
      const initial = props.initialCount || 0;

      // Combine all actions
      const allActions$ = xs.merge(internalAction$, externalAction$);

      return allActions$
        .fold((count, action) => {
          return action === 'INC' ? count + 1 : count - 1;
        }, initial)
        .startWith(initial);
    })
    .flatten();

  // View: Render virtual DOM
  const vdom$ = state$.map((count) =>
    div('.counter', [
      button('.decrement', '-'),
      span('.count', String(count)),
      button('.increment', '+')
    ])
  );

  // Combine actions for sink (need to recreate these for sink)
  const sinkInternalAction$ = xs.merge(decrement$, increment$);
  const sinkExternalAction$ = sources.action$ || xs.never();
  const action$: Stream<string> = xs.merge(
    sinkInternalAction$ as Stream<string>,
    sinkExternalAction$ as Stream<string>
  ) as Stream<string>;

  return {
    DOM: vdom$,
    action$: action$
  };
}
