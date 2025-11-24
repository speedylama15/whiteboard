import { create } from "zustand";

const useGrouping = create((set) => {
  return {
    // flexible box
    flexibleGroupBoxData: {
      display: "none",
      width: 0,
      height: 0,
      translate: `translate(0px, 0px)`,
    },
    set_flexibleGroupBoxData: (data) =>
      set(() => ({ flexibleGroupBoxData: data })),
    reset_flexibleGroupBoxData: () =>
      set(() => ({
        flexibleGroupBoxData: {
          display: "none",
          width: 0,
          height: 0,
          translate: `translate(0px, 0px)`,
        },
      })),

    // strict box
    strictGroupBoxData: {
      display: "none",
      width: 0,
      height: 0,
      translate: `translate(0px, 0px)`,
    },
    set_strictGroupBoxData: (data) => set(() => ({ strictGroupBoxData: data })),
    reset_strictGroupBoxData: () =>
      set(() => ({
        strictGroupBoxData: {
          display: "none",
          width: 0,
          height: 0,
          translate: `translate(0px, 0px)`,
        },
      })),

    // multiples nodes selected
    groupSelectedNodesMap: {},
    set_groupSelectedNodesMap: (obj) =>
      set(() => ({ groupSelectedNodesMap: { ...obj } })),
    reset_groupSelectedNodesMap: () =>
      set(() => ({ groupSelectedNodesMap: {} })),
  };
});

export default useGrouping;
