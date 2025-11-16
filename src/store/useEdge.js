import { create } from "zustand";

import initEdgesMap from "../data/initEdgesMap";

const useEdge = create((set) => {
  return {
    edgesMap: initEdgesMap,
    set_edge: (edgeID, updatedEdge) =>
      set((state) => ({
        edgesMap: {
          ...state.edgesMap,
          [edgeID]: updatedEdge,
        },
      })),

    edgeData: {
      id: null,
      sourceID: null,
      sourceLoc: null,
      targetID: null,
      targetLoc: null,
      targetXY: { x: 0, y: 0 },
      // maybe offset should be calculated once the mouse is let up?
      offset: 0,
    },

    set_edgeData: (data) =>
      set((state) => ({ edgeData: { ...state.edgeData, ...data } })),

    reset_edgeData: () =>
      set(() => ({
        edgeData: {
          id: null,
          sourceID: null,
          sourceLoc: null,
          targetID: null,
          targetLoc: null,
          targetXY: { x: 0, y: 0 },
          offset: 0,
        },
      })),
  };
});

export default useEdge;
