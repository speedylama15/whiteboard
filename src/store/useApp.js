import { create } from "zustand";
import RBush from "rbush";

import initNodesMap from "../data/initNodesMap";

const useApp = create((set) => ({
  mouseState: null,
  setMouseState: (mouseState) => set((state) => ({ ...state, mouseState })),

  nodesMap: initNodesMap,
  updateNode: (nodeID, updatedNode) =>
    set((state) => ({
      nodesMap: {
        ...state.nodesMap,
        [nodeID]: updatedNode,
      },
    })),

  // tree
  rTree: new RBush(),
  verticalLines: [],
  horizontalLines: [],
  setVerticalLines: (lines) =>
    set((state) => ({ ...state, verticalLines: lines })),
  setHorizontalLines: (lines) =>
    set((state) => ({ ...state, horizontalLines: lines })),

  // selection_node
  selectedNodesMap: {},
  setSelectedNodesMap: (obj) =>
    set((state) => ({
      ...state,
      selectedNodesMap: { ...state.selectedNodesMap, ...obj },
    })),
  resetSelectedNodesMap: () =>
    set((state) => ({ ...state, selectedNodesMap: {} })),

  // wrapperRect
  wrapperRect: null,
  setWrapperRect: (rect) =>
    set((state) => ({
      ...state,
      wrapperRect: rect,
    })),

  // panning
  scale: 1,
  setScale: (value) => set((state) => ({ ...state, scale: value })),
  startCoords: { x: 0, y: 0 },
  setStartCoords: (coords) =>
    set((state) => ({ ...state, startCoords: coords })),
  panOffsetCoords: { x: 0, y: 0 },
  setPanOffsetCoords: (panOffsetCoords) =>
    set((state) => ({ ...state, panOffsetCoords })),
}));

export default useApp;
