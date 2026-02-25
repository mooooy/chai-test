declare module "chai" {
  interface Assertion {
    look: ChaiVirtualDOM.LookAssertion;
  }
  
  namespace ChaiVirtualDOM {
    interface LookAssertion {
      like(expected: any): void;
      exactly: {
        like(expected: any): void;
      };
    }
  }
}

declare module "chai-virtual-dom" {
  import { ChaiPlugin } from "chai";
  const chaiVirtualDom: ChaiPlugin;
  export default chaiVirtualDom;
}

declare module "virtual-dom" {
  export interface VirtualNode {
    tagName: string;
    properties: any;
    children: any[];
    type?: string;
  }
  
  export interface VirtualText {
    type: string;
    text: string;
  }
}
