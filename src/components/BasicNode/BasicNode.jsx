import useWhiteboard from "../../store/useWhiteboard";
import usePanning from "../../store/usePanning";
import useNodes from "../../store/useNodes";

import "./BasicNode.css";

// todo: configuration of a node's padding should be allowed

const BasicNode = ({ node }) => {
  // panning
  const scale = usePanning((state) => state.scale);

  // nodes
  const selectedNode = useNodes((state) => state.selectedNode);
  const selectedNodeID = selectedNode?.dataset.nodeId;

  // later
  const isDraggingHandle = useWhiteboard((state) => state.isDraggingHandle);
  const setIsDraggingHandle = useWhiteboard(
    (state) => state.setIsDraggingHandle
  );
  const setHandleDirection = useWhiteboard((state) => state.setHandleDirection);
  const setHandleStartCoords = useWhiteboard(
    (state) => state.setHandleStartCoords
  );
  const setHandleTargetCoords = useWhiteboard(
    (state) => state.setHandleTargetCoords
  );
  const setWhiteboardRect = useWhiteboard((state) => state.setWhiteboardRect);
  const setIsSnapToHandle = useWhiteboard((state) => state.setIsSnapToHandle);
  // later

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const handle = e.currentTarget;
    const direction = handle.dataset.handleDirection;

    const handleRect = handle.getBoundingClientRect();
    const whiteboardDOM = document.querySelector(".whiteboard");
    const whiteboardRect = whiteboardDOM.getBoundingClientRect();

    setIsDraggingHandle(true);
    setHandleDirection(direction);
    setHandleStartCoords({
      x: (handleRect.x - whiteboardRect.x) / scale + 5,
      y: (handleRect.y - whiteboardRect.y) / scale + 5,
    });
    setHandleTargetCoords({
      x: (handleRect.x - whiteboardRect.x) / scale + 5,
      y: (handleRect.y - whiteboardRect.y) / scale + 5,
    });
    setWhiteboardRect({ x: whiteboardRect.x, y: whiteboardRect.y });
  };

  const handleHandleOnMouseEnter = (e) => {
    if (!isDraggingHandle) return;

    const direction = e.target.dataset.handleDirection;
    // fix: need to handle when the arrow goes to itself

    const handle = e.currentTarget;
    const handleRect = handle.getBoundingClientRect();
    const whiteboardDOM = document.querySelector(".whiteboard");
    const whiteboardRect = whiteboardDOM.getBoundingClientRect();

    setIsSnapToHandle(true);
    setHandleTargetCoords({
      x: (handleRect.x - whiteboardRect.x) / scale + 5,
      y: (handleRect.y - whiteboardRect.y) / scale + 5,
    });
  };

  const handleMouseLeave = () => {
    if (isDraggingHandle) {
      setIsSnapToHandle(false);
    }
  };

  return (
    <div
      data-node-id={node.id}
      // className={`node basic-node ${
      //   node.id === selectedNodeID ? "selected-node" : ""
      // }`}
      className={`node basic-node`}
      style={{
        width: node?.dimension.width,
        height: node?.dimension.height,
        transform: `translate(${node?.position.x}px, ${node?.position.y}px)`,
      }}
    >
      <div
        className="basic-node_text"
        contentEditable={true}
        suppressContentEditableWarning={true}
      >
        {node.content.text}
      </div>

      {node.id === selectedNodeID && (
        <>
          <div className="node-resizer_border" data-resizer-border="top" />
          <div className="node-resizer_border" data-resizer-border="right" />
          <div className="node-resizer_border" data-resizer-border="bottom" />
          <div className="node-resizer_border" data-resizer-border="left" />

          <div className="node-resizer_box" data-resizer_box="top"></div>
          <div className="node-resizer_box" data-resizer_box="right"></div>
          <div className="node-resizer_box" data-resizer_box="bottom"></div>
          <div className="node-resizer_box" data-resizer_box="left"></div>
        </>
      )}

      {/* <div
        className="node-handle"
        data-handle-direction="top"
        // onMouseDown={handleMouseDown}
        // onMouseEnter={handleHandleOnMouseEnter}
        // onMouseLeave={handleMouseLeave}
      />
      <div
        className="node-handle"
        data-handle-direction="right"
        // onMouseDown={handleMouseDown}
        // onMouseEnter={handleHandleOnMouseEnter}
        // onMouseLeave={handleMouseLeave}
      />
      <div
        className="node-handle"
        data-handle-direction="bottom"
        // onMouseDown={handleMouseDown}
        // onMouseEnter={handleHandleOnMouseEnter}
        // onMouseLeave={handleMouseLeave}
      />
      <div
        className="node-handle"
        data-handle-direction="left"
        // onMouseDown={handleMouseDown}
        // onMouseEnter={handleHandleOnMouseEnter}
        // onMouseLeave={handleMouseLeave}
      /> */}
    </div>
  );
};

export default BasicNode;
