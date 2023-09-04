const postToGeoJSON = (posts) => {
    posts = posts.posts;
        let geoJSON = {
            "type": "FeatureCollection",
            "metadata": {
            "title": "PinPoint Posts",
            },
            "features": []
        };

        posts.forEach(function (post) {
            geoJSON.features.push({
                "type": "Feature", 
                "properties": {
                    "id": post._id,
                    "user": post.user.username,
                    "userId": post.user._id,
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
        
        return geoJSON;
}

export default postToGeoJSON;
