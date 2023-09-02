
import React, { useState, useEffect } from 'react';
const PostInstance = (props) => {
    const postData = props.post;
    // console.log(postData);
    const user = postData.properties.user;
    const body = postData.properties.body;
    const time = postData.properties.time;
    return (
    <div>
        <div>{body}</div>
        <div>By: User @ {time}</div>
    </div>)
}
const SelectedPosts = (props) => {
    const [selectedText, setSelectedText] = useState();
    const [postResults, setPostResults] = useState();
    const [selectedPosts, setSelectedPosts] = useState();
    // props.setIsSelectedPostPaneOpen(true);
    console.log(props);
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