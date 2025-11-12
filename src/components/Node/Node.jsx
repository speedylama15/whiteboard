import { memo } from "react";

import NodeHandle from "./NodeHandle/NodeHandle";
import NodeConnector from "./NodeConnector/NodeConnector";

import useApp from "../../store/useApp";

import "./Node.css";

// I do not have to remove and insert when a node is getting updated
// all I have to do is search with the appropriate data
// but I need to do so for visual sake

const Node = memo(({ nodeID }) => {
  // debug
  console.log("render", nodeID);

  const rTree = useApp((state) => state.rTree);
  const node = useApp((state) => state.nodesMap[nodeID]);
  const bbox = {
    minX: node.position.x,
    minY: node.position.y,
    maxX: node.position.x + node.dimension.width,
    maxY: node.position.y + node.dimension.height,
    node: node,
  };
  const isSelected = useApp((state) =>
    state.selectedNodesMap[nodeID] ? true : false
  );

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
        style={{ minWidth: "2px", backgroundColor: "#152186ff" }}
      >
        {node.content.text}
      </div>

      <>
        <NodeConnector connectorLocation="top" />
        <NodeConnector connectorLocation="right" />
        <NodeConnector connectorLocation="bottom" />
        <NodeConnector connectorLocation="left" />
      </>

      {isSelected && (
        <>
          <NodeHandle node={node} handleLocation={"top"} />
          <NodeHandle node={node} handleLocation={"right"} />
          <NodeHandle node={node} handleLocation={"bottom"} />
          <NodeHandle node={node} handleLocation={"left"} />
        </>
      )}
    </div>
  );
});

export default Node;
