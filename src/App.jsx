import { useRef, useEffect, useCallback } from "react";
import RBush from "rbush";

import Node from "./components/Node/Node";
import Canvas from "./components/Canvas/Canvas";

import useApp from "./store/useApp";

import "./App.css";
import { getAllAlignments } from "./utils/getAllAlignments";

function App() {
  // Panning
  const scale = useApp((state) => state.scale);
  const panStartPos = useApp((state) => state.panStartPos);
  const panOffsetPos = useApp((state) => state.panOffsetPos);
  const setScale = useApp((state) => state.setScale);
  const setPanStartPos = useApp((state) => state.setPanStartPos);
  const setPanOffsetPos = useApp((state) => state.setPanOffsetPos);

  const initNodes = useApp((state) => state.initNodes);

  const draggingState = useApp((state) => state.draggingState);
  const setDraggingState = useApp((state) => state.setDraggingState);

  const tree = useApp((state) => state.tree);
  const setTree = useApp((state) => state.setTree);
  const setAlignmentCoords = useApp((state) => state.setAlignmentCoords);

  const selectedNodeID = useApp((state) => state.selectedNodeID);
  const selectedNode = useApp((state) => state.selectedNode);
  const setSelectedNodeID = useApp((state) => state.setSelectedNodeID);
  const setSelectedNode = useApp((state) => state.setSelectedNode);
  const setSingleNodePosition = useApp((state) => state.setSingleNodePosition);

  // wrapperRect
  const wrapperRect = useApp((state) => state.wrapperRect);
  const setWrapperRect = useApp((state) => state.setWrapperRect);

  const whiteboardWrapperRef = useRef();
  const selectedNodeRef = useRef();

  // todo
  const startCoordsRef = useRef({ x: 0, y: 0 });

  // init
  const handleMouseDown = (e) => {
    const node = e.target.closest(".node");

    // todo
    if (node) {
      const nodeID = node.dataset.nodeId;
      // idea: maybe I need a map?
      const node_ = initNodes.find((node) => node.id === nodeID);

      startCoordsRef.current.x = e.clientX;
      startCoordsRef.current.y = e.clientY;

      setSelectedNodeID(nodeID);
      setSelectedNode(node_);

      setDraggingState("dragging-node");

      return;
    } else {
      setSelectedNodeID(null);
      setSelectedNode(null);
      selectedNodeRef.current = null;
    }

    // panning
    setDraggingState("panning");
    setPanStartPos({
      x: e.clientX - panOffsetPos.x,
      y: e.clientY - panOffsetPos.y,
    });
  };

  // change
  const handleMouseMove = useCallback(
    (e) => {
      const wrapper = whiteboardWrapperRef.current;
      if (!wrapper) return;

      if (draggingState === "dragging-node") {
        const diffX = (e.clientX - startCoordsRef.current.x) / scale;
        const diffY = (e.clientY - startCoordsRef.current.y) / scale;
        const newX = selectedNode.position.x + diffX;
        const newY = selectedNode.position.y + diffY;

        // re-renders only the selected node
        setSingleNodePosition(selectedNodeID, { x: newX, y: newY });

        // todo
        const BOUNDARY = 500;

        const { dimension } = selectedNode;
        const { width, height } = dimension;

        const nearbyNodes = tree
          .search({
            minX: newX - BOUNDARY,
            maxX: newX + width + BOUNDARY,
            minY: newY - BOUNDARY,
            maxY: newY + height + BOUNDARY,
          })
          .filter((data) => data.node.id !== selectedNode.id);

        const baseNode = {
          id: selectedNode.id,
          dimension: selectedNode.dimension,
          position: { x: newX, y: newY },
        };

        // debug: feeling a bit iffy about this
        const alignments = getAllAlignments(baseNode, nearbyNodes, 5);
        setAlignmentCoords(alignments);

        // debug: this is very mumbo jumbo
        let toSnapX = 0;
        let toSnapY = 0;
        alignments.horizontal.forEach((y) => {
          const coord = y.coord;
          const currentCoord = y.currCoord;

          toSnapY = coord - currentCoord;
        });

        alignments.vertical.forEach((x) => {
          const coord = x.coord;
          const currentCoord = x.currCoord;

          toSnapX = coord - currentCoord;
        });

        setSingleNodePosition(selectedNodeID, {
          x: newX + toSnapX,
          y: newY + toSnapY,
        });
        // debug
        // todo

        return;
      }

      if (draggingState === "panning") {
        setPanOffsetPos({
          x: e.clientX - panStartPos.x,
          y: e.clientY - panStartPos.y,
        });

        return;
      }
    },
    [
      draggingState,
      setSingleNodePosition,
      selectedNodeID,
      scale,
      selectedNode,
      panStartPos,
      setPanOffsetPos,
      tree,
      setAlignmentCoords,
    ]
  );

  // reset
  const handleMouseUp = useCallback(() => {
    setDraggingState(null);
  }, [setDraggingState]);

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

  // set up event handlers
  useEffect(() => {
    const wrapper = whiteboardWrapperRef.current;
    if (!wrapper) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    wrapper.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      wrapper.removeEventListener("wheel", handleWheel);
    };
  }, [scale, panOffsetPos, handleMouseMove, handleMouseUp, handleWheel]);

  // set up tree
  useEffect(() => {
    const tree = new RBush();

    const items = initNodes.map((node) => ({
      minX: node.position.x,
      minY: node.position.y,
      maxX: node.position.x + node.dimension.width,
      maxY: node.position.y + node.dimension.height,
      node: node, // Store original data
    }));

    tree.load(items);

    setTree(tree);
  }, [initNodes, setTree]);

  // set up observer
  useEffect(() => {
    const container = whiteboardWrapperRef.current;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const { x, y } = entries[0].target.getBoundingClientRect();
      const rect = { x, y, width, height };

      setWrapperRect(rect);
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [setWrapperRect]);

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
        {wrapperRect && (
          <>
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
          </>
        )}
      </div>
    </main>
  );
}

export default App;
