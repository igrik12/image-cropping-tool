import React, { useRef, useEffect, useLayoutEffect, forwardRef, useState } from 'react';

export default function ImageCropFeedback({
  imageUrl,
  start,
  end,
  onAreaSelect = () => {},
  startCropping,
  setStartCropping,
}) {
  const canvasRef = useRef();
  const imageRef = useRef();
  const contextRef = useRef();
  const firstRun = useRef(true);

  useLayoutEffect(() => {
    const currentCanvas = canvasRef.current;
    const currentImage = imageRef.current;

    currentCanvas.width = currentImage.offsetWidth;
    currentCanvas.height = currentImage.offsetHeight;
    contextRef.current = currentCanvas.getContext('2d');
    currentImage.onload = () => {
      contextRef.current.drawImage(currentImage, 0, 0);
    };
  }, []);

  useEffect(() => {
    const drawLineCtx = drawLine(contextRef.current);
    let top;
    let left;
    let right;
    let bottom;
    if (firstRun.current) {
      top = { x0: 50, y0: 50, x1: 350, y1: 50 };
      left = { x0: 50, y0: 50, x1: 50, y1: 350 };
      right = { x0: 350, y0: 50, x1: 350, y1: 350 };
      bottom = { x0: 50, y0: 350, x1: 350, y1: 350 };
      firstRun.current = false;
    } else {
      top = { x0: start.x, y0: start.y, x1: end.x, y1: start.y };
      left = { x0: start.x, y0: start.y, x1: start.x, y1: end.y };
      right = { x0: end.x, y0: start.y, x1: end.x, y1: end.y };
      bottom = { x0: start.x, y0: end.y, x1: end.x, y1: end.y };
    }
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    contextRef.current.drawImage(imageRef.current, 0, 0);
    drawLineCtx(top);
    drawLineCtx(left);
    drawLineCtx(right);
    drawLineCtx(bottom);
  }, [start, end]);

  return (
    <div>
      <canvas
        onClick={handleClick(onAreaSelect, setStartCropping)}
        onMouseMove={handleMouseMove(onAreaSelect, startCropping)}
        ref={canvasRef}
      ></canvas>
      <Image ref={imageRef} url={imageUrl} style={{ opacity: 0 }} />
    </div>
  );
}

const handleClick = (onAreaSelect, setStartCropping, ctx) => (event) => {
  onAreaSelect({ x: event.clientX, y: event.clientY });
  setStartCropping((state) => !state);
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
