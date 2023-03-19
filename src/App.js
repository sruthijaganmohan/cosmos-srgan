import React from "react";
import { useEffect, useState, useContext } from "react";
import * as tf from "@tensorflow/tfjs";
import './App.css';
import './model/model.json';
import { model } from "@tensorflow/tfjs";

const App = () => {
  const [inputImage, setInputImage] = useState(null);
  const [models, setModels] = useState();


  const loadModel = async () => {
    // const def = new model('./model.json');
    try {
      // await def.save('localstorage://model.json');
      const gansModel = await tf.loadLayersModel('model.json');
      // const gansModel = await tf.loadLayersModel('localstorage://model.json');
      setModels(gansModel);
      console.log(gansModel);
      console.log("set loaded Model");
    } 
    catch (err) {
      console.log(err);
      console.log("failed load model");
    }
  }

  const preprocessImage = (inputImage) => {
    let img = new Image(inputImage);
    img.width = 100;
    img.height = 100;
    let tensor = tf.browser.fromPixels(img);
    const resized = tf.image.resizeBilinear(tensor, [32, 32]).toFloat();
    const offset = tf.scalar(255.0);
    const normalized = tf.scalar(1.0).sub(resized.div(offset));
    const lri = normalized.expandDims(0);
    console.log(lri);
    superResolve(lri);
  }

  const superResolve = (lri) => {
    const prediction = models.predict(lri);
    console.log(prediction);
  }

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
