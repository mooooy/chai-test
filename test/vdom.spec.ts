const chai = require("chai");
const chaiVirtualDom = require("chai-virtual-dom");

const expect = chai.expect;

// Register the plugin
chai.use(chaiVirtualDom);

describe("chai-virtual-dom exploration", () => {
  describe("basic usage", () => {
    it("should compare simple virtual DOM elements", () => {
      const actual = {
        tagName: "div",
        properties: { className: "container" },
        children: [{ type: "VirtualText", text: "Hello" }]
      };
      
      const expected = {
        tagName: "div",
        properties: { className: "container" },
        children: [{ type: "VirtualText", text: "Hello" }]
      };
      
      expect(actual).to.look.like(expected);
    });

    it("should compare elements exactly", () => {
      const actual = {
        tagName: "div",
        properties: { className: "container", id: "test" },
        children: []
      };
      
      const expected = {
        tagName: "div",
        properties: { className: "container", id: "test" },
        children: []
      };
      
      expect(actual).to.look.exactly.like(expected);
    });

    it("should handle nested structures", () => {
      const actual = {
        tagName: "div",
        properties: { className: "parent" },
        children: [
          { type: "VirtualText", text: "Child 1" },
          {
            tagName: "span",
            properties: { className: "child" },
            children: [{ type: "VirtualText", text: "Nested" }]
          }
        ]
      };
      
      expect(actual).to.look.like({
        tagName: "div",
        properties: { className: "parent" },
        children: [
          { type: "VirtualText", text: "Child 1" },
          {
            tagName: "span",
            properties: { className: "child" },
            children: [{ type: "VirtualText", text: "Nested" }]
          }
        ]
      });
    });
  });

  describe("partial matching", () => {
    it("should allow partial child matching", () => {
      const actual = {
        tagName: "div",
        properties: { className: "container" },
        children: [
          { type: "VirtualText", text: "Child 1" },
          { type: "VirtualText", text: "Child 2" },
          { type: "VirtualText", text: "Child 3" }
        ]
      };
      
      // Only need to specify the children we care about
      const expected = {
        tagName: "div",
        properties: { className: "container" },
        children: [
          { type: "VirtualText", text: "Child 1" },
          { type: "VirtualText", text: "Child 2" }
        ]
      };
      
      expect(actual).to.look.like(expected);
    });
  });
});
