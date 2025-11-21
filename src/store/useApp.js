import { create } from "zustand";

import initNodesMap from "../data/initNodesMap";

const useApp = create((set) => ({
  mouseState: null,
  set_mouseState: (mouseState) => set((state) => ({ ...state, mouseState })),

  nodesMap: initNodesMap,
  set_node: (nodeID, node) =>
    set((state) => ({
      nodesMap: {
        ...state.nodesMap,
        [nodeID]: node,
      },
    })),

  // selection_node
  selectedNodesMap: {},
  set_selectedNodesMap: (obj) => set(() => ({ selectedNodesMap: { ...obj } })),
  reset_selectedNodesMap: () => set(() => ({ selectedNodesMap: {} })),

  // wrapperRect
  wrapperRect: null,
  set_wrapperRect: (wrapperRect) => set(() => ({ wrapperRect })),

  // panning
  scale: 1,
  set_scale: (value) =>
    set((state) => ({ ...state, scale: parseFloat(value.toFixed(2)) })),
  panOffsetXY: { x: 0, y: 0 },
  // idea: huh?
  set_panOffsetXY: (panOffsetXY) =>
    set((state) => ({
      panOffsetXY:
        typeof panOffsetXY === "function"
          ? panOffsetXY(state.panOffsetXY)
          : panOffsetXY,
    })),

  // <------- cut ------->

  // tree
  verticalLines: [],
  horizontalLines: [],
  setVerticalLines: (lines) =>
    set((state) => ({ ...state, verticalLines: lines })),
  setHorizontalLines: (lines) =>
    set((state) => ({ ...state, horizontalLines: lines })),
}));

export default useApp;
