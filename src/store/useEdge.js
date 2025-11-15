import { create } from "zustand";

const newEdge = {
  id: null,
  sourceID: null,
  sourceLoc: null,
  targetID: null,
  targetLoc: null,
  targetXY: { x: 0, y: 0 },
  offset: 0,
};

const useEdge = create((set) => {
  return {
    newEdge,
    set_newEdge: (newEdge) =>
      set((state) => ({ newEdge: { ...state.newEdge, ...newEdge } })),
    reset_newEdge: () => set(() => ({ newEdge })),
  };
});

export default useEdge;
