
import React, { useState, useEffect } from 'react';
const PostInstance = (props) => {
    const postData = props.post;
    console.log(postData);
    return (
    <div>

    </div>)
}
const SelectedPosts = (props) => {
    const [selectedText, setSelectedText] = useState();
    const [postResults, setPostResults] = useState();
    const [selectedPosts, setSelectedPosts] = useState();
    // props.setIsSelectedPostPaneOpen(true);
    console.log(selectedPosts);
    useEffect(() => {
        console.log(props);
        let keyCount = 0;
        if (props.selectedMapPosts) {
            
            let postLength = props.selectedMapPosts.length;
            
            if (postLength !== 1) {
                setSelectedText(postLength + " posts selected.");
            } else {
                setSelectedText(postLength + " post selected.");
            }
            setSelectedPosts(props.selectedMapPosts.map((post) => {
                keyCount++;
                return <PostInstance key={`post-${keyCount}`} post={post}/>;
                
            }));
            props.setIsSelectedPaneOpen(true);
            
        }
        
    }, [props.selectedMapPosts])
    return selectedPosts;
}

export default SelectedPosts;