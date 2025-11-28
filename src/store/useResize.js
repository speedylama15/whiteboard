import { create } from "zustand";

const useResize = create((set) => {
  return {
    startResizeXY: { x: 0, y: 0 },
    set_startResizeXY: (coords) => set(() => ({ startResizeXY: coords })),

    resizeDirection: null,
    set_resizeDirection: (direction) =>
      set(() => ({ resizeDirection: direction })),
  };
});

export default useResize;
