import { create } from "zustand";

import initNodes from "../data/initNodes";
import initialEdges from "../data/initialEdges";

const useApp = create((set) => ({
  // panning
  isPanning: false,
  scale: 1,
  panStartPos: { x: 0, y: 0 },
  panOffsetPos: { x: 0, y: 0 },
  setScale: (value) => set((state) => ({ ...state, scale: value })),
  setIsPanning: (bool) => set((state) => ({ ...state, isPanning: bool })),
  setPanStartPos: (panStartPos) => set((state) => ({ ...state, panStartPos })),
  setPanOffsetPos: (panOffsetPos) =>
    set((state) => ({ ...state, panOffsetPos })),

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

  // dragging single node
  selectedNodeID: null,
  selectedNode: null,
  setSelectedNodePosition: (position) =>
    set((state) => ({
      ...state,
      selectedNode: { ...state.selectedNode, position },
    })),

  // nodes
  initNodes,
  // idea: null, panning, draggingNode, draggingNodes, draggingEdge
  draggingState: null,
  setDraggingState: (draggingState) =>
    set((state) => ({ ...state, draggingState })),
  isDraggingNode: false,

  setIsDraggingNode: (bool) =>
    set((state) => ({ ...state, isDraggingNode: bool })),
  setSelectedNode: (node) => set((state) => ({ ...state, selectedNode: node })),
  setSelectedNodeID: (id) => set((state) => ({ ...state, selectedNodeID: id })),
  setSingleNodePosition: (nodeID, newPosition) =>
    set((state) => {
      return {
        initNodes: state.initNodes.map((node) =>
          node.id === nodeID ? { ...node, position: newPosition } : node
        ),
      };
    }),

  // edges
  initialEdges,
  selectedEdge: null,
  selectedEdgeID: null,
  setSelectedEdge: (edge) => set((state) => ({ ...state, selectedEdge: edge })),
  setSelectedEdgeID: (id) => set((state) => ({ ...state, selectedEdgeID: id })),

  // edge_wandering
  isDraggingHandle: false,
  wanderingEdgeID: null,
  wanderingCoords: { x: 0, y: 0 },
  isSnapped: false,
  snappedHandleID: null,

  setIsDraggingHandle: (value) => set({ isDraggingHandle: value }),
  setWanderingEdgeID: (id) => set({ wanderingEdgeID: id }),
  setWanderingCoords: (coords) => set({ wanderingCoords: coords }),
  setIsSnapped: (value) => set({ isSnapped: value }),
  setSnappedHandleID: (id) => set({ snappedHandleID: id }),

  // maybe use immer thingy?
  addEdge: (edge) =>
    set((state) => ({
      ...state,
      initialEdges: [...state.initialEdges, edge],
    })),
}));

export default useApp;
