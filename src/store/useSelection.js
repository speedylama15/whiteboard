import { create } from "zustand";

const useSelection = create((set) => {
  return {
    groupSelectedNodesMap: {},
    set_groupSelectedNodesMap: (obj) =>
      set(() => ({ groupSelectedNodesMap: { ...obj } })),
    reset_groupSelectedNodesMap: () =>
      set(() => ({ groupSelectedNodesMap: {} })),
  };
});

export default useSelection;
