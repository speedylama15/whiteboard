import { create } from "zustand";

const useGroupBox = create((set) => {
  return {
    display: false,
    dimension: {
      width: 0,
      height: 0,
    },
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0,

    set_display: (bool) => set(() => ({ display: bool })),
    set_dimension: (dimension) => set(() => ({ dimension })),
    set_position: (position) => set(() => ({ position })),
    reset_groupBox: () =>
      set(() => ({
        isDragging: false,
        dimension: {
          width: 0,
          height: 0,
        },
        position: {
          x: 0,
          y: 0,
        },
        rotation: 0,
      })),
  };
});

export default useGroupBox;
