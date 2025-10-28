import { create } from "zustand";

import initialNodes from "../data/initialNodes";

const useNodes = create((set) => {
  return {
    initialNodes,
    selectedNode: null,

    // not sure what to do with this now
    setInitialNodes: () => set((state) => ({ ...state })),
    setSelectedNode: (selectedNode) =>
      set((state) => ({ ...state, selectedNode })),
  };
});

export default useNodes;
