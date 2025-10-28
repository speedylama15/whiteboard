import { create } from "zustand";

const useWhiteboard = create((set) => ({
  selectedNode: null,

  isDraggingHandle: false,
  isSnapToHandle: false,
  handleDirection: null,
  handleStartCoords: { x: 0, y: 0 },
  handleTargetCoords: { x: 0, y: 0 },
  whiteboardRect: { x: 0, y: 0 },

  setSelectedNode: (node) => set((state) => ({ ...state, selectedNode: node })),

  setIsDraggingHandle: (bool) =>
    set((state) => ({ ...state, isDraggingHandle: bool })),
  setHandleDirection: (direction) =>
    set((state) => ({ ...state, handleDirection: direction })),
  setHandleStartCoords: (coords) =>
    set((state) => ({ ...state, handleStartCoords: coords })),
  setHandleTargetCoords: (coords) =>
    set((state) => ({ ...state, handleTargetCoords: coords })),
  setWhiteboardRect: (rect) =>
    set((state) => ({ ...state, whiteboardRect: rect })),
  setIsSnapToHandle: (bool) =>
    set((state) => ({ ...state, isSnapToHandle: bool })),
}));

export default useWhiteboard;
