import useEdge from "../../../store/useEdge";

import "./NodeConnector.css";

const NodeConnector = ({ node, connectorLocation }) => {
  const set_newEdge = useEdge((state) => state.set_newEdge);

  const handleMouseEnter = () => {
    const targetID = node.id;
    const targetLoc = connectorLocation;

    set_newEdge({ targetID, targetLoc });
  };

  const handleMouseLeave = () => {
    set_newEdge({ targetID: null, targetLoc: null });
  };

  return (
    <div
      className="node-connector"
      data-connector-location={connectorLocation}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default NodeConnector;
