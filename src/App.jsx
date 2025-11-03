import { useRef, useEffect, useCallback, useState } from "react";

import Node from "./components/Node/Node";
import Canvas from "./components/Canvas/Canvas";

import useApp from "./store/useApp";

import "./App.css";

function App() {
  // Panning
  const isPanning = useApp((state) => state.isPanning);
  const scale = useApp((state) => state.scale);
  const panStartPos = useApp((state) => state.panStartPos);
  const panOffsetPos = useApp((state) => state.panOffsetPos);
  const setScale = useApp((state) => state.setScale);
  const setIsPanning = useApp((state) => state.setIsPanning);
  const setPanStartPos = useApp((state) => state.setPanStartPos);
  const setPanOffsetPos = useApp((state) => state.setPanOffsetPos);

  const initNodes = useApp((state) => state.initNodes);
  const selectedNodeID = useApp((state) => state.selectedNodeID);
  const selectedNode = useApp((state) => state.selectedNode);
  const setSelectedNodeID = useApp((state) => state.setSelectedNodeID);
  const setSelectedNode = useApp((state) => state.setSelectedNode);
  const setSingleNodePosition = useApp((state) => state.setSingleNodePosition);

  // dragging single node
  const isDraggingNode = useApp((state) => state.isDraggingNode);
  const setIsDraggingNode = useApp((state) => state.setIsDraggingNode);

  const whiteboardWrapperRef = useRef();
  const selectedNodeRef = useRef();

  // todo: auto scroll
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });

  // idea: init
  const handleMouseDown = (e) => {
    const node = e.target.closest(".node");

    if (node) {
      const nodeID = node.dataset.nodeId;
      const node_ = initNodes.find((node) => node.id === nodeID);
      if (!node_) return;

      selectedNodeRef.current = node;
      setSelectedNodeID(nodeID);
      setSelectedNode(node_);
      setIsDraggingNode(true);

      // todo
      setStartCoords({ x: e.clientX, y: e.clientY });

      return;
    } else {
      setSelectedNodeID(null);
      setSelectedNode(null);
      selectedNodeRef.current = null;
    }

    // panning
    setIsPanning(true);
    setPanStartPos({
      x: e.clientX - panOffsetPos.x,
      y: e.clientY - panOffsetPos.y,
    });
  };

  // idea: change
  const handleMouseMove = (e) => {
    const wrapper = whiteboardWrapperRef.current;
    if (!wrapper) return;

    if (isDraggingNode) {
      const diffX = (e.clientX - startCoords.x) / scale;
      const diffY = (e.clientY - startCoords.y) / scale;

      const { x, y } = selectedNode.position;

      const transform = `translate(${x + diffX}px, ${y + diffY}px)`;
      selectedNodeRef.current.style.transform = transform;

      return;
    }

    if (isPanning) {
      setPanOffsetPos({
        x: e.clientX - panStartPos.x,
        y: e.clientY - panStartPos.y,
      });
    }
  };

  // idea: reset
  const handleMouseUp = () => {
    if (isDraggingNode) {
      const style = window.getComputedStyle(selectedNodeRef.current);
      const matrix = style.transform;
      const values = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");

      setSingleNodePosition(selectedNodeID, {
        x: parseFloat(values[4]),
        y: parseFloat(values[5]),
      });
    }

    setIsPanning(false);
    setIsDraggingNode(false);
  };

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();

      const wrapper = whiteboardWrapperRef.current;
      const rect = wrapper.getBoundingClientRect();

      if (e.ctrlKey) {
        const zoomAmount = 1 - e.deltaY * 0.01;
        const newScale = Math.max(0.1, Math.min(5, scale * zoomAmount));

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const startPosX = (mouseX - panOffsetPos.x) / scale;
        const startPosY = (mouseY - panOffsetPos.y) / scale;
        const newPanX = mouseX - startPosX * newScale;
        const newPanY = mouseY - startPosY * newScale;

        setScale(newScale);
        setPanOffsetPos({ x: newPanX, y: newPanY });
      } else {
        setPanOffsetPos({
          x: panOffsetPos.x - e.deltaX,
          y: panOffsetPos.y - e.deltaY,
        });
      }
    },
    [panOffsetPos, scale, setScale, setPanOffsetPos]
  );

  useEffect(() => {
    const wrapper = whiteboardWrapperRef.current;
    if (!wrapper) return;

    wrapper.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      wrapper.removeEventListener("wheel", handleWheel);
    };
  }, [scale, panOffsetPos, handleWheel]);

  return (
    <main
      className="page"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="whiteboard-wrapper"
        ref={whiteboardWrapperRef}
        onMouseDown={handleMouseDown}
      >
        <div
          className="whiteboard"
          style={{
            transform: `translate(${panOffsetPos.x}px, ${panOffsetPos.y}px) scale(${scale})`,
            transformOrigin: "0 0",
          }}
        >
          <div className="whiteboard-nodes">
            {initNodes.map((node) => {
              return <Node key={node.id} node={node} />;
            })}
          </div>
        </div>

        <Canvas />
      </div>
    </main>
  );
}

export default App;
