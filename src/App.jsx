import { useRef, useEffect, useCallback } from "react";

import Node from "./components/Node/Node";
import Edge from "./components/Edge/Edge";
import NewEdge from "./components/NewEdge/NewEdge";
import Canvas from "./components/Canvas/Canvas";

import useApp from "./store/useApp";

import { getAllAlignments } from "./utils/getAllAlignments";
import { getWhiteboardCoords } from "./utils/getMouseCoords";

import "./App.css";

const App = () => {
  const nodesMap = useApp((state) => state.nodesMap);
  const updateNode = useApp((state) => state.updateNode);

  const rTree = useApp((state) => state.rTree);
  const setVerticalLines = useApp((state) => state.setVerticalLines);
  const setHorizontalLines = useApp((state) => state.setHorizontalLines);

  const selectedNodesMap = useApp((state) => state.selectedNodesMap);
  const setSelectedNodesMap = useApp((state) => state.setSelectedNodesMap);
  const resetSelectedNodesMap = useApp((state) => state.resetSelectedNodesMap);

  const edgesMap = useApp((state) => state.edgesMap);
  const newEdgeStartCoords = useApp((state) => state.newEdgeStartCoords);
  const setNewEdgeTargetCoords = useApp(
    (state) => state.setNewEdgeTargetCoords
  );

  const mouseState = useApp((state) => state.mouseState);
  const setMouseState = useApp((state) => state.setMouseState);

  const wrapperRect = useApp((state) => state.wrapperRect);
  const setWrapperRect = useApp((state) => state.setWrapperRect);

  // panning
  const scale = useApp((state) => state.scale);
  const panOffsetCoords = useApp((state) => state.panOffsetCoords);
  const setScale = useApp((state) => state.setScale);
  const setPanOffsetCoords = useApp((state) => state.setPanOffsetCoords);

  // <------- ref ------->
  const whiteboardWrapperRef = useRef();
  const startCoordsRef = useRef();

  // init
  const handleMouseDown = useCallback(
    (e) => {
      const node = e.target.closest(".node");

      if (node) {
        const nodeID = node.dataset.nodeId;
        const node_ = nodesMap[nodeID];

        // todo
        // todo: this is for single selected node
        const items = Object.values(nodesMap)
          .filter((node) => node.id !== nodeID)
          .map((node) => {
            return {
              minX: node.position.x,
              minY: node.position.y,
              maxX: node.position.x + node.dimension.width,
              maxY: node.position.y + node.dimension.height,
              node: node,
            };
          });

        rTree.clear();
        rTree.load(items);
        // todo

        startCoordsRef.current = { x: e.clientX, y: e.clientY };
        resetSelectedNodesMap();
        setMouseState("moving-node");
        setSelectedNodesMap({ [nodeID]: node_ });

        return;
      } else {
        resetSelectedNodesMap();
      }

      setMouseState("panning");
      startCoordsRef.current = {
        x: e.clientX - panOffsetCoords.x,
        y: e.clientY - panOffsetCoords.y,
      };
    },
    [
      panOffsetCoords,
      nodesMap,
      setMouseState,
      setSelectedNodesMap,
      resetSelectedNodesMap,
      rTree,
    ]
  );

  // idea
  const prevBBoxRef = useRef();
  // change
  const handleMouseMove = useCallback(
    (e) => {
      const wrapper = whiteboardWrapperRef.current;
      if (!wrapper) return;

      // REVIEW:
      if (mouseState === "dragging-edge") {
        // debug
        console.log("setting up new edge");

        const coords = getWhiteboardCoords(
          e,
          panOffsetCoords,
          scale,
          wrapperRect
        );
        setNewEdgeTargetCoords(coords);

        return;
      }

      if (mouseState === "moving-node") {
        const diffX = (e.clientX - startCoordsRef.current.x) / scale;
        const diffY = (e.clientY - startCoordsRef.current.y) / scale;

        Object.keys(selectedNodesMap).forEach((nodeID) => {
          const node = selectedNodesMap[nodeID];

          // todo
          const BOUNDARY = 500;

          // for visual
          if (prevBBoxRef.current) rTree.remove(prevBBoxRef.current);
          // for visual

          const bbox = {
            minX: node.position.x + diffX - BOUNDARY,
            minY: node.position.y + diffY - BOUNDARY,
            maxX: node.position.x + diffX + node.dimension.width + BOUNDARY,
            maxY: node.position.y + diffY + node.dimension.height + BOUNDARY,
            node: node,
          };
          prevBBoxRef.current = bbox;

          // for visual
          rTree.insert(bbox);

          const nearbyNodes = rTree
            .search(bbox)
            .filter((item) => item.node.id !== node.id);

          const baseNode = {
            dimension: node.dimension,
            position: {
              x: node.position.x + diffX,
              y: node.position.y + diffY,
            },
          };

          let gapX = 0;
          let gapY = 0;

          const alignments = getAllAlignments(baseNode, nearbyNodes, 5);
          if (alignments.vertical.length) {
            gapX = alignments.vertical[0].gap;
            setVerticalLines(alignments.vertical);
          } else {
            setVerticalLines([]);
          }
          if (alignments.horizontal.length) {
            gapY = alignments.horizontal[0].gap;
            setHorizontalLines(alignments.horizontal);
          } else {
            setHorizontalLines([]);
          }

          updateNode(nodeID, {
            ...node,
            position: {
              x: node.position.x + diffX + gapX,
              y: node.position.y + diffY + gapY,
            },
          });
          // todo
        });

        return;
      }

      if (mouseState === "panning") {
        setPanOffsetCoords({
          x: e.clientX - startCoordsRef.current.x,
          y: e.clientY - startCoordsRef.current.y,
        });

        return;
      }
    },
    [
      mouseState,
      selectedNodesMap,
      scale,
      setPanOffsetCoords,
      updateNode,
      rTree,
      setVerticalLines,
      setHorizontalLines,
      panOffsetCoords,
      setNewEdgeTargetCoords,
      wrapperRect,
    ]
  );

  // reset
  const handleMouseUp = useCallback(() => {
    setMouseState(null);
    setVerticalLines([]);
    setHorizontalLines([]);
    startCoordsRef.current = {
      x: 0,
      y: 0,
    };
  }, [setMouseState, setVerticalLines, setHorizontalLines]);

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
        const startPosX = (mouseX - panOffsetCoords.x) / scale;
        const startPosY = (mouseY - panOffsetCoords.y) / scale;
        const newPanX = mouseX - startPosX * newScale;
        const newPanY = mouseY - startPosY * newScale;

        setScale(newScale);
        setPanOffsetCoords({ x: newPanX, y: newPanY });
      } else {
        setPanOffsetCoords({
          x: panOffsetCoords.x - e.deltaX,
          y: panOffsetCoords.y - e.deltaY,
        });
      }
    },
    [panOffsetCoords, scale, setScale, setPanOffsetCoords]
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
  }, [handleMouseMove, handleMouseUp, handleWheel]);

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
    <main className="page">
      <button onClick={() => console.log("rTree", rTree.toJSON())}>
        Click
      </button>

      <div
        className="whiteboard-wrapper"
        ref={whiteboardWrapperRef}
        onMouseDown={handleMouseDown}
      >
        <div
          className="whiteboard"
          style={{
            transform: `translate(${panOffsetCoords.x}px, ${panOffsetCoords.y}px) scale(${scale})`,
            transformOrigin: "0 0",
          }}
        >
          <div className="whiteboard-nodes">
            {Object.keys(nodesMap).map((nodeID) => {
              return <Node key={nodeID} nodeID={nodeID} />;
            })}
          </div>

          <div className="whiteboard-edges">
            {Object.keys(edgesMap).map((edgeID) => {
              return <Edge key={edgeID} edgeID={edgeID} />;
            })}
          </div>

          {newEdgeStartCoords && <NewEdge />}

          {/* review */}
        </div>

        {wrapperRect && <Canvas />}
      </div>
    </main>
  );
};

export default App;
