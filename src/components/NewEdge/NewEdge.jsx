import useApp from "../../store/useApp";

import { getControlPoint } from "../../utils/getControlPoint";

import "./NewEdge.css";

const NewEdge = () => {
  const start = useApp((state) => state.newEdgeStartCoords);
  const location = useApp((state) => state.newEdgeStartLocation);
  const target = useApp((state) => state.newEdgeTargetCoords);

  const sControl = getControlPoint(start, location, 150);
  // const tControl = getControlPoint(newEdgeTargetCoords, tLoc, 150);

  const pathData = `M ${start.x},${start.y} C ${sControl.x}, ${sControl.y} ${target.x}, ${target.y}, ${target.x}, ${target.y}`;

  return (
    <>
      <svg>
        <path d={pathData} stroke="#000000ff" fill="none" strokeWidth={2} />
      </svg>
    </>
  );
};

export default NewEdge;
