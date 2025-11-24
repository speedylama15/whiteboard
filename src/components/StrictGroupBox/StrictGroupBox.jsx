import useGrouping from "../../store/useGrouping";

const StrictGroupBox = () => {
  const strictGroupBoxData = useGrouping((state) => state.strictGroupBoxData);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    //
  };

  return (
    <div
      className="strictGroupBox"
      style={{
        position: "absolute",
        display: strictGroupBoxData.display,
        backgroundColor: "#3700ff29",
        border: "1px solid #5500ffff",
        width: `${strictGroupBoxData.width}px`,
        height: `${strictGroupBoxData.height}px`,
        transform: strictGroupBoxData.translate,
        // idea
        zIndex: 1000000000,
      }}
      onMouseDown={handleMouseDown}
    />
  );
};

export default StrictGroupBox;
