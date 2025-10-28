import { create } from "zustand";

const usePanning = create((set) => {
  return {
    scale: 1,
    isPanning: false,
    panStartPos: { x: 0, y: 0 },
    panOffsetPos: { x: 0, y: 0 },

    setScale: (value) => set((state) => ({ ...state, scale: value })),
    setIsPanning: (bool) => set((state) => ({ ...state, isPanning: bool })),
    setPanStartPos: (panStartPos) =>
      set((state) => ({ ...state, panStartPos })),
    setPanOffsetPos: (panOffsetPos) =>
      set((state) => ({ ...state, panOffsetPos })),
  };
});

export default usePanning;
