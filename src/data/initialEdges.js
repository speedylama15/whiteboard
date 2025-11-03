// 중복
const initialEdges = [
  {
    id: "edge-1",
    source: "node-1",
    target: "node-2",
    sourceDir: "right",
    targetDir: "right",
  },
  {
    id: "edge-2",
    source: "node-1",
    target: "node-2",
    sourceDir: "left",
    targetDir: "top",
  },
  {
    id: "edge-3",
    source: "node-2",
    target: "node-1",
    sourceDir: "bottom",
    targetDir: "top",
  },
];

export default initialEdges;
