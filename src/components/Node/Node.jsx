import { memo } from "react";

import NodeHandle from "./NodeHandle/NodeHandle";

import useApp from "../../store/useApp";

import { getHandleCoords } from "../../utils/getHandleCoords";

import "./Node.css";

const Node = memo(({ nodeID }) => {
  // debug
  console.log("render", nodeID);

  const node = useApp((state) => state.nodesMap[nodeID]);
  const isSelected = useApp((state) => state.selectedNodeID === node.id);
  const setMouseState = useApp((state) => state.setMouseState);
  const setSelectedNodeID = useApp((state) => state.setSelectedNodeID);

  const handleMouseDown = (e) => {
    e.stopPropagation();

    setSelectedNodeID(node.id);
    setMouseState("moving-node");
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
        style={{ minWidth: "2px", backgroundColor: "#152186ff" }}
      >
        {node.content.text}
      </div>
    </div>
  );
});

// const Node = memo(({ node }) => {
//   const isSelected = useApp((state) => state.selectedNodeID === node.id);

//   const top = getHandleCoords(node, "top");
//   const right = getHandleCoords(node, "right");
//   const bottom = getHandleCoords(node, "bottom");
//   const left = getHandleCoords(node, "left");

//   return (
//     <div
//       data-node-id={node.id}
//       className="node basic-node"
//       data-is-selected={isSelected}
//       style={{
//         width: node.dimension.width,
//         height: node.dimension.height,
//         transform: `translate(${node.position.x}px, ${node.position.y}px)`,
//       }}
//     >
//       <div
//         className="node_text"
//         contentEditable={true}
//         suppressContentEditableWarning={true}
//         style={{ minWidth: "2px", backgroundColor: "#152186ff" }}
//       >
//         {node.content.text}
//       </div>

//       {isSelected && (
//         <>
//           <NodeHandle
//             data-node-id={node.id}
//             handleLocation={"top"}
//             handleCoords={top}
//           />
//           <NodeHandle
//             data-node-id={node.id}
//             handleLocation={"right"}
//             handleCoords={right}
//           />
//           <NodeHandle
//             data-node-id={node.id}
//             handleLocation={"bottom"}
//             handleCoords={bottom}
//           />
//           <NodeHandle
//             data-node-id={node.id}
//             handleLocation={"left"}
//             handleCoords={left}
//           />
//         </>
//       )}
//     </div>
//   );
// });

export default Node;
