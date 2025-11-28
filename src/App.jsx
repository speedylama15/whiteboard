import { useRef, useEffect, useCallback } from "react";

import Node from "./components/Node/Node";
import Edge from "./components/Edge/Edge";
import NewEdge from "./components/NewEdge/NewEdge";

import AlignmentLines from "./components/AlignmentLines/AlignmentLines";

import NodesTree from "./components/Tree/NodesTree/NodesTree";
import SearchBoxesTree from "./components/Tree/SearchBoxesTree/SearchBoxesTree";

import GroupBox from "./components/GroupBox/GroupBox";

import useApp from "./store/useApp";
import useTree from "./store/useTree";
import useEdge from "./store/useEdge";
import useGroupBox from "./store/useGroupBox";
import useSelection from "./store/useSelection";
import useResize from "./store/useResize";

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
  const set_nodesTree = useTree((state) => state.set_nodesTree);
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

  const set_verticalLines = useApp((state) => state.set_verticalLines);
  const set_horizontalLines = useApp((state) => state.set_horizontalLines);

  // panning
  const scale = useApp((state) => state.scale);
  const set_scale = useApp((state) => state.set_scale);
  const panOffsetXY = useApp((state) => state.panOffsetXY);
  const set_panOffsetXY = useApp((state) => state.set_panOffsetXY);

  const { set_display, set_dimension, set_position, reset_groupBox } =
    useGroupBox();

  const {
    groupSelectedNodesMap,
    set_groupSelectedNodesMap,
    reset_groupSelectedNodesMap,
  } = useSelection();

  const { startResizeXY, resizeDirection } = useResize();

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

  const handleMouseDown = useCallback(
    (e) => {
      // GROUP_SELECTION
      const mouseXY = getWhiteboardCoords(e, panOffsetXY, scale, wrapperRect);

      reset_groupBox();
      set_mouseState("GROUP_SELECTION");
      set_display(true);
      set_position(mouseXY);
      set_nodesTree([]);
      startXYRef.current = mouseXY;
      // GROUP_SELECTION

      reset_groupSelectedNodesMap();
      reset_searchBoxesTree();
      reset_selectedNodesMap();
    },
    [
      panOffsetXY,
      scale,
      wrapperRect,
      set_mouseState,
      reset_searchBoxesTree,
      reset_selectedNodesMap,
      set_nodesTree,
      set_display,
      set_position,
      reset_groupSelectedNodesMap,
      reset_groupBox,
    ]
  );

  const handleMouseMove = useCallback(
    (e) => {
      const wrapper = whiteboardWrapperRef.current;
      if (!wrapper) return;

      // todo
      if (mouseState === "NODE_RESIZE") {
        // document.body.style.cursor = "ns-resize";

        const currMouseXY = getWhiteboardCoords(
          e,
          panOffsetXY,
          scale,
          wrapperRect
        );

        if (resizeDirection === "top") {
          const node = Object.values(selectedNodesMap)[0];
          const diffY = currMouseXY.y - startResizeXY.y;
          const height = node.dimension.height - diffY;

          if (height < 0) {
            console.log({ diffY, height });

            set_node(node.id, {
              ...nodesMap[node.id],
              position: {
                x: node.position.x,
                y: node.position.y + node.dimension.height,
              },
              dimension: {
                width: node.dimension.width,
                height: Math.abs(height),
              },
            });
          } else {
            set_node(node.id, {
              ...nodesMap[node.id],
              position: {
                x: node.position.x,
                y: node.position.y + diffY,
              },
              dimension: {
                width: node.dimension.width,
                height: node.dimension.height - diffY,
              },
            });
          }
        }

        return;
      }
      // todo

      // debug: seeing A LOT of patterns
      if (mouseState === "GROUP_MOVE") {
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

        const diffX = Math.floor(x - startXYRef.current.x) * 1;
        const diffY = Math.floor(y - startXYRef.current.y) * 1;

        if (!frameIDRef.current && (panX !== 0 || panY !== 0)) {
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

        // Object.keys(selectedNodesMap).forEach((nodeID) => {
        //   set_node(nodeID, {
        //     ...nodesMap[nodeID],
        //     position: {
        //       x: node.position.x + diffX + gapX,
        //       y: node.position.y + diffY + gapY,
        //     },
        //   });
        // });

        return;
      }
      // debug

      if (mouseState === "GROUP_SELECTION") {
        const mouseXY = getWhiteboardCoords(e, panOffsetXY, scale, wrapperRect);

        const startX = startXYRef.current.x;
        const startY = startXYRef.current.y;
        const currX = mouseXY.x;
        const currY = mouseXY.y;

        const minX = Math.min(startX, currX);
        const maxX = Math.max(startX, currX);
        const minY = Math.min(startY, currY);
        const maxY = Math.max(startY, currY);

        const width = Math.abs(maxX - minX);
        const height = Math.abs(maxY - minY);

        const box = {
          minX,
          maxX,
          minY,
          maxY,
        };

        set_dimension({ width, height });
        set_position({ x: minX, y: minY });

        const selectedBoxes = nodesTree.search(box);

        const map = {};

        selectedBoxes.forEach((box) => {
          map[box.node.id] = box;
        });

        set_groupSelectedNodesMap(map);

        return;
      }

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

        // todo: distance based
        // const HORIZONTAL_SEARCH_BOUNDARY = 1000;
        // let gapX = 0;
        // let gapY = 0;

        // const horizontalSearchbox = {
        //   minX: minX + diffX - HORIZONTAL_SEARCH_BOUNDARY,
        //   maxX: maxX + diffX + HORIZONTAL_SEARCH_BOUNDARY,
        //   minY: minY + diffY,
        //   maxY: maxY + diffY,
        //   node: node,
        // };
        // const horizontalNodes = [
        //   ...nodesTree.search(horizontalSearchbox),
        //   {
        //     node: node,
        //     minX: minX + diffX,
        //     maxX: maxX + diffX,
        //     minY: minY + diffY,
        //     maxY: maxY + diffY,
        //   },
        // ].sort((a, b) => a.minX - b.minX);

        // const adjDistancesArr = [];
        // const distancesArr = [];
        // let hasEncounteredMovingNode = false;

        // for (let i = 0; i < horizontalNodes.length - 1; i++) {
        //   const leftNode = horizontalNodes[i];
        //   const rightNode = horizontalNodes[i + 1];

        //   if (!hasEncounteredMovingNode)
        //     hasEncounteredMovingNode = leftNode.node.id === node.id;
        //   const side = hasEncounteredMovingNode === false ? "left" : "right";

        //   const distance = rightNode.minX - leftNode.maxX;
        //   const isAdjacent =
        //     leftNode.node.id === node.id || rightNode.node.id === node.id;

        //   const data = {
        //     isAdjacent,
        //     distance,
        //     side,
        //     leftNode,
        //     rightNode,
        //   };

        //   if (isAdjacent) adjDistancesArr.push(data);
        //   if (!isAdjacent) distancesArr.push(data);
        // }

        // // review: 2 adjacents
        // if (adjDistancesArr.length === 2) {
        //   const leftDistance = adjDistancesArr[0];
        //   const rightDistance = adjDistancesArr[1];

        //   const gap = rightDistance.distance - leftDistance.distance;
        //   const absGap = Math.abs(gap);

        //   if (absGap <= 7) gapX = gap / 2;
        // }

        // // review: non-adjacents
        // const threshold = 7;
        // let horizontalMap = {};
        // let shortestDistanceX = threshold;

        // if (gapX === 0) {
        //   adjDistancesArr.forEach((adjDist) => {
        //     distancesArr.forEach((dist) => {
        //       let gap = 0;
        //       let absGap = 0;

        //       if (adjDist.side === "left") {
        //         gap = dist.distance - adjDist.distance;
        //         absGap = Math.abs(gap);
        //       }

        //       if (adjDist.side === "right") {
        //         gap = adjDist.distance - dist.distance;
        //         absGap = Math.abs(gap);
        //       }

        //       if (absGap <= threshold) {
        //         if (absGap < shortestDistanceX) {
        //           shortestDistanceX = absGap;
        //           horizontalMap = {};
        //         }

        //         if (absGap === shortestDistanceX) {
        //           const data = {
        //             type: "distance",
        //             adjDist,
        //             dist,
        //           };

        //           if (horizontalMap[gap]) {
        //             horizontalMap[gap].push(data);
        //           } else {
        //             horizontalMap[gap] = [data];
        //           }
        //         }
        //       }
        //     });
        //   });
        // }

        // const keys = Object.keys(horizontalMap);

        // if (keys.length === 1) {
        //   gapX = parseInt(keys[0]);

        //   console.log("snapping 🧲", {
        //     gapX,
        //     horizontalLines: horizontalMap[gapX],
        //   });
        // } else {
        //   console.log("no snapping", { length: keys.length });
        //   gapX = 0;
        // }
        // todo: distance based

        // idea: axis based
        const searchBox = {
          minX: minX + diffX - SEARCH_BOUNDARY,
          minY: minY + diffY - SEARCH_BOUNDARY,
          maxX: maxX + diffX + SEARCH_BOUNDARY,
          maxY: maxY + diffY + SEARCH_BOUNDARY,
          node: node,
        };

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
        // idea: axis based

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
      set_dimension,
      set_position,
      set_groupSelectedNodesMap,
      resizeDirection,
      startResizeXY,
    ]
  );

  // reset
  const handleMouseUp = useCallback(() => {
    if (frameIDRef.current) {
      // review: make sure to cancel this
      cancelAnimationFrame(frameIDRef.current);

      frameIDRef.current = null;
    }

    if (mouseState === "GROUP_SELECTION") {
      const nodeIDs = Object.keys(groupSelectedNodesMap);

      // if nothing has been selected, then there is no need for GroupBox
      if (nodeIDs.length > 0) {
        let xArr = [];
        let yArr = [];

        nodeIDs.forEach((id) => {
          const { minX, maxX, minY, maxY } = groupSelectedNodesMap[id];

          xArr.push(minX);
          xArr.push(maxX);
          yArr.push(minY);
          yArr.push(maxY);
        });

        const minX = Math.min(...xArr);
        const maxX = Math.max(...xArr);
        const minY = Math.min(...yArr);
        const maxY = Math.max(...yArr);

        const width = Math.abs(maxX - minX);
        const height = Math.abs(maxY - minY);

        // set essential values
        set_dimension({ width, height });
        set_position({ x: minX, y: minY });
      } else {
        set_display(false);
      }
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

    document.body.style.userSelect = "auto";

    set_mouseState(null);
    set_verticalLines([]);
    set_horizontalLines([]);
    reset_nodesTree();
  }, [
    nodesMap,
    mouseState,
    edgeData,
    set_mouseState,
    set_verticalLines,
    set_horizontalLines,
    set_edge,
    reset_nodesTree,
    set_display,
    groupSelectedNodesMap,
    set_dimension,
    set_position,
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
          <GroupBox />

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
