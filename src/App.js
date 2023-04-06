import React from "react";
import { useEffect, useState} from "react";
import * as tf from "@tensorflow/tfjs";
import './App.css';
import './model/model.json';
import astronautImage from './images/astronaut 2.png';



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
      <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'></link>
      <nav>
        <ul class="menu">
          <li><a href="#about-section">About</a></li>
          <li><a href="#super-resolve-section">Super-resolve</a></li>
          <li><a href="#">Hubble</a></li>
          <li><a href="#">James Webb</a></li>
        </ul>
      </nav>
      
      <div id="#about-section" className="about">
        <div className="about-child"><img src={astronautImage} alt="astronaut"/></div>
        <div className="about-child"><h1>About</h1>
        <p>Images taken through astronomical telescopes of the cosmos and heavenly bodies are often of low resolution. 
          Reasons could include environmental factors, temperature, turbulence, human error etc.
          AI assisted super resolution of cosmological images helps remove noise and atmospheric blur. 
          The architecture and working of generative adversarial networks allow them to produce highly convincing synthetic estimates of the original image that are perceptually satisfactory. 
          These estimates are highly valuable to parties interested in astronomical and cosmological studies.</p></div>
      </div>

      {/*
      <div id="#super-resolve-section">
        {inputImage && (
          <div>
            <img
              id="low-res"
              alt="not found"
              width={"128px"}
              src={URL.createObjectURL(inputImage)}
            />
          </div>
        )}

        {imageURL && (
          <div>
            <img
              alt="low-resolution"
              width={"250px"}
              src={imageURL}
            />
          </div>
        )}

      <div>
        <button onClick={() => preprocessImage(inputImage)}>super resolve</button>
      </div>

        <input
          id="saturn"
          alt="super-resolution"
          type="file"
          name="myImage"
          onChange={(event) => {
            setInputImage(event.target.files[0]);
          }}
        />
        </div> */}

    </div>
  );
};

export default App;
