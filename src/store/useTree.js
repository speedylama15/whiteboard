import { create } from "zustand";
import RBush from "rbush";

import useApp from "./useApp";

const useTree = create((set, get) => {
  return {
    nodesTree: new RBush(),
    set_nodesTree: (nodeIDs) =>
      set(() => {
        const tree = new RBush();
        const map = useApp.getState().nodesMap;
        const newMap = { ...map };
        nodeIDs.forEach((id) => delete newMap[id]);

        const boxes = Object.values(newMap).map((node) => ({
          node,
          minX: node.position.x,
          minY: node.position.y,
          maxX: node.position.x + node.dimension.width,
          maxY: node.position.y + node.dimension.height,
        }));

        tree.load(boxes);

        return { nodesTree: tree };
      }),
    reset_nodesTree: () => set(() => ({ nodesTree: new RBush() })),

    edgesTree: new RBush(),
    connectorsTree: new RBush(),

    set_edgesTree: (tree) => set(() => ({ edgesTree: tree })),
    set_connectorsTree: (tree) => set(() => ({ connectorsTree: tree })),

    searchBoxesTree: new RBush(),
    set_searchBoxesTree: (box) =>
      set(() => ({ searchBoxesTree: new RBush().insert(box) })),
    reset_searchBoxesTree: () => set(() => ({ searchBoxesTree: new RBush() })),

    // perhaps this could be used?
    // triggers re-render
    set_treeThatRerenders: (bbox) => {
      get().nodesTree.remove(bbox);
      set({ nodesTree: get().nodesTree });
    },
  };
});

export default useTree;
