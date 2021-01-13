import React, { useRef, useEffect, forwardRef } from 'react';

/**
 *
 *
 * @param {Function} onAreaSelect - The callback for area selected event
 * @param {Function} setStartCropping - The callback to set start cropping flag
 * @param {HTMLCanvasElement} canvasContext - Convas context
 */
const handleClick = (onAreaSelect, setStartCropping, canvasContext) => (event) => {
  onAreaSelect({ x: event.clientX, y: event.clientY });
  setStartCropping((state) => !state);
};

/**
 *
 *
 * @param {Function} onAreaSelect - The callback for area selected event
 * @param {boolean} startCropping - The flag for start cropping
 */
const handleMouseMove = (onAreaSelect, startCropping) => (event) => {
  if (startCropping) {
    onAreaSelect({ x: event.clientX, y: event.clientY });
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

    drawLineWithContext(top);
    drawLineWithContext(left);
    drawLineWithContext(right);
    drawLineWithContext(bottom);
  }, [top, left, right, bottom]);

  return (
    <div>
      <canvas
        onClick={handleClick(onAreaSelect, setStartCropping)}
        onMouseMove={handleMouseMove(onAreaSelect, startCropping)}
        ref={canvasRef}
      ></canvas>
      <button style={{ width: 200, height: 50 }} onClick={handleCrop}>
        Crop
      </button>
      <Image ref={imageRef} url={imageUrl} style={{ opacity: 0 }} />
    </div>
  );
}

const Image = forwardRef(({ url, ...other }, ref) => <img src={url} {...other} ref={ref} alt='kitten' />);
