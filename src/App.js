import React, { useState } from 'react';
import ImageCropFeedback from './ImageCropFeedback';
import './App.css';

const initialArea = {
  top: { x0: 50, y0: 50, x1: 350, y1: 50 },
  left: { x0: 50, y0: 50, x1: 50, y1: 350 },
  right: { x0: 350, y0: 50, x1: 350, y1: 350 },
  bottom: { x0: 50, y0: 350, x1: 350, y1: 350 },
};

function App() {
  const [area, setArea] = useState(initialArea);
  const [startCropping, setStartCropping] = useState(false);
  const [url, setUrl] = useState('https://placekitten.com/600/600');
  const [croppedImageUrl, setCroppedImageUrl] = useState(url);

  const handleCrop = () => {
    setUrl(croppedImageUrl);
  };

  const cropImage = (coords, startCropping) => {
    const width = area.top.x1 - area.top.x0;
    const height = area.left.y1 - area.left.y0;
    const canvas = document.createElement('canvas');
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext('2d');
    let image = new Image();
    image.src = url;
    image.crossOrigin = 'Anonymous';
    ctx.drawImage(image, area.top.x0, area.left.y0, width, height, 0, 0, width, height);
    setCroppedImageUrl(canvas.toDataURL());
  };

  let top, left, right, bottom;
  const handleOnAreaSelect = (coords) => {
    if (startCropping) {
      top = { x0: area.top.x0, y0: area.top.y0, x1: coords.x, y1: area.top.y1 };
      left = { x0: area.top.x0, y0: area.top.y0, x1: area.top.x0, y1: coords.y };
      right = { x0: coords.x, y0: area.top.y0, x1: coords.x, y1: coords.y };
      bottom = { x0: area.top.x0, y0: coords.y, x1: coords.x, y1: coords.y };
      cropImage(coords, startCropping);
    } else {
      top = left = right = bottom = { x0: coords.x, y0: coords.y, x1: coords.x, y1: coords.y };
    }
    setArea({ top, left, right, bottom });
  };

  return (
    <div className='App'>
      <ImageCropFeedback
        imageUrl={url}
        start={area.start}
        end={area.end}
        top={area.top}
        left={area.left}
        right={area.right}
        bottom={area.bottom}
        startCropping={startCropping}
        setStartCropping={setStartCropping}
        onAreaSelect={handleOnAreaSelect}
        handleCrop={handleCrop}
      />
    </div>
  );
}

export default App;
