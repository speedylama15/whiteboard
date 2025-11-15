import { memo } from "react";

import NodeHandle from "./NodeHandle/NodeHandle";
import NodeConnector from "./NodeConnector/NodeConnector";

import useApp from "../../store/useApp";
import useTree from "../../store/useTree";
import useCoords from "../../store/useCoords";

import "./Node.css";

const Node = memo(({ nodeID }) => {
  const node = useApp((state) => state.nodesMap[nodeID]);
  const isSelected = useApp((state) =>
    state.selectedNodesMap[nodeID] ? true : false
  );

  const mouseState = useApp((state) => state.mouseState);

  const set_nodesTree = useTree((state) => state.set_nodesTree);
  const set_startXY = useCoords((state) => state.set_startXY);
  const set_selectedNodesMap = useApp((state) => state.set_selectedNodesMap);
  const set_mouseState = useApp((state) => state.set_mouseState);

  const handleMouseDown = (e) => {
    e.stopPropagation();

    set_nodesTree([nodeID]);
    set_startXY({ x: e.clientX, y: e.clientY });
    set_selectedNodesMap({ [nodeID]: node });
    set_mouseState("node_move");
  };

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
      onMouseDown={handleMouseDown}
    >
      <div
        className="node_text"
        contentEditable={true}
        suppressContentEditableWarning={true}
      >
        {node.content.text}
      </div>

      {mouseState === "edge_create" && (
        <>
          <NodeConnector node={node} connectorLocation="top" />
          <NodeConnector node={node} connectorLocation="right" />
          <NodeConnector node={node} connectorLocation="bottom" />
          <NodeConnector node={node} connectorLocation="left" />
        </>
      )}

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
