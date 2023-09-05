import {useEffect, useState, useRef} from 'react';
import SelectedPosts from "./SelectedPosts";
import postToGeoJSON from "../utils/postToGeoJSON";
import { GET_HISTORY } from '../utils/queries';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';

const History = (props) => {
    const { loading, error, data } = useQuery(GET_HISTORY);
    const [historyPosts, setHistoryPosts] = useState([]);
    const [hasPosts, setHasPosts] = useState(false);
    useEffect(() => {
        if (!loading && data) {
            console.log(data);
            
            try {
                const jsonData = postToGeoJSON(data).features;
                console.log(jsonData);
                
                if (jsonData && jsonData.length > 0) {
                    setHistoryPosts(jsonData);
                } else {
                    console.warn("Transformed data is empty or not an array");
                }
            } catch (err) {
                console.error("Error transforming data: ", err);
            }
        }
    }, [loading, data]);

    return (
        <>{ historyPosts.length > 0 && 
            <SelectedPosts
                update={props.update}
                setEditUser={props.setEditUser}
                setEditPostId={props.setEditPostId}
                setEditPostBody={props.setEditPostBody}
                selectedMapPosts={historyPosts}
                setSelectedMapPosts={props.selectedMapPosts}
                setIsSelectedPaneOpen={props.setIsSelectedPaneOpen}
                isSelectedPaneOpen={props.isSelectedPaneOpen}
                setIsPostPaneOpen={props.setIsPostPaneOpen}
                setIsEditMode={props.setIsEditMode}
                setIsHistoryPaneOpen={props.setIsHistoryPaneOpen}
                setViewport={props.setViewport}
            /> 
        }</>
    );
}

export default History;