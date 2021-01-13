import React, { useState } from 'react';
import ImageCropFeedback from './ImageCropFeedback';
import './App.css';

function App() {
  const [area, setArea] = useState({ start: { x: 50, y: 50 }, end: { x: 350, y: 350 } });
  const [startCropping, setStartCropping] = useState(false);

  const handleOnAreaSelect = (coords) => {
    if (startCropping) {
      setArea({ start: area.start, end: coords });
    } else {
      setArea({ start: coords, end: coords });
    }
  };

  return (
    <div className='App'>
      <ImageCropFeedback
        imageUrl='https://placekitten.com/600/600'
        start={area.start}
        end={area.end}
        startCropping={startCropping}
        setStartCropping={setStartCropping}
        onAreaSelect={handleOnAreaSelect}
      />
    </div>
  );
}

export default App;
