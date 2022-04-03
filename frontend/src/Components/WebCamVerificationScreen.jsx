import React, { useState, useEffect } from "react";
import { Button} from 'react-bootstrap';
import Webcam from "react-webcam";

const WebCamVerificationScreen = (props) => {
    
      const videoConstraints = {
        width: 780,
        height: 420,
        facingMode: "user"
      };

      return (
          <>
            <div className="WebCam-verification-screen">
                {props.userImage? 

                    <div>
                        <img src={props.userImage}/>
                        <br />
                        <Button style={{backgroundColor: 'green'}} onClick={() => props.setUserImage(null)}>Retake Picture</Button>
                    </div>
                :

                <Webcam
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    >
                        {({ getScreenshot }) => (
                            <Button
                                onClick={() => {
                                let imageFile = getScreenshot()
                                props.setUserImage(imageFile)
                                }}
                            >
                                Capture photo
                            </Button>
                    )}
                    </Webcam> 
            }
            </div>
          </>
      );
}

export default WebCamVerificationScreen;