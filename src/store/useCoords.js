import { create } from "zustand";

const useCoords = create((set) => {
  return {
    startXY: { x: 0, y: 0 },
    set_startXY: (coords) => set(() => ({ startXY: coords })),
  };
});

export default useCoords;
