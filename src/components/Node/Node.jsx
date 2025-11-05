import { memo } from "react";

import useApp from "../../store/useApp";

import "./Node.css";

const Node = memo(({ node }) => {
  // debug
  console.log(node.id, "render");

  const isSelected = useApp((state) => state.selectedNodeID === node.id);

  return (
    <div
      data-node-id={node.id}
      className="node basic-node"
      data-is-selected={isSelected}
      style={{
        width: node.dimension.width,
        height: node.dimension.height,
        transform: `translate(${node.position.x}px, ${node.position.y}px)`,
      }}
    >
      <div
        className="node_text"
        contentEditable={true}
        suppressContentEditableWarning={true}
      >
        {node.content.text}
      </div>
    </div>
  );
});

export default Node;
