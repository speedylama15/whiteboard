import { useRef, useEffect, useCallback } from "react";

import Node from "./components/Node/Node";
import Edge from "./components/Edge/Edge";
import NewEdge from "./components/NewEdge/NewEdge";

import AlignmentLines from "./components/AlignmentLines/AlignmentLines";

import NodesTree from "./components/Tree/NodesTree/NodesTree";
import SearchBoxesTree from "./components/Tree/SearchBoxesTree/SearchBoxesTree";

import useApp from "./store/useApp";
import useTree from "./store/useTree";
import useEdge from "./store/useEdge";

import { getAxisAlignments } from "./utils/getAxisAlignments";
import { getWhiteboardCoords } from "./utils/getMouseCoords";
import { getHandleCoords } from "./utils/getHandleCoords";
import { getAngle } from "./utils/getAngle";
import { getClosestSide } from "./utils/getClosestSide";
import { getPanValues } from "./utils/getPanValues";
import { getRotatedVertices } from "./utils/getRotatedVertices";
import { getSnapXY } from "./utils/getSnapXY";

import "./App.css";

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

  const edgesMap = useEdge((state) => state.edgesMap);
  const set_edge = useEdge((state) => state.set_edge);

  const edgeData = useEdge((state) => state.edgeData);
  const set_edgeData = useEdge((state) => state.set_edgeData);

  // <------- new ------->

  const set_verticalLines = useApp((state) => state.set_verticalLines);
  const set_horizontalLines = useApp((state) => state.set_horizontalLines);

  // panning
  const scale = useApp((state) => state.scale);
  const set_scale = useApp((state) => state.set_scale);
  const panOffsetXY = useApp((state) => state.panOffsetXY);
  const set_panOffsetXY = useApp((state) => state.set_panOffsetXY);

  // <------- ref ------->
  const whiteboardWrapperRef = useRef();

  // review: for requestAnimationFrame
  const frameIDRef = useRef(null);
  const panVelocityRef = useRef({ x: 0, y: 0 });

  // review: startXY will be registered in mouse move
  // review: because scale may differ when mousedown and mousemove were invoked
  const startXYRef = useRef(null);
  const wrapperRectRef = useRef(null);
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

      if (mouseState === "node_rotate") {
        document.body.style.userSelect = "none";

        const node = Object.values(selectedNodesMap)[0];
        const nodeID = node.id;
        const nodeDOM = document.querySelector(`[data-node-id="${nodeID}"]`);

        const currentAngle = getAngle(e, nodeDOM);

        Object.keys(selectedNodesMap).forEach((nodeID) => {
          set_node(nodeID, {
            ...nodesMap[nodeID],
            rotation: currentAngle,
          });
        });

        return;
      }

      if (mouseState === "node_move") {
        const SEARCH_BOUNDARY = 500;

        const { x, y } = getWhiteboardCoords(
          e,
          panOffsetXY,
          scale,
          wrapperRect
        );

        if (startXYRef.current === null) {
          startXYRef.current = { x, y };
        }

        if (wrapperRectRef.current === null) {
          wrapperRectRef.current =
            whiteboardWrapperRef.current.getBoundingClientRect();
        }

        // for panning
        const { panX, panY } = getPanValues(e, wrapperRectRef.current);
        panVelocityRef.current = { x: panX, y: panY };

        // make it move by 1px
        const diffX = Math.floor(x - startXYRef.current.x) * 1;
        const diffY = Math.floor(y - startXYRef.current.y) * 1;

        // select a single node for diff + gap calc
        const node = Object.values(selectedNodesMap)[0];

        // supply box, create new tree, insert box, and set searchBoxesTree
        const { minX, maxX, minY, maxY, width, height } =
          getRotatedVertices(node);
        const searchBox = {
          minX: minX + diffX - SEARCH_BOUNDARY,
          minY: minY + diffY - SEARCH_BOUNDARY,
          maxX: maxX + diffX + SEARCH_BOUNDARY,
          maxY: maxY + diffY + SEARCH_BOUNDARY,
          node: node,
        };
        set_searchBoxesTree(searchBox);

        // actual search for nearby nodes
        const nearbyNodes = nodesTree
          .search(searchBox)
          .filter((item) => item.node.id !== node.id);

        const baseNode = {
          dimension: { width, height },
          position: {
            x: minX + diffX,
            y: minY + diffY,
          },
        };

        // gap will always be an integer
        // because x and y of a node will always be an integer
        let gapX = 0;
        let gapY = 0;

        const { horizontalLines, verticalLines } = getAxisAlignments(
          baseNode,
          nearbyNodes,
          5
        );

        if (verticalLines.length) gapX = verticalLines[0].gap;
        if (horizontalLines.length) gapY = horizontalLines[0].gap;
        set_verticalLines(verticalLines);
        set_horizontalLines(horizontalLines);

        // todo: I need to combine horizontalLines of axis based with distance based
        // todo: I need to combine verticalLines of axis based with distance based
        // todo: axis based takes priority
        // todo: now how the priority works amongst them is something I have to think about later

        if (!frameIDRef.current && (panX !== 0 || panY !== 0)) {
          // review: recursive
          // review: defined ONCE
          // review: let panX, panY are redefined each re-render
          // review: therefore, animate() loses access to the original panX and panY
          // review: that is why we have to use useRef because useRef persists and remains
          const animate = () => {
            const { x, y } = panVelocityRef.current;

            if (x === 0 && y === 0) {
              frameIDRef.current = null;
              return;
            }

            set_panOffsetXY((prev) => ({
              x: prev.x + x,
              y: prev.y + y,
            }));

            frameIDRef.current = requestAnimationFrame(animate);
          };

          animate();
        }

        // loop through and update the x, y of each selected node
        Object.keys(selectedNodesMap).forEach((nodeID) => {
          set_node(nodeID, {
            ...nodesMap[nodeID],
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
      nodesMap,
      nodesTree,
      selectedNodesMap,
      wrapperRect,
      panOffsetXY,
      scale,
      set_node,
      set_verticalLines,
      set_horizontalLines,
      set_searchBoxesTree,
      set_edgeData,
      set_panOffsetXY,
    ]
  );

  // reset
  const handleMouseUp = useCallback(() => {
    if (frameIDRef.current) {
      // review: make sure to cancel this
      cancelAnimationFrame(frameIDRef.current);

      frameIDRef.current = null;
    }

    if (mouseState === "edge_create") {
      if (!edgeData.targetID) {
        // todo
        console.log(`show toolbar: node ${edgeData.sourceID}`);
      } else {
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

    startXYRef.current = null;
    wrapperRectRef.current = null;
    panVelocityRef.current = { x: 0, y: 0 };

    set_mouseState(null);
    set_verticalLines([]);
    set_horizontalLines([]);
  }, [
    nodesMap,
    mouseState,
    edgeData,
    set_mouseState,
    set_verticalLines,
    set_horizontalLines,
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
        set_panOffsetXY((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
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
            {/* fix */}
            <svg className="react-flow__marker" aria-hidden="true">
              <defs>
                <marker
                  className="react-flow__arrowhead"
                  id="1__type=arrow"
                  markerWidth="12.5"
                  markerHeight="12.5"
                  viewBox="-10 -10 20 20"
                  markerUnits="strokeWidth"
                  orient="auto-start-reverse"
                  refX="0"
                  refY="0"
                >
                  <polyline
                    className="arrow"
                    strokeLinecap="round"
                    fill="none"
                    strokeLinejoin="round"
                    points="-5,-4 0,0 -5,4"
                    style={{ strokeWidth: 2, stroke: "#000000ff" }}
                  ></polyline>
                </marker>
              </defs>
            </svg>
            {/* fix */}

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
