import React, { Component, useEffect, useState } from "react";
import { useMutation, useQuery } from '@apollo/client';
import * as toxicity from '@tensorflow-models/toxicity';
import ToxicityGrid from './ToxicityGrid'; 
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import '../App.css';
import { ADD_POST } from '../utils/mutations';
import Auth from '../utils/auth';
import { GET_ALL_POSTS } from '../utils/queries';
import postToGeoJSON from '../utils/postToGeoJSON';

  // Post states.

// Toxicity filter based on https://medium.com/tensorflow/text-classification-using-tensorflow-js-an-example-of-detecting-offensive-language-in-browser-e2b94e3565ce
const Post = (props) => {
  // This is used for the state of the form
  const [formState, setFormState] = useState({ body: '' });
  const [addPost, { error: addPostError }] = useMutation(ADD_POST);


  const [postText, setPostText] = useState('');
  const [postValidationText, setPostValidationText] = useState();
  const [toxicityResult, setToxicityResult] = useState([]);
  const [spinnerHidden, setSpinnerHidden] = useState(true);
  const [postDisabled, setPostDisabled] = useState(false);
  const [postButtonText, setPostButtonText] = useState("Post");
  const [didPostSend, setDidPostSend] = useState(0);
  const { loading, error, data } = useQuery(GET_ALL_POSTS);

  // This should probably be server side.
  const checkPost = async () => {
    if (postText.length !== 0) {
        // The minimum prediction confidence.
        const threshold = 0.7;

        // Which toxicity labels to return.
        const labelsToInclude = ['toxicity', 'severe_toxicity', 'identity_attack', 'insult', 'threat', 'sexual_explicit', 'obscene'];

        setPostDisabled(true);
        setSpinnerHidden(false);
        // Space before text is intentional, it is for putting a gap between the loader and the text.
        setPostButtonText(" Checking post content...")
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
  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);

    setFormState({
      ...formState,
      [name]: value,
    });
  };
  
  // const useGetData = async () => {
  //   const { loading, error, data } = useQuery(GET_ALL_POSTS);
  //   async function getAllPosts() {
  //     if (!loading) {
  //       console.log(postGeoJSON);
  //       const postData = postToGeoJSON(data);
  //       setPostGeoJSON(postData);
  //       console.log(postGeoJSON);
  //       console.log(postData);
  //     }
  //   }
  //     getAllPosts();
  // }
  React.useEffect(() => {
    async function getAllPosts() {
    if (!loading) {
      const postData = postToGeoJSON(data);
      props.setPostGeoJSON(postData);
      console.log(postData);
    }
  }
    getAllPosts();
  }, [data]);
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      // let approvePost = await checkPost();
      const mutationResponse = addPost({
        variables: {body: formState.body, latitude: props.centerLatitude, longitude: props.centerLongitude},
      });
      // set to change 
      props.setIsPostPaneOpen(false);
      let newPostSend = didPostSend + 1;
      setDidPostSend(newPostSend);
    } catch (e) {
      console.log(error);
      console.log(e);
    }
  };

  // React.useEffect(() => {
  //     useGetData();
  // }, [postToGeoJSON]);

  useEffect(() => {

  }, [toxicityResult])
    return ( 
        <div className="align-items-center justify-content-center text-center">
          @ {`${props.centerLatitude}, ${props.centerLongitude}`}
          <form onSubmit={handleFormSubmit}>
            <textarea
              className="w-100"
              value={postText}
              name="body"
              onChange={(e) => {
                setPostText(e.target.value);
                handleChange(e);
              }}
              maxLength={255}
              style={{ color: 'blue', borderColor: 'lightblue' }}
            />
            <br/>
            {255 - postText.length} letters left.
            {postValidationText}
            {/* <ToxicityGrid toxicityResult={toxicityResult}></ToxicityGrid> */}
            <div>
              <Button type="submit" disabled={postDisabled}>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="false"
                hidden={spinnerHidden}
              />{postButtonText}
              </Button>
            </div>
          </form>
          <br/>
          <p>Pin the World🌐</p>
          </div>
    )
}

export default Post;