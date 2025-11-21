import { create } from "zustand";

const useCoords = create((set) => {
  return {
    startXY: null,
    set_startXY: (coords) => set(() => ({ startXY: coords })),
  };
});

export default useCoords;
