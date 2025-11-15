import { create } from "zustand";
import RBush from "rbush";

import initNodesMap from "../data/initNodesMap";
import initEdgesMap from "../data/initEdgesMap";

const useApp = create((set) => ({
  mouseState: null,
  set_mouseState: (mouseState) => set((state) => ({ ...state, mouseState })),

  nodesMap: initNodesMap,
  set_node: (nodeID, node) =>
    set((state) => ({
      nodesMap: {
        ...state.nodesMap,
        [nodeID]: node,
      },
    })),

  // selection_node
  selectedNodesMap: {},
  set_selectedNodesMap: (obj) => set(() => ({ selectedNodesMap: { ...obj } })),
  reset_selectedNodesMap: () => set(() => ({ selectedNodesMap: {} })),

  // wrapperRect
  wrapperRect: null,
  set_wrapperRect: (wrapperRect) => set(() => ({ wrapperRect })),

  // panning
  scale: 1,
  set_scale: (value) =>
    set((state) => ({ ...state, scale: parseFloat(value.toFixed(2)) })),
  panOffsetXY: { x: 0, y: 0 },
  set_panOffsetXY: (panOffsetXY) => set((state) => ({ ...state, panOffsetXY })),

  // <------- cut ------->

  edgesMap: initEdgesMap,
  updateEdge: (edgeID, updatedEdge) =>
    set((state) => ({
      edgesMap: {
        ...state.edgesMap,
        [edgeID]: updatedEdge,
      },
    })),

  // newEdge
  newEdgeStartXY: null,
  newEdgeStartLoc: null,
  newEdgeTargetXY: null,
  overlappedNode: null,
  newEdgeSnap: null,
  set_newEdgeSnap: (coords) =>
    set((state) => ({ ...state, newEdgeSnapXY: coords })),

  setNewEdgeStartXY: (coords) =>
    set((state) => ({ ...state, newEdgeStartXY: coords })),
  setNewEdgeStartLoc: (loc) =>
    set((state) => ({ ...state, newEdgeStartLoc: loc })),
  setNewEdgeTargetXY: (coords) =>
    set((state) => ({ ...state, newEdgeTargetXY: coords })),

  setOverlappedNode: (node) =>
    set((state) => ({ ...state, overlappedNode: node })),

  // tree
  verticalLines: [],
  horizontalLines: [],
  setVerticalLines: (lines) =>
    set((state) => ({ ...state, verticalLines: lines })),
  setHorizontalLines: (lines) =>
    set((state) => ({ ...state, horizontalLines: lines })),
}));

export default useApp;
