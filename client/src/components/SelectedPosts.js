
import React, { useState, useEffect } from 'react';

const SelectedPosts = (props) => {
    const [selectedText, setSelectedText] = useState();
    // props.setIsSelectedPostPaneOpen(true);
    
    useEffect(() => {
        console.log(props);

        if (props.selectedMapPosts) {
            let postLength = props.selectedMapPosts.length;
            if (postLength !== 1) {
                setSelectedText(postLength + " posts selected.");
            } else {
                setSelectedText(postLength + " post selected.");
            }
            props.setIsSelectedPostPaneOpen(true);
            
        }
        return selectedText;
    }, [props.selectedMapPosts])
}

export default SelectedPosts;