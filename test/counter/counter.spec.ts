import { describe, it } from 'mocha';
const chai = require('chai');
const chaiVirtualDom = require('chai-virtual-dom');
const xs = require('xstream');

chai.use(chaiVirtualDom);
const expect = chai.expect;

const Counter = require('../../src/components/Counter').default;

describe('Counter Component', () => {
  describe('Intent', () => {
    it('should emit action$ stream', () => {
      const sources = {
        DOM: {
          select: () => ({
            events: () => xs.Stream.never()
          })
        }
      };

      const sinks = Counter(sources);
      expect(sinks.action$).to.be.instanceof(xs.Stream);
    });
  });

  describe('Model + View Integration', () => {
    it('should render initial count from props', (done) => {
      const sources = {
        DOM: {
          select: () => ({
            events: () => xs.Stream.never()
          })
        },
        props: xs.Stream.of({ initialCount: 5 })
      };

      const sinks = Counter(sources);

      sinks.DOM.take(1).subscribe({
        next: (vnode: any) => {
          expect(vnode.sel).to.equal('div.counter');
          expect(vnode.children).to.have.lengthOf(3);

          const countText = vnode.children.find((child: any) => child.text === '5');
          expect(countText).to.exist;
          done();
        }
      });
    });

    it('should handle sequence of actions', (done) => {
      const sources = {
        DOM: {
          select: () => ({
            events: () => xs.Stream.never()
          })
        },
        action$: xs.Stream.fromArray(['INC', 'INC', 'DEC']),
        props: xs.Stream.of({ initialCount: 0 })
      };

      const sinks = Counter(sources);

      let callCount = 0;
      sinks.DOM.subscribe({
        next: (vnode: any) => {
          callCount++;
          if (callCount === 3) {
            // Final: 0 + 1 + 1 - 1 = 1
            const countText = vnode.children.find((child: any) => child.text === '1');
            expect(countText).to.exist;
            done();
          }
        }
      });
    });
  });

  describe('View Structure', () => {
    it('should render correct DOM structure', (done) => {
      const sources = {
        DOM: {
          select: () => ({
            events: () => xs.Stream.never()
          })
        },
        props: xs.Stream.of({ initialCount: 0 })
      };

      const sinks = Counter(sources);

      sinks.DOM.take(1).subscribe({
        next: (vnode: any) => {
          expect(vnode.sel).to.equal('div.counter');
          expect(vnode.children[0].sel).to.equal('button.decrement');
          expect(vnode.children[1].sel).to.equal('span.count');
          expect(vnode.children[2].sel).to.equal('button.increment');

          // Check button labels
          const hasMinusSign = vnode.children.some((child: any) => child.text === '-');
          const hasPlusSign = vnode.children.some((child: any) => child.text === '+');
          expect(hasMinusSign).to.be.true;
          expect(hasPlusSign).to.be.true;

          done();
        }
      });
    });
  });
});
