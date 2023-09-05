
import React, { useState, useEffect } from 'react';
import Auth from '../utils/auth';
import { Card } from 'bootstrap';
import { GET_ME } from '../utils/queries';
import { DELETE_POST, UPDATE_POST } from '../utils/mutations';
import { useMutation, useQuery } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import Post from './Post';
const UpdateInstance = (props) => {

}

const PostInstance = (props) => {
    const [deletePost, { error, data }] = useMutation(DELETE_POST);
    const [updatePost, { error: updateError, data: updateData }] = useMutation(UPDATE_POST);

    const postData = props.post;
    console.log(props);
    const id = postData.properties.id;
    const user = postData.properties.user;
    const body = postData.properties.body;
    const time = new Date(postData.properties.time).toLocaleString();
    const latitude = postData.geometry.coordinates[1].toFixed(3);
    const longitude = postData.geometry.coordinates[0].toFixed(3);
    return (
    <div id={id} className={"post rounded-1 align-items-center justify-content-center text-center"}>
        <div id={id + "-text"}>{body}</div>
        {/* <Post id={id + "-update"} hidden/> */}
        <div className="post-byline">By: {user}<br/>@ [{latitude}, {longitude}]<br/>{time}</div>
        {(props.me?.me?._id.toString() === postData.properties.userId.toString()) && 
            <>
                <Button className="btn-danger m-3" onClick={() => {
                    deletePost({variables: { userId: postData.properties.userId, postId: id}});
                    document.getElementById(id).remove();
                }} type="button">Delete</Button>
                <Button className="btn-warning m-3" disabled onClick={() => {    

                }} type="button">Update</Button>
            </>
        }
    </div>)
}
const SelectedPosts = (props) => {
    const [selectedText, setSelectedText] = useState();
    const [postResults, setPostResults] = useState();
    const [selectedPosts, setSelectedPosts] = useState();
    const { loading, error, data } = useQuery(GET_ME);
    console.log(data);
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
                    return <PostInstance key={`post-${keyCount}`} post={post} loading={loading} me={data} />;
                    
                }));
            } else {
                setSelectedPosts(<PostInstance key={`post-${keyCount}`} post={props.selectedMapPosts} loading={loading} me={data} />);
            }
            props.setIsSelectedPaneOpen(true);
        }
        
    }, [props.selectedMapPosts, data, props.mainPostData])
    return selectedPosts;
}

export default SelectedPosts;