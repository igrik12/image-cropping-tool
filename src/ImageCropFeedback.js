import React, { useRef, useEffect, forwardRef, useState } from 'react';

/**
 *
 *
 * @param {Function} onAreaSelect - The callback for area selected event
 */
const handleClick = (onAreaSelect, setStartCrop, startCrop, setTopLeft, topLeft) => (event) => {
  if (!startCrop) {
    setTopLeft({ top: event.clientX, left: event.clientY });
    onAreaSelect({ top: event.clientX, left: event.clientY, bottom: event.clientX, right: event.clientY });
    setStartCrop(true);
  } else {
    onAreaSelect({ top: topLeft.top, left: topLeft.left, bottom: event.clientX, right: event.clientY });
    setStartCrop(false);
  }
};

/**
 *
 *
 * @param {Function} onAreaSelect - The callback for area selected event
 */
const handleMouseMove = (onAreaSelect, startCrop, topLeft) => (event) => {
  if (startCrop) {
    onAreaSelect({ top: topLeft.top, left: topLeft.left, bottom: event.clientX, right: event.clientY });
  }
};
/**
 *
 *
 * @param {HTMLCanvasElement} canvasContext - Convas context
 * @param {Object} coords - x and y coordinates to draw a line
 */
const drawLine = (canvasContext) => (coords) => {
  const { x0, y0, x1, y1 } = coords;
  canvasContext.beginPath();
  canvasContext.moveTo(x0, y0);
  canvasContext.lineTo(x1, y1);
  canvasContext.strokeStyle = 'white';
  canvasContext.lineWidth = 2;
  canvasContext.stroke();
};

export default function ImageCropFeedback({ imageUrl, top, left, right, bottom, onAreaSelect = () => {} }) {
  const canvasRef = useRef();
  const imageRef = useRef();
  const contextRef = useRef();
  const [startCrop, setStartCrop] = useState(false);
  const [topLeft, setTopLeft] = useState({ top, left });

  useEffect(() => {
    const currentCanvas = canvasRef.current;
    const currentImage = imageRef.current;

    currentCanvas.width = currentImage.offsetWidth;
    currentCanvas.height = currentImage.offsetHeight;
    contextRef.current = currentCanvas.getContext('2d');
    currentImage.onload = () => {
      contextRef.current.drawImage(currentImage, 0, 0);
    };
  }, [imageUrl]);

  // This block is responsible for drawing/clearing out the crop area
  useEffect(() => {
    const drawLineWithContext = drawLine(contextRef.current);

    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // This is to clear out existings lines
    contextRef.current.drawImage(imageRef.current, 0, 0); // This is required as we are clearing out the canvas

    const topLine = { x0: top, y0: left, x1: bottom, y1: left };
    const leftLine = { x0: top, y0: left, x1: top, y1: right };
    const rightLine = { x0: bottom, y0: left, x1: bottom, y1: right };
    const bottomLine = { x0: top, y0: right, x1: bottom, y1: right };

    drawLineWithContext(topLine);
    drawLineWithContext(leftLine);
    drawLineWithContext(rightLine);
    drawLineWithContext(bottomLine);
  }, [top, left, right, bottom]);
  return (
    <div>
      <canvas
        onClick={handleClick(onAreaSelect, setStartCrop, startCrop, setTopLeft, topLeft)}
        onMouseMove={handleMouseMove(onAreaSelect, startCrop, topLeft)}
        ref={canvasRef}
      ></canvas>
      <Image ref={imageRef} url={imageUrl} style={{ opacity: 0 }} />
    </div>
  );
}

const Image = forwardRef(({ url, ...other }, ref) => <img src={url} {...other} ref={ref} alt='kitten' />);
