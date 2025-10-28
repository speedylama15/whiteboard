import { useRef, useEffect, useCallback } from "react";

import BasicNode from "./components/BasicNode/BasicNode";

import usePanning from "./store/usePanning";
import useNodes from "./store/useNodes";

import initialNodes from "./data/initialNodes";

import "./App.css";

function App() {
  // panning
  const scale = usePanning((state) => state.scale);
  const isPanning = usePanning((state) => state.isPanning);
  const panStartPos = usePanning((state) => state.panStartPos);
  const panOffsetPos = usePanning((state) => state.panOffsetPos);
  const setScale = usePanning((state) => state.setScale);
  const setIsPanning = usePanning((state) => state.setIsPanning);
  const setPanStartPos = usePanning((state) => state.setPanStartPos);
  const setPanOffsetPos = usePanning((state) => state.setPanOffsetPos);

  // node
  const setSelectedNode = useNodes((state) => state.setSelectedNode);

  const whiteboardWrapperRef = useRef();

  const handleMouseDown = (e) => {
    const node = e.target.closest(".node");

    // node selection
    if (node) {
      setSelectedNode(node);
      return;
    } else {
      setSelectedNode(null);
    }

    // panning
    setIsPanning(true);
    setPanStartPos({
      x: e.clientX - panOffsetPos.x,
      y: e.clientY - panOffsetPos.y,
    });
  };

  const handleMouseMove = (e) => {
    const wrapper = whiteboardWrapperRef.current;
    if (!wrapper) return;

    if (isPanning) {
      setPanOffsetPos({
        x: e.clientX - panStartPos.x,
        y: e.clientY - panStartPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();

      const wrapper = whiteboardWrapperRef.current;
      const rect = wrapper.getBoundingClientRect();

      // Check if it's a pinch gesture (ctrlKey is set for pinch on trackpad)
      if (e.ctrlKey) {
        // ZOOM with pinch
        const zoomAmount = 1 - e.deltaY * 0.01;
        const newScale = Math.max(0.1, Math.min(5, scale * zoomAmount));

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const startPosX = (mouseX - panOffsetPos.x) / scale;
        const startPosY = (mouseY - panOffsetPos.y) / scale;
        const newPanX = mouseX - startPosX * newScale;
        const newPanY = mouseY - startPosY * newScale;

        setScale(newScale);
        setPanOffsetPos({ x: newPanX, y: newPanY });
      } else {
        // PAN with two-finger swipe
        setPanOffsetPos({
          x: panOffsetPos.x - e.deltaX,
          y: panOffsetPos.y - e.deltaY,
        });
      }
    },
    [panOffsetPos, scale, setScale, setPanOffsetPos]
  );

  // const handleWheel = useCallback(
  //   (e) => {
  //     e.preventDefault();

  //     const wrapper = whiteboardWrapperRef.current;
  //     const rect = wrapper.getBoundingClientRect();

  //     let zoomAmount;

  //     if (e.ctrlKey) {
  //       zoomAmount = 1 - e.deltaY * 0.01;
  //     } else {
  //       zoomAmount = e.deltaY < 0 ? 1.1 : 0.9;
  //     }

  //     const newScale = Math.max(0.1, Math.min(5, scale * zoomAmount));

  //     const mouseX = e.clientX - rect.left;
  //     const mouseY = e.clientY - rect.top;
  //     const startPosX = (mouseX - panOffsetPos.x) / scale;
  //     const startPosY = (mouseY - panOffsetPos.y) / scale;
  //     const newPanX = mouseX - startPosX * newScale;
  //     const newPanY = mouseY - startPosY * newScale;

  //     setScale(newScale);
  //     setPanOffsetPos({ x: newPanX, y: newPanY });
  //   },
  //   [panOffsetPos, scale, setScale, setPanOffsetPos]
  // );

  useEffect(() => {
    const wrapper = whiteboardWrapperRef.current;
    if (!wrapper) return;

    wrapper.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      wrapper.removeEventListener("wheel", handleWheel);
    };
  }, [scale, panOffsetPos, handleWheel]);

  return (
    <main
      className="page"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="whiteboard-wrapper"
        ref={whiteboardWrapperRef}
        onMouseDown={handleMouseDown}
      >
        <div
          className="whiteboard"
          style={{
            transform: `translate(${panOffsetPos.x}px, ${panOffsetPos.y}px) scale(${scale})`,
            transformOrigin: "0 0",
          }}
        >
          <div className="whiteboard-nodes">
            {initialNodes.map((node) => {
              return <BasicNode key={node.id} node={node} />;
            })}
          </div>

          <div className="whiteboard-labels"></div>
        </div>
      </div>
    </main>
  );
}

export default App;

// import { useRef, useEffect, useCallback } from "react";
// import * as d3 from "d3";

// import BasicNode from "./components/BasicNode/BasicNode";

// import useWhiteboard from "./store/useWhiteboard";
// import usePanning from "./store/usePanning";
// import useNodes from "./store/useNodes";

// import initialNodes from "./data/initialNodes";

// import "./App.css";

// const getPath = (
//   startCoords,
//   endCoords,
//   sourceHandleDirection,
//   targetHandleDirection,
//   isSnapToHandle
// ) => {
//   const path = d3.path();
//   let offsetX = 0;
//   let offsetY = 0;
//   let offX = 0;
//   let offY = 0;

//   if (sourceHandleDirection === "top") offsetY = -150;
//   if (sourceHandleDirection === "bottom") offsetY = 150;
//   if (sourceHandleDirection === "right") offsetX = 150;
//   if (sourceHandleDirection === "left") offsetX = -150;

//   if (isSnapToHandle) {
//     if (targetHandleDirection === "top") offY = -150;
//     if (targetHandleDirection === "bottom") offY = 150;
//     if (targetHandleDirection === "right") offX = 150;
//     if (targetHandleDirection === "left") offX = -150;
//   }

//   path.moveTo(startCoords.x, startCoords.y);
//   path.bezierCurveTo(
//     // Control point 1
//     startCoords.x + offsetX,
//     startCoords.y + offsetY,
//     // Control point 2
//     endCoords.x + offX,
//     endCoords.y + offY,
//     // End point
//     endCoords.x,
//     endCoords.y
//   );

//   return path.toString();
// };

// function App() {
//   // panning
//   const scale = usePanning((state) => state.scale);
//   const isPanning = usePanning((state) => state.isPanning);
//   const panStartPos = usePanning((state) => state.panStartPos);
//   const panOffsetPos = usePanning((state) => state.panOffsetPos);
//   const setScale = usePanning((state) => state.setScale);
//   const setIsPanning = usePanning((state) => state.setIsPanning);
//   const setPanStartPos = usePanning((state) => state.setPanStartPos);
//   const setPanOffsetPos = usePanning((state) => state.setPanOffsetPos);

//   // node
//   const setSelectedNode = useNodes((state) => state.setSelectedNode);

//   // todo: handle
//   // const handleStartCoords = useWhiteboard((state) => state.handleStartCoords);
//   // const handleTargetCoords = useWhiteboard((state) => state.handleTargetCoords);
//   // const isDraggingHandle = useWhiteboard((state) => state.isDraggingHandle);
//   // const setIsDraggingHandle = useWhiteboard(
//   //   (state) => state.setIsDraggingHandle
//   // );
//   // const setHandleTargetCoords = useWhiteboard(
//   //   (state) => state.setHandleTargetCoords
//   // );
//   // const handleDirection = useWhiteboard((state) => state.handleDirection);
//   // const whiteboardRect = useWhiteboard((state) => state.whiteboardRect);
//   // const isSnapToHandle = useWhiteboard((state) => state.isSnapToHandle);
//   // todo

//   const whiteboardWrapperRef = useRef();

//   const handleMouseDown = (e) => {
//     const node = e.target.closest(".node");

//     // node selection
//     if (node) {
//       setSelectedNode(node);
//       return;
//     } else {
//       setSelectedNode(null);
//     }

//     // panning
//     setIsPanning(true);
//     setPanStartPos({
//       x: e.clientX - panOffsetPos.x,
//       y: e.clientY - panOffsetPos.y,
//     });
//   };

//   const handleMouseMove = (e) => {
//     // if (isSnapToHandle) return;

//     // todo
//     // if (isDraggingHandle) {
//     //   const { clientX, clientY } = e;

//     //   const targetCoords = {
//     //     x: (clientX - whiteboardRect.x) / scale + 5,
//     //     y: (clientY - whiteboardRect.y) / scale + 5,
//     //   };

//     //   setHandleTargetCoords(targetCoords);

//     //   return;
//     // }
//     // todo

//     const wrapper = whiteboardWrapperRef.current;
//     if (!wrapper) return;

//     if (isPanning) {
//       setPanOffsetPos({
//         x: e.clientX - panStartPos.x,
//         y: e.clientY - panStartPos.y,
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsPanning(false);

//     // todo
//     // setIsDraggingHandle(false);
//   };

//   const handleWheel = useCallback(
//     (e) => {
//       e.preventDefault();

//       const wrapper = whiteboardWrapperRef.current;
//       const rect = wrapper.getBoundingClientRect();

//       let zoomAmount;

//       if (e.ctrlKey) {
//         zoomAmount = 1 - e.deltaY * 0.01;
//       } else {
//         zoomAmount = e.deltaY < 0 ? 1.1 : 0.9;
//       }

//       const newScale = Math.max(0.1, Math.min(5, scale * zoomAmount));

//       const mouseX = e.clientX - rect.left;
//       const mouseY = e.clientY - rect.top;
//       const startPosX = (mouseX - panOffsetPos.x) / scale;
//       const startPosY = (mouseY - panOffsetPos.y) / scale;
//       const newPanX = mouseX - startPosX * newScale;
//       const newPanY = mouseY - startPosY * newScale;

//       setScale(newScale);
//       setPanOffsetPos({ x: newPanX, y: newPanY });
//     },
//     [panOffsetPos, scale, setScale, setPanOffsetPos]
//   );

//   useEffect(() => {
//     const wrapper = whiteboardWrapperRef.current;
//     if (!wrapper) return;

//     wrapper.addEventListener("wheel", handleWheel, { passive: false });

//     return () => {
//       wrapper.removeEventListener("wheel", handleWheel);
//     };
//   }, [scale, panOffsetPos, handleWheel]);

//   return (
//     <main
//       className="page"
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//     >
//       <div
//         className="whiteboard-wrapper"
//         ref={whiteboardWrapperRef}
//         onMouseDown={handleMouseDown}
//       >
//         <div
//           className="whiteboard"
//           style={{
//             transform: `translate(${panOffsetPos.x}px, ${panOffsetPos.y}px) scale(${scale})`,
//             transformOrigin: "0 0",
//           }}
//         >
//           <div className="whiteboard-nodes">
//             {initialNodes.map((node) => {
//               return <BasicNode key={node.id} node={node} />;
//             })}
//           </div>

//           <div className="whiteboard-edges">
//             <svg width="100%" height="100%">
//               <g>
//                 {/* <path
//                   d={getPath(
//                     handleStartCoords,
//                     handleTargetCoords,
//                     handleDirection,
//                     "right",
//                     isSnapToHandle
//                   )}
//                   stroke="#000"
//                   strokeWidth={2}
//                   fill="none"
//                 /> */}
//               </g>
//             </svg>
//           </div>

//           <div className="whiteboard-labels"></div>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default App;
