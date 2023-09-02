import GeoJSON from "ol/format/GeoJSON";

const postToGeoJSON = (posts) => {
    posts = posts.posts;
        let geoJSON = {
            "type": "FeatureCollection",
            "metadata": {
            "title": "PinPoint Posts",
            },
            "features": []
        };
        console.log(geoJSON);
        posts.forEach(function (post) {
            geoJSON.features.push({
                "type": "Feature", 
                "properties": {
                    "id": post._id,
                    "cluster": false,
                    "body": post.body,
                    "time": post.createdAt,
                    
                },
                "geometry" : {
                    "type": "Point",
                    "coordinates": [
                        post.longitude,
                        post.latitude
                    ]
                }
            })
        });
        
        console.log(geoJSON);
        return geoJSON;
}

export default postToGeoJSON;