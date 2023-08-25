import React, { Component, useEffect, useState } from "react";
import * as toxicity from '@tensorflow-models/toxicity';
  // Post states.

// Toxicity filter based on https://medium.com/tensorflow/text-classification-using-tensorflow-js-an-example-of-detecting-offensive-language-in-browser-e2b94e3565ce
const Post = () => {
    const [postText, setPostText] = useState('');
    const [postValidationText, setPostValidationText] = useState();
    const [toxicityResult, setToxicityResult] = useState();

    const checkPost = async () => {
        // The minimum prediction confidence.
        const threshold = 0.9;

        // Which toxicity labels to return.
        const labelsToInclude = ['toxicity', 'severe_toxicity', 'identity_attack', 'insult', 'threat', 'sexual_explicit', 'obscene'];

        await toxicity.load(threshold, labelsToInclude).then(model => {
            // Now you can use the `model` object to label sentences. 
            model.classify([postText]).then(predictions => {setToxicityResult(predictions)});
            console.log(toxicityResult)

        });
    }
    

    return ( 
        <div>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            maxLength={255}
          />
          <br/>
          {postValidationText}
          <br/>
          {/* {toxicityResult} */}
          <br/>
          <button onClick={() => {checkPost()}}>Post</button>
          <br/>
          You've got {255 - postText.length} letters left.


        </div>
    )
}

export default Post;