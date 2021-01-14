import React, { useState } from 'react';
import ImageCropFeedback from './ImageCropFeedback';

const initial = {
  top: 50,
  left: 50,
  bottom: 350,
  right: 350,
};

// Create tempCanvas here so we don't have to recreate it each time area changes
const tempCanvas = document.createElement('canvas');
const tempCanvasContext = tempCanvas.getContext('2d');
const image = new Image();

/**
 *
 *
 * @param {Object} { top, left, bottom, right } - coordinates for the crop area
 * @param {string} url - The url for the image
 * @param {Function} setCroppedImageUrl - callback to set cropped image url
 */
const cropImage = ({ top, left, bottom, right }, url, setCroppedImageUrl) => {
  const width = bottom - top;
  const height = right - left;
  tempCanvas.height = height;
  tempCanvas.width = width;
  image.src = url;
  image.crossOrigin = 'Anonymous';
  tempCanvasContext.drawImage(image, top, left, width, height, 0, 0, width, height);
  setCroppedImageUrl(tempCanvas.toDataURL());
};

function App() {
  const [area, setArea] = useState(initial);
  const [url, setUrl] = useState('https://placekitten.com/600/600');
  const [croppedImageUrl, setCroppedImageUrl] = useState(url);

  const handleCrop = () => {
    setUrl(croppedImageUrl);
  };

  const handleOnAreaSelect = (coords) => {
    setArea(coords);
    cropImage(coords, url, setCroppedImageUrl);
  };

  return (
    <div className='App'>
      <ImageCropFeedback
        imageUrl={url}
        top={area.top}
        left={area.left}
        right={area.right}
        bottom={area.bottom}
        onAreaSelect={handleOnAreaSelect}
      />
      <button style={{ width: 200, height: 50 }} onClick={handleCrop}>
        Crop
      </button>
    </div>
  );
}

export default App;
