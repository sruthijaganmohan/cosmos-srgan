import React from "react";
import { useEffect, useState} from "react";
import * as tf from "@tensorflow/tfjs";
import './App.css';
import './model/model.json';



const App = () => {
  const [inputImage, setInputImage] = useState(null);
  const [model, setModel] = useState();

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
    const img = new Image(inputImage);
    img.width = 32;
    img.height = 32;
    // let offset = tf.scalar(255.0)
    // let lri = tf.browser.fromPixels(img).toFloat().sub(offset).div(offset).expandDims();
    // console.log(lri);
    // superResolve(model, lri);
    img.onload = () => {
      const offset = tf.scalar(255.0);
      const lri = tf.browser
        .fromPixels(img)
        .toFloat()
        .sub(offset)
        .div(offset)
        .expandDims();
      console.log(lri);
      superResolve(model, lri);
    };
    img.src = URL.createObjectURL(inputImage);
  };

  
  const superResolve = (model, lri) => {
    console.log(lri);
    const sri = model.predict([lri]);
    console.log(sri);
    construct(sri);
  };

  const construct = (sri) => {
    const canvas = new OffscreenCanvas(128, 128);
    const ctx = canvas.getContext('2d');
    const width = sri.shape[1];
    const height = sri.shape[2];
    const buffer = new Uint8ClampedArray(width * height * 4);
    const imageData = new ImageData(width, height);
    const data = sri.dataSync();
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
    canvas.convertToBlob().then(function(blob) {
          const url = URL.createObjectURL(blob);
          console.log({ src: url });
        });

  };

  useEffect(() => {
    tf.ready().then(() => {
    loadModel();
    });
  }, []);

  return (
    <div className="App">

      <div>
        {inputImage && (
          <div>
            <img
              alt="not found"
              width={"250px"}
              src={URL.createObjectURL(inputImage)}
            />
          </div>
        )}

      <div>
        <button onClick={() => preprocessImage(inputImage)}>super resolve</button>
      </div>

        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            setInputImage(event.target.files[0]);
          }}
        />
      </div>

    </div>
  );
};

export default App;
