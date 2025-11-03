import "./Canvas.css";

const Canvas = () => {
  return (
    <canvas
      style={{
        width: "100%",
        height: "100%",
        border: "2px solid #1e00ffff",
        pointerEvents: "none",
      }}
    />
  );
};

export default Canvas;
