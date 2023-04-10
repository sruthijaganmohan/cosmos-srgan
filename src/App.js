import React from "react";
import { useEffect, useState} from "react";
import * as tf from "@tensorflow/tfjs";
import './App.css';
import './model/model.json';
import astronautImage from './images/astronaut 2.png';
import hubbleImage from './images/hubble.png'
import jamesWebbImage from './images/james webb.png'

const App = () => {
  const [inputImage, setInputImage] = useState(null);
  const [model, setModel] = useState();
  const [imageURL, setImageURL] = useState();

  const loadModel = async () => {
    try {
      const gansModel = await tf.loadLayersModel('http://localhost:8080/model.json');
      setModel(gansModel);console.log(gansModel);
      console.log("set loaded Model");
    } 
    catch (err) {
      console.log(err);
      console.log("failed load model");
    }
  }

  const preprocessImage = (inputImage) => {
    const img = new Image();
    img.src = URL.createObjectURL(inputImage);
    img.width = 32;
    img.height = 32;
    img.addEventListener("load", function() {
      let offset = tf.scalar(255);
      const lri = tf.browser.fromPixels(img).div(offset).expandDims();
      console.log(lri);
      const sri = model.predict(lri);
      console.log(sri);
      const deprocessedTensor = tf.squeeze(sri).mul(offset).clipByValue(0, 255);
      const finalTensor = tf.cast(deprocessedTensor, 'int32');
      console.log(finalTensor);
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      const [height, width] = finalTensor.shape;
      const buffer = new Uint8ClampedArray(width * height * 4);
      const imageData = new ImageData(width, height);
      const data = finalTensor.dataSync();
      console.log(data);
      var i = 0;
      for(var y = 0; y < height; y++) {
      for(var x = 0; x < width; x++) {
          var pos = (y * width + x) * 4;      
          buffer[pos  ] = data[i]             
          buffer[pos+1] = data[i+1]           
          buffer[pos+2] = data[i+2]           
          buffer[pos+3] = 255;            
          i+=3
        }
      }
      imageData.data.set(buffer);
      ctx.putImageData(imageData, 0, 0);
      const url = canvas.toDataURL();
      console.log(url);
      setImageURL(url);
      
    });
  }

  useEffect(() => {
    tf.ready().then(() => {
    loadModel();
    });
  }, []);

  return (
    <div className="App">
      
      <nav>
        <ul className="menu">
          <li><a href="#about-section">About</a></li>
          <li><a href="#super-resolve-section">Super-resolve</a></li>
          <li><a href="#hubble-section">Hubble</a></li>
          <li><a href="#james-webb-section">James Webb</a></li>
        </ul>
      </nav>
      
      <div id="about-section" className="about">
        
        <div className="about-child"><img src={astronautImage} alt="astronaut"/></div>
        <div className="about-child"><h1>About</h1>
        <p>Images taken through astronomical telescopes of the cosmos and heavenly bodies are often of low resolution. 
          Reasons could include environmental factors, temperature, turbulence, human error etc.
          AI assisted super resolution of cosmological images helps remove noise and atmospheric blur. 
          The architecture and working of generative adversarial networks allow them to produce highly convincing synthetic estimates of the original image that are perceptually satisfactory. 
          These estimates are highly valuable to parties interested in astronomical and cosmological studies.</p></div>
      </div>

      
      <div id="super-resolve-section">
        <div className="super-resolve">
        {inputImage && (
          <div className="super-resolve-child">
            <img
              id="low-resolution"
              alt="not found"
              width={"300px"}
              src={URL.createObjectURL(inputImage)}
            />
          </div>
        )}

        {imageURL && (
          <div className="super-resolve-child">
            <img
              id="super-resolution"
              alt="low-resolution"
              width={"300px"}
              src={imageURL}
            />
          </div>
        )}
        
        <input
          id="upload-img"
          className="super-resolve-child"
          alt="super-resolution"
          type="file"
          name="myImage"
          onChange={(event) => {
            setInputImage(event.target.files[0]);
          }}
        />

        <button id="super-resolve-button" className="super-resolve-child" onClick={() => preprocessImage(inputImage)}>super-resolve</button>
        
      </div> 
        
        
      </div>

      <div id="hubble-section">
        <div className="hubble">
      <div className="hubble-child"><h1>Hubble Space Telescope</h1>
      <p>The Hubble Space Telescope (often referred to as HST or Hubble) is a space telescope that was launched into low Earth orbit in 1990 and remains in operation.
      It is one of the largest and most versatile, renowned both as a vital research tool and as a public relations boon for astronomy.
      The Hubble telescope is named after astronomer Edwin Hubble and is one of NASA's Great Observatories.
      Hubble features a 2.4 m (7 ft 10 in) mirror, and its five main instruments observe in the ultraviolet, visible, and near-infrared regions of the electromagnetic spectrum.</p></div>
      <div className="hubble-child"><img src={hubbleImage} alt="hubble"/></div>
      </div>
      </div>

    </div>
    
  );
};

export default App;
