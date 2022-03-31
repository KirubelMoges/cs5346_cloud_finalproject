import React, { useEffect, useRef } from "react";
import { Button, Modal } from 'react-bootstrap';
import Webcam from "react-webcam";

const WebCamVerificationScreen = () => {

      const videoConstraints = {
        width: 780,
        height: 420,
        facingMode: "user"
      };

      return (
          <>
            <div className="WebCam-verification-screen">
                <Webcam
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                >
                    {({ getScreenshot }) => (
                    <button
                        onClick={() => {
                        const imageSrc = getScreenshot()
                        console.log("Image found!: ", imageSrc)
                        }}
                    >
                        Capture photo
                    </button>
                    )}
                </Webcam>
            </div>
          </>
      );
}

export default WebCamVerificationScreen;