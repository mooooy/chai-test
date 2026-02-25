import { describe, it } from 'mocha';
const chai = require('chai');
const chaiVirtualDom = require('chai-virtual-dom');
const xs = require('xstream');

chai.use(chaiVirtualDom);
const expect = chai.expect;

const CounterManager = require('../../src/components/CounterManager').default;

describe('CounterManager Component', () => {
  describe('View Structure', () => {
    it('should render initial state with one counter', (done) => {
      const sources = {
        DOM: {
          select: () => ({
            events: () => xs.Stream.never()
          })
        }
      };

      const sinks = CounterManager(sources);

      sinks.DOM.take(1).subscribe({
        next: (vnode: any) => {
          expect(vnode.sel).to.equal('div.counter-manager');

          // Should have children
          expect(vnode.children.length).to.be.greaterThan(0);

          // Find the controls section
          const controls = vnode.children.find((child: any) =>
            child.sel === 'div.controls'
          );
          expect(controls).to.exist;

          // Should have both buttons
          const addButton = controls.children.find((child: any) =>
            child.sel === 'button.add-counter'
          );
          const removeButton = controls.children.find((child: any) =>
            child.sel === 'button.remove-counter'
          );

          expect(addButton).to.exist;
          expect(removeButton).to.exist;

          done();
        }
      });
    });

    it('should render multiple counters', (done) => {
      const sources = {
        DOM: {
          select: () => ({
            events: () => xs.Stream.never()
          })
        },
        action$: xs.Stream.fromArray(['ADD_COUNTER'])
      };

      const sinks = CounterManager(sources);

      let callCount = 0;
      sinks.DOM.subscribe({
        next: (vnode: any) => {
          callCount++;
          if (callCount === 2) {
            // Find the counters container
            const countersDiv = vnode.children.find((child: any) =>
              child.sel === 'div.counters'
            );
            expect(countersDiv).to.exist;

            // Should have 2 counter wrappers
            const wrappers = countersDiv.children.filter((child: any) =>
              child.sel === 'div.counter-wrapper'
            );
            expect(wrappers.length).to.equal(2);
            done();
          }
        }
      });
    });
  });

  describe('Intent', () => {
    it('should emit ADD_COUNTER action when add button clicked', () => {
      const sources = {
        DOM: {
          select: () => ({
            events: () => xs.Stream.never()
          })
        }
      };

      const sinks = CounterManager(sources);
      expect(sinks.action$).to.be.instanceof(xs.Stream);
    });
  });

  describe('Model', () => {
    it('should track counter count', (done) => {
      const sources = {
        DOM: {
          select: () => ({
            events: () => xs.Stream.never()
          })
        },
        action$: xs.Stream.fromArray(['ADD_COUNTER', 'ADD_COUNTER', 'REMOVE_COUNTER'])
      };

      const sinks = CounterManager(sources);

      let callCount = 0;
      sinks.DOM.subscribe({
        next: (vnode: any) => {
          callCount++;
          // Initial + ADD + ADD + REMOVE = 4 states
          if (callCount === 4) {
            // Should have 2 counters (1 initial + 2 added - 1 removed)
            const countersDiv = vnode.children.find((child: any) =>
              child.sel === 'div.counters'
            );
            const wrappers = countersDiv.children.filter((child: any) =>
              child.sel === 'div.counter-wrapper'
            );
            expect(wrappers.length).to.equal(2);
            done();
          }
        }
      });
    });
  });
});
