import React, { useRef, useEffect, useLayoutEffect, forwardRef } from 'react';

export default function ImageCropFeedback({
  imageUrl,
  top,
  left,
  right,
  bottom,
  onAreaSelect = () => {},
  startCropping,
  setStartCropping,
  handleCrop,
}) {
  const canvasRef = useRef();
  const imageRef = useRef();
  const contextRef = useRef();
  const initialRun = useRef(true);

  useLayoutEffect(() => {
    const currentCanvas = canvasRef.current;
    const currentImage = imageRef.current;

    currentCanvas.width = currentImage.offsetWidth;
    currentCanvas.height = currentImage.offsetHeight;
    contextRef.current = currentCanvas.getContext('2d');
    currentImage.onload = () => {
      contextRef.current.drawImage(currentImage, 0, 0);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (startCropping || initialRun.current) {
      initialRun.current = false;
      const drawLineCtx = drawLine(contextRef.current);
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      contextRef.current.drawImage(imageRef.current, 0, 0);
      drawLineCtx(top);
      drawLineCtx(left);
      drawLineCtx(right);
      drawLineCtx(bottom);
    }
  }, [top, left, right, bottom, startCropping]);

  return (
    <div>
      <canvas
        onClick={handleClick(onAreaSelect, setStartCropping)}
        onMouseMove={handleMouseMove(onAreaSelect, startCropping)}
        ref={canvasRef}
      ></canvas>
      <button style={{ width: 200, height: 50, marginTop: -10 }} onClick={handleCrop}>
        Crop
      </button>
      <Image ref={imageRef} url={imageUrl} style={{ opacity: 0 }} />
    </div>
  );
}

const handleClick = (onAreaSelect, setStartCropping, ctx) => (event) => {
  setStartCropping((state) => !state);
  onAreaSelect({ x: event.clientX, y: event.clientY });
};

const handleMouseMove = (onAreaSelect, startCropping) => (event) => {
  if (startCropping) {
    onAreaSelect({ x: event.clientX, y: event.clientY });
  }
};

const drawLine = (canvasContext) => (coords, style = {}) => {
  const { x0, y0, x1, y1 } = coords;
  const { color = 'white', width = 2 } = style;
  canvasContext.beginPath();
  canvasContext.moveTo(x0, y0);
  canvasContext.lineTo(x1, y1);
  canvasContext.strokeStyle = color;
  canvasContext.lineWidth = width;
  canvasContext.stroke();
};

const Image = forwardRef(({ url, ...other }, ref) => <img src={url} {...other} ref={ref} alt='Kitten' />);
