import * as React from "react";

export const Dog = ({ data }) => {
  //   console.log(data.src);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const imageRef = React.useRef();

  function updateDimensions() {
    if (imageRef.current) {
      setWidth(imageRef.current.clientWidth);
      setHeight(imageRef.current.clientHeight);
    }
  }
  // React.useEffect(() => {
  //   if (imageRef.current) {
  //     console.log("has current", imageRef.current.clientWidth);
  //   }
  // }, [data.url]);

  // const imageRef = React.useCallback((ref) => {
  //   if (!ref) return;

  //   if (ref.current) {
  //     console.log(ref.current);
  //   }
  // }, []);

  // if (!width || !height) {
  //   console.log("not ready");
  //   return <></>;
  // }

  return (
    <div className="imageContainer">
      <svg
        className="predictionsContainer"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g>
          {data.predictions.map((prediction, i) => {
            // console.log(prediction);
            return (
              <rect
                key={`data.url-${i}`}
                x={prediction.bbox.y1}
                y={prediction.bbox.x1}
                width={prediction.bbox.x2 - prediction.bbox.x1}
                height={prediction.bbox.y2 - prediction.bbox.y1}
                fill="#ff0000"
                opacity="0.2"
              />
            );
          })}
        </g>
      </svg>

      <img onLoad={updateDimensions} src={data.src} alt="dog" ref={imageRef} />
    </div>
  );
};
