import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import gifshot from 'gifshot';

import './CameraRecorder.css'

const CameraRecorder = () => {
  const [gifData, setGifData] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedFrames, setRecordedFrames] = useState([]);
  const [loader, setLoader] = useState(false);

  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 420,
    height: 420,
    facingMode: "user",
  };

  const frameRate = 100;

  const startRecording = useCallback(() => {
    setRecording(true);
    setGifData(null);
    setRecordedFrames([]);

    let interval = setInterval(() => {
      const frame = webcamRef?.current?.getScreenshot();
      if (frame) {
        setRecordedFrames((prevFrames) => [...prevFrames, frame]);
      } else {
        clearInterval(interval);
        return;
      }
    }, frameRate);
  }, []);

  const stopRecording = useCallback(() => {
    setRecording(false);
    setLoader(true);

    const gifOptions = {
      images: recordedFrames,
      interval: frameRate / 1000,
      gifWidth: 400,
      gifHeight: 400,
    };

    gifshot.createGIF(gifOptions, (obj) => {
      if (!obj.error) {
        setGifData(obj.image);
        setLoader(false);
      }
    });
  }, [recordedFrames]);

  return (
    <div className="container">
      {!gifData ? (
        <>
          <div className='webcam-container'>
            <Webcam
              audio={false}
              mirrored={true}
              height={400}
              width={400}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className={`${loader && 'loadingFilter'}`}
            />
            {loader && <div className='loader'>Loading...</div>}
          </div>
          {recording ? (
            <button onClick={stopRecording} className={`stopRec ${loader && 'disabled'}`} disabled={loader}>Stop Recording</button>
          ) : (
            <button onClick={startRecording} className={`startRec ${loader && 'disabled'}`} disabled={loader}>Start Recording</button>
          )}
        </>
      ) : (
        <>
          <img src={gifData} alt="Recorded GIF" />
          <h2>Preview video</h2>
          <button onClick={() => setGifData(null)} className={`reRec ${loader && 'disabled'}`} disabled={loader}>Re-record</button>
        </>
      )}
    </div>
  );
};

export default CameraRecorder;
