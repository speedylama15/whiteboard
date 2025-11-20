import { useRef } from "react";

import useApp from "../../../store/useApp";

import "./NodeRotator.css";

const NodeRotator = ({ node }) => {
  const set_selectedNodesMap = useApp((state) => state.set_selectedNodesMap);
  const set_mouseState = useApp((state) => state.set_mouseState);

  const rotatorRef = useRef();

  const handleMouseDown = (e) => {
    e.stopPropagation();

    // this is needed unfortunately
    set_selectedNodesMap({ [node.id]: node });
    set_mouseState("node_rotate");
  };

  return (
    <div
      ref={rotatorRef}
      className="node-rotator"
      data-node-id={node.id}
      onMouseDown={handleMouseDown}
    />
  );
};

export default NodeRotator;
