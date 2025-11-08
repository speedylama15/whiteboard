import { create } from "zustand";

import initEdges from "../data/initEdges";
import initNodesMap from "../data/initNodesMap";

const useApp = create((set) => ({
  // debug
  alignmentCoords: null,
  setAlignmentCoords: (coords) =>
    set((state) => {
      return { ...state, alignmentCoords: coords };
    }),
  initEdges,
  setInitEdges: (edge) =>
    set((state) => ({
      initEdges: [...state.initEdges, edge],
    })),
  // debug

  // idea:
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

  // select node
  selectedNodeID: null,
  setSelectedNodeID: (id) => set((state) => ({ ...state, selectedNodeID: id })),
  // fix: delete?
  selectedNode: null,
  setSelectedNode: (node) => set((state) => ({ ...state, selectedNode: node })),
  // fix: delete?

  // wrapperRect
  wrapperRect: null,
  setWrapperRect: (rect) =>
    set((state) => ({
      ...state,
      wrapperRect: rect,
    })),

  // tree
  tree: null,
  setTree: (tree) => set((state) => ({ ...state, tree })),

  // panning
  scale: 1,
  setScale: (value) => set((state) => ({ ...state, scale: value })),
  panStartPos: { x: 0, y: 0 },
  setPanStartPos: (panStartPos) => set((state) => ({ ...state, panStartPos })),
  panOffsetPos: { x: 0, y: 0 },
  setPanOffsetPos: (panOffsetPos) =>
    set((state) => ({ ...state, panOffsetPos })),
}));

export default useApp;
