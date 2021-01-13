import React, { useRef, useEffect, useLayoutEffect, forwardRef } from 'react';

export default function Imagecropfeedback({
  imageUrl,
  top = { x0: 50, y0: 50, x1: 350, y1: 50 },
  left = { x0: 50, y0: 50, x1: 50, y1: 350 },
  right = { x0: 350, y0: 50, x1: 350, y1: 350 },
  bottom = { x0: 50, y0: 350, x1: 350, y1: 350 },
  onAreaSelect = () => {},
}) {
  const canvasRef = useRef();
  const imageRef = useRef();
  const contextRef = useRef();

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
    drawLineCtx(top);
    drawLineCtx(left);
    drawLineCtx(right);
    drawLineCtx(bottom);
  }, [top, left, right, bottom]);

  return (
    <div>
      <canvas onMouseMove={handleMouseMove(onAreaSelect)} onClick={handleClick(onAreaSelect)} ref={canvasRef}></canvas>
      <Image ref={imageRef} url={imageUrl} style={{ opacity: 0 }} />
    </div>
  );
}

const handleClick = (onAreaSelect) => (event) => {
  console.log(event.clientX);
  console.log(event.clientY);
};

const handleMouseMove = (onAreaSelect) => (event) => {
  console.log(event.clientX);
  console.log(event.clientY);
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
