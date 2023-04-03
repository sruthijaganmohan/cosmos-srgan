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

  // const preprocessImage = (inputImage) => {
  //   let img = document.getElementById('saturn');
  //   img.width = 128;
  //   img.height = 128;
    // img.src = URL.createObjectURL(inputImage);
    // img.addEventListener("load", function() {
      // document.body.appendChild(img);
      // let offset = tf.scalar(255.0);
      // let lri = tf.browser.fromPixels(img).toFloat().sub(offset).div(offset).expandDims();
  //     let lri = tf.browser.fromPixels(img);
  //     console.log(lri);
  //     console.log(lri.shape);
  //     const data = lri.dataSync();
  //     console.log(data);
  //   });
  // };

  const preprocessImage = (inputImage) => {
    const img = new Image();
    img.src = URL.createObjectURL(inputImage);
    img.width = 32;
    img.height = 32;
    img.addEventListener("load", function() {
      let offset = tf.scalar(255.0);
      const lri = tf.browser.fromPixels(img).div(offset).expandDims();
      console.log(lri);
      const sri = model.predict(lri);
      console.log(sri);
      
      // const tensorWithoutBatch = tf.squeeze(lri);
      // const scaledTensor = tensorWithoutBatch.mul(255);
      // const offsetTensor = scaledTensor.add(255);
      // const intTensor = tf.cast(offsetTensor, 'int32');
      // const finalTensor = tf.squeeze(intTensor);
      const tensorWithoutBatch = tf.squeeze(sri)
      const finalTensor = tensorWithoutBatch.mul(255);
      // const sriRestored = sri.mul(offset).clipByValue(0, 255).div(offset);
      // const scaledTensor = sriRestored.mul(255);
      // const intTensor = tf.cast(scaledTensor, 'int32');
      // const finalTensor = tf.squeeze(intTensor);
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
    });
  }

  
  // const superResolve = (model, lri) => {
  //   const sri = model.predict(lri);
  //   console.log(sri);
  //   construct(sri);
  // };

  // const construct = (sri) => {
  //   const canvas = document.createElement('canvas');
  //   canvas.width = 128;
  //   canvas.height = 128;
  //   const ctx = canvas.getContext('2d');
  //   const [height, width] = sri.shape;
  //   const buffer = new Uint8ClampedArray(width * height * 4);
  //   const imageData = new ImageData(width, height);
  //   const data = sri.dataSync();
  //   console.log(data);
  //   var i = 0;
  //   for(var y = 0; y < height; y++) {
  //   for(var x = 0; x < width; x++) {
  //       var pos = (y * width + x) * 4;      
  //       buffer[pos  ] = data[i]             
  //       buffer[pos+1] = data[i+1]           
  //       buffer[pos+2] = data[i+2]           
  //       buffer[pos+3] = 255;            
  //       i+=3
  //     }
  //   }
  //   imageData.data.set(buffer);
  //   ctx.putImageData(imageData, 0, 0);
    // const url = URL.createObjectURL(imageData);
    // console.log({ src: url });
  //   const url = canvas.toDataURL();
  //   console.log(url); 
  // };

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
          id="saturn"
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
