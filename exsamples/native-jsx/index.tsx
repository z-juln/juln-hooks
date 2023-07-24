import * as React from "../native-jsx";

const MyNode = <span>xxx</span>;
const Comp = ({ text, children }: { text: string; children?: any }) => (
  <span>
    {text}
    {children}
  </span>
);
export const Test = (
  <div className="test-container" style={{ backgroundColor: "red" }}>
    <p>test</p>
    {MyNode}
    <input type="checkbox" checked />
    <Comp text="xxx" />
  </div>
);
