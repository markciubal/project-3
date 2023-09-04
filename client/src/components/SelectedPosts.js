
import React, { useState, useEffect } from 'react';
import Auth from '../utils/auth';
import { Card } from 'bootstrap';

const PostInstance = (props) => {
    const postData = props.post;
    // console.log(postData);
    const user = postData.properties.user;
    const body = postData.properties.body;
    const time = new Date(postData.properties.time).toLocaleString();
    const latitude = postData.geometry.coordinates[1].toFixed(3);
    const longitude = postData.geometry.coordinates[0].toFixed(3);
    return (
    <div className={"post"}>
        <div>{body}</div>
        <div class="post-byline">By: {user} @ [{latitude}, {longitude}], {time}</div>
    </div>)
}
const SelectedPosts = (props) => {
    const [selectedText, setSelectedText] = useState();
    const [postResults, setPostResults] = useState();
    const [selectedPosts, setSelectedPosts] = useState();
    // props.setIsSelectedPostPaneOpen(true);
    console.log(Auth);
    useEffect(() => {
        console.log(props);
        let keyCount = 0;
        if (props.selectedMapPosts) {
            
            let postLength = props.selectedMapPosts.length;
            console.log(postLength);
            if (postLength !== 1) {
                setSelectedText(postLength + " posts selected.");
            } else {
                setSelectedText(postLength + " post selected.");
            }
            if (props.selectedMapPosts.length) {
                setSelectedPosts(props.selectedMapPosts.map((post) => {
                    keyCount++;
                    return <PostInstance key={`post-${keyCount}`} post={post}/>;
                    
                }));
            } else {
                setSelectedPosts(<PostInstance key={`post-${keyCount}`} post={props.selectedMapPosts}/>);
            }
            props.setIsSelectedPaneOpen(true);
        }
        
    }, [props.selectedMapPosts])
    return selectedPosts;
}

export default SelectedPosts;