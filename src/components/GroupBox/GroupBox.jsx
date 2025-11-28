import useGroupBox from "../../store/useGroupBox";

const GroupBox = () => {
  const { display, dimension, position } = useGroupBox();

  return (
    display && (
      <div
        style={{
          position: "absolute",
          border: "1px solid #0091ffff",
          backgroundColor: "#0091ff1a",
          width: `${dimension.width}px`,
          height: `${dimension.height}px`,
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      />
    )
  );
};

export default GroupBox;
