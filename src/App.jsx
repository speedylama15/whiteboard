import { useRef, useEffect, useCallback } from "react";

import Node from "./components/Node/Node";
import Edge from "./components/Edge/Edge";
import NewEdge from "./components/NewEdge/NewEdge";

import AlignmentLines from "./components/AlignmentLines/AlignmentLines";

import NodesTree from "./components/Tree/NodesTree/NodesTree";
import SearchBoxesTree from "./components/Tree/SearchBoxesTree/SearchBoxesTree";

import useApp from "./store/useApp";
import useTree from "./store/useTree";
import useCoords from "./store/useCoords";

import { getAllAlignments } from "./utils/getAllAlignments";

import "./App.css";
import useEdge from "./store/useEdge";
import { getWhiteboardCoords } from "./utils/getMouseCoords";
import { getHandleCoords } from "./utils/getHandleCoords";

function getClosestSide(node, point) {
  const { position, dimension } = node;
  const { x, y } = position;
  const { width, height } = dimension;

  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const px = point.x - centerX;
  const py = point.y - centerY;

  const halfWidth = width / 2;
  const halfHeight = height / 2;

  if (px === 0) {
    return py > 0 ? "bottom" : "top";
  }

  if (Math.abs(py / px) > halfHeight / halfWidth) {
    return py > 0 ? "bottom" : "top";
  } else {
    return px > 0 ? "right" : "left";
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getSnapXY(node, side, mouseXY) {
  const { x, y } = node.position;
  const { width, height } = node.dimension;

  const coords = {
    top: { x: x + width / 2, y },
    right: { x: x + width, y: y + height / 2 },
    bottom: { x: x + width / 2, y: y + height },
    left: { x, y: y + height / 2 },
  };

  const mouseAxis = side === "top" || side === "bottom" ? "x" : "y";
  const otherAxis = mouseAxis === "x" ? "y" : "x";
  const dimension = side === "top" || side === "bottom" ? "width" : "height";
  const otherDimension =
    side === "top" || side === "bottom" ? "height" : "width";

  const centerCoord = coords[side][mouseAxis];
  const mouseCoord = clamp(
    mouseXY[mouseAxis],
    node.position[mouseAxis],
    node.position[mouseAxis] + node.dimension[dimension]
  );

  const gap = Math.abs(centerCoord - mouseCoord);
  const addition =
    side === "bottom" || side === "right" ? node.dimension[otherDimension] : 0;

  return {
    [mouseAxis]: gap <= 7 ? centerCoord : mouseCoord,
    [otherAxis]: node.position[otherAxis] + addition,
  };
}

const App = () => {
  // <------- new ------->
  const nodesMap = useApp((state) => state.nodesMap);
  const set_node = useApp((state) => state.set_node);

  // nodes tree
  const nodesTree = useTree((state) => state.nodesTree);
  const reset_nodesTree = useTree((state) => state.reset_nodesTree);

  // search boxes tree
  const searchBoxesTree = useTree((state) => state.searchBoxesTree);
  const set_searchBoxesTree = useTree((state) => state.set_searchBoxesTree);
  const reset_searchBoxesTree = useTree((state) => state.reset_searchBoxesTree);

  // selected nodes
  const selectedNodesMap = useApp((state) => state.selectedNodesMap);
  const reset_selectedNodesMap = useApp(
    (state) => state.reset_selectedNodesMap
  );

  // mouse state
  const mouseState = useApp((state) => state.mouseState);
  const set_mouseState = useApp((state) => state.set_mouseState);

  const wrapperRect = useApp((state) => state.wrapperRect);
  const set_wrapperRect = useApp((state) => state.set_wrapperRect);

  const startXY = useCoords((state) => state.startXY);

  const edgesMap = useEdge((state) => state.edgesMap);
  const set_edge = useEdge((state) => state.set_edge);

  const edgeData = useEdge((state) => state.edgeData);
  const set_edgeData = useEdge((state) => state.set_edgeData);
  // const reset_edgeData = useEdge((state) => state.reset_edgeData);

  // <------- new ------->

  const setVerticalLines = useApp((state) => state.setVerticalLines);
  const setHorizontalLines = useApp((state) => state.setHorizontalLines);

  // panning
  const scale = useApp((state) => state.scale);
  const set_scale = useApp((state) => state.set_scale);
  const panOffsetXY = useApp((state) => state.panOffsetXY);
  const set_panOffsetXY = useApp((state) => state.set_panOffsetXY);

  // <------- ref ------->
  const whiteboardWrapperRef = useRef();
  // <------- ref ------->

  const handleMouseDown = useCallback(() => {
    // this gets triggered, when non-node, edge element is clicked
    reset_nodesTree();
    reset_searchBoxesTree();
    reset_selectedNodesMap();
  }, [reset_nodesTree, reset_searchBoxesTree, reset_selectedNodesMap]);

  const handleMouseMove = useCallback(
    (e) => {
      const wrapper = whiteboardWrapperRef.current;
      if (!wrapper) return;

      if (mouseState === "node_move") {
        const BOUNDARY = 500;

        // make it move by 1px
        const diffX = Math.floor((e.clientX - startXY.x) / scale / 1) * 1;
        const diffY = Math.floor((e.clientY - startXY.y) / scale / 1) * 1;

        // select a single node for diff + gap calc
        const node = Object.values(selectedNodesMap)[0];

        const searchBox = {
          minX: node.position.x + diffX - BOUNDARY,
          minY: node.position.y + diffY - BOUNDARY,
          maxX: node.position.x + diffX + node.dimension.width + BOUNDARY,
          maxY: node.position.y + diffY + node.dimension.height + BOUNDARY,
          node: node,
        };

        // supply box, create new tree, insert box, and set searchBoxesTree
        set_searchBoxesTree(searchBox);

        // actual search for nearby nodes
        const nearbyNodes = nodesTree
          .search(searchBox)
          .filter((item) => item.node.id !== node.id);

        const baseNode = {
          dimension: node.dimension,
          position: {
            x: node.position.x + diffX,
            y: node.position.y + diffY,
          },
        };

        // gap will always be an integer
        // because x and y of a node will always be an integer
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

        // loop through and update the x, y of each selected node
        Object.keys(selectedNodesMap).forEach((nodeID) => {
          set_node(nodeID, {
            ...node,
            position: {
              x: node.position.x + diffX + gapX,
              y: node.position.y + diffY + gapY,
            },
          });
        });

        return;
      }

      if (mouseState === "edge_create") {
        document.body.style.userSelect = "none";
        const BOUNDARY = 10;

        const mouseXY = getWhiteboardCoords(e, panOffsetXY, scale, wrapperRect);

        const searchBox = {
          minX: mouseXY.x - BOUNDARY,
          minY: mouseXY.y - BOUNDARY,
          maxX: mouseXY.x + BOUNDARY,
          maxY: mouseXY.y + BOUNDARY,
        };

        set_searchBoxesTree(searchBox);

        const result = nodesTree.search(searchBox);

        if (result.length > 0) {
          const { node } = result[0];

          const side = getClosestSide(node, mouseXY);
          const snapXY = getSnapXY(node, side, mouseXY);

          set_edgeData({
            targetID: node.id,
            targetLoc: side,
            targetXY: snapXY,
          });
        } else {
          set_edgeData({ targetID: null, targetLoc: null, targetXY: mouseXY });
        }
      }
    },
    [
      mouseState,
      nodesTree,
      startXY,
      selectedNodesMap,
      wrapperRect,
      panOffsetXY,
      scale,
      set_node,
      setVerticalLines,
      setHorizontalLines,
      set_searchBoxesTree,
      set_edgeData,
    ]
  );

  // reset
  const handleMouseUp = useCallback(() => {
    if (mouseState === "edge_create") {
      if (!edgeData.targetID) {
        console.log(`show toolbar: node ${edgeData.sourceID}`);
      } else {
        // todo

        const { id, sourceID, sourceLoc, targetID, targetLoc, targetXY } =
          edgeData;

        const axis = targetLoc === "top" || targetLoc === "bottom" ? "x" : "y";

        const targetNode = nodesMap[targetID];
        const offsetCoord = targetXY[axis];
        const centerCoord = getHandleCoords(targetNode, targetLoc)[axis];

        const offset = offsetCoord - centerCoord;

        const newEdge = {
          id,
          sourceID,
          targetID,
          sourceLoc,
          targetLoc,
          offset,
        };

        set_edge(id, newEdge);
      }
    }

    set_mouseState(null);
    setVerticalLines([]);
    setHorizontalLines([]);
  }, [
    nodesMap,
    mouseState,
    edgeData,
    set_mouseState,
    setVerticalLines,
    setHorizontalLines,
    set_edge,
  ]);

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
        const startPosX = (mouseX - panOffsetXY.x) / scale;
        const startPosY = (mouseY - panOffsetXY.y) / scale;
        const newPanX = mouseX - startPosX * newScale;
        const newPanY = mouseY - startPosY * newScale;

        set_scale(newScale);
        set_panOffsetXY({ x: newPanX, y: newPanY });
      } else {
        set_panOffsetXY({
          x: panOffsetXY.x - e.deltaX,
          y: panOffsetXY.y - e.deltaY,
        });
      }
    },
    [panOffsetXY, scale, set_scale, set_panOffsetXY]
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

      set_wrapperRect(rect);
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [set_wrapperRect]);

  return (
    <main className="page">
      <div className="toolbar">
        <button onClick={() => console.log("nodesTree", nodesTree.toJSON())}>
          Nodes Tree
        </button>

        <button onClick={() => console.log("rTree")}>Edges Tree</button>

        <button onClick={() => console.log("rTree")}>Connectors Tree</button>

        <button
          onClick={() =>
            console.log("searchBoxesTree", searchBoxesTree.toJSON())
          }
        >
          Search Boxes Tree
        </button>
      </div>

      <div
        className="whiteboard-wrapper"
        ref={whiteboardWrapperRef}
        onMouseDown={handleMouseDown}
      >
        <div
          className="whiteboard"
          style={{
            transform: `translate(${panOffsetXY.x}px, ${panOffsetXY.y}px) scale(${scale})`,
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

          {mouseState === "edge_create" && <NewEdge />}

          {/* review */}
        </div>

        {wrapperRect && (
          <>
            <AlignmentLines />
            <NodesTree />
            <SearchBoxesTree />
          </>
        )}
      </div>
    </main>
  );
};

export default App;
