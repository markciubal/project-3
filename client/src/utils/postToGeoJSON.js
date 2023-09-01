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
        return new GeoJSON({
            featureProjection: "EPSG:3857",
          }).readFeatures(geoJSON);
}

export default postToGeoJSON;
