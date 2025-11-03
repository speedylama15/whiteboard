import useApp from "../../store/useApp";

import {
  getHandleCoords,
  getHandleControlCoords,
} from "../BasicNode/getHandleCoords";

import "./Edge.css";
import { useState } from "react";

// wandering edge -> wanderingEdgeID
// check if this edge is wandering
// wandering edge will have a source but no target

// source coord controls could be calculated based on distance

const getPath = (
  isWandering,
  wanderingCoords,
  sourceNode,
  targetNode,
  sourceDir,
  targetDir
) => {
  const sCoords = getHandleCoords(sourceNode, sourceDir);
  const scCoords = getHandleControlCoords(sCoords, sourceDir);

  if (isWandering) {
    return {
      sCoords,
      scCoords,
      tCoords: null,
      tcCoords: null,
      path: `M ${sCoords.x} ${sCoords.y} C ${scCoords.x} ${scCoords.y} ${wanderingCoords.x} ${wanderingCoords.y} ${wanderingCoords.x} ${wanderingCoords.y}`,
    };
  }

  const tCoords = getHandleCoords(targetNode, targetDir);
  const tcCoords = getHandleControlCoords(tCoords, targetDir);

  return {
    sCoords,
    scCoords,
    tCoords,
    tcCoords,
    path: `M ${sCoords.x} ${sCoords.y} C ${scCoords.x} ${scCoords.y} ${tcCoords.x} ${tcCoords.y} ${tCoords.x} ${tCoords.y}`,
  };
};

const Edge = ({ edge }) => {
  const initialNodes = useApp((state) => state.initialNodes);
  const wanderingEdgeID = useApp((state) => state.wanderingEdgeID);
  const isDraggingHandle = useApp((state) => state.isDraggingHandle);
  const wanderingCoords = useApp((state) => state.wanderingCoords);
  const isSnapped = useApp((state) => state.isSnapped);
  const snappedHandleID = useApp((state) => state.snappedHandleID);
  const setIsDraggingHandle = useApp((state) => state.setIsDraggingHandle);
  const setWanderingEdgeID = useApp((state) => state.setWanderingEdgeID);
  const setWanderingCoords = useApp((state) => state.setWanderingCoords);
  const setIsSnapped = useApp((state) => state.setIsSnapped);
  const setSnappedHandleID = useApp((state) => state.setSnappedHandleID);
  const addEdge = useApp((state) => state.addEdge);

  const [isWandering, setIsWandering] = useState(edge.id === wanderingEdgeID);

  const selectedEdgeID = useApp((state) => state.selectedEdgeID);
  const setSelectedEdgeID = useApp((state) => state.setSelectedEdgeID);

  const { source, target, sourceDir, targetDir } = edge;

  const sourceNode = initialNodes.find((node) => node.id === source);
  const targetNode = initialNodes.find((node) => node.id === target);

  const { sCoords, tCoords, path } = getPath(
    isWandering,
    wanderingCoords,
    sourceNode,
    targetNode,
    sourceDir,
    targetDir
  );

  return (
    <svg data-edge-id={edge.id}>
      <g>
        <path
          data-edge-id={edge.id}
          d={path}
          stroke={selectedEdgeID === edge.id ? "#78e4c2ff" : "transparent"}
          strokeWidth={20}
          fill="none"
        />

        <path
          data-edge-id={edge.id}
          d={path}
          stroke="#000"
          strokeWidth={2}
          fill="none"
          // review
          // markerStart="url(#arrowhead)"
          markerEnd="url(#arrowhead)"
        />

        {/* {selectedEdgeID === edge.id && !isDraggingHandle && (
          <>
            <circle
              data-circle-position="source"
              data-edge-id={edge.id}
              cx={sCoords.x}
              cy={sCoords.y}
              r="5"
              fill="white"
              stroke="#0066ff"
              strokeWidth="2"
            />

            <circle
              data-circle-position="target"
              data-edge-id={edge.id}
              cx={tCoords.x}
              cy={tCoords.y}
              r="5"
              fill="white"
              stroke="#0066ff"
              strokeWidth="2"
            />
          </>
        )} */}
      </g>
    </svg>
  );
};

export default Edge;
