import React, { Component, useEffect, useState } from "react";
import * as toxicity from '@tensorflow-models/toxicity';
import ToxicityGrid from './ToxicityGrid'; 
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

  // Post states.

// Toxicity filter based on https://medium.com/tensorflow/text-classification-using-tensorflow-js-an-example-of-detecting-offensive-language-in-browser-e2b94e3565ce
const Post = () => {
    const [postText, setPostText] = useState('');
    const [postValidationText, setPostValidationText] = useState();
    const [toxicityResult, setToxicityResult] = useState([]);
    const [spinnerHidden, setSpinnerHidden] = useState(true);
    const [postDisabled, setPostDisabled] = useState(false);
    const [postButtonText, setPostButtonText] = useState("Post");
    // This should probably be server side.
    const checkPost = async () => {
        if (postText.length !== 0) {
            // The minimum prediction confidence.
            const threshold = 0.7;

            // Which toxicity labels to return.
            const labelsToInclude = ['toxicity', 'severe_toxicity', 'identity_attack', 'insult', 'threat', 'sexual_explicit', 'obscene'];

            setPostDisabled(true);
            setSpinnerHidden(false);
            setPostButtonText("Checking post content...")
            await toxicity.load(threshold, labelsToInclude).then(model => {
                // Now you can use the `model` object to label sentences. 
                model.classify([postText]).then(predictions => {
                    setToxicityResult(predictions);
                    setPostDisabled(false); 
                    setSpinnerHidden(true); 
                    setPostButtonText("Post")
                });
            });
        }
    }
    

    return ( 
        <div>
          <textarea
            className="w-100"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            maxLength={255}
          />
          <br/>
          {255 - postText.length} letters left.
          <br/>
          {postValidationText}
          <br/>
            <ToxicityGrid toxicityResult={toxicityResult}></ToxicityGrid>
          <br/>
          <Button variant="outline-success" onClick={() => {checkPost()}} disabled={postDisabled}>
            <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="false"
            hidden={spinnerHidden}
            /> {postButtonText}
            </Button>
          <br/>
          </div>
    )
}

export default Post;