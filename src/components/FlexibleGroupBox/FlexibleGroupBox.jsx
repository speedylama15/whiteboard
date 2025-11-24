import useGrouping from "../../store/useGrouping";

const FlexibleGroupBox = () => {
  const flexibleGroupBoxData = useGrouping(
    (state) => state.flexibleGroupBoxData
  );

  return (
    <div
      className="flexibleGroupBox"
      style={{
        position: "absolute",
        display: flexibleGroupBoxData.display,
        backgroundColor: "#ff6a0075",
        border: "1px solid #ff6a00ff",
        width: `${flexibleGroupBoxData.width}px`,
        height: `${flexibleGroupBoxData.height}px`,
        transform: flexibleGroupBoxData.translate,
      }}
    />
  );
};

export default FlexibleGroupBox;
