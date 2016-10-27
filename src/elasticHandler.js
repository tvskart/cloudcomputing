module.exports = function(elastic_client, io, tweet) {
    if(!elastic_client) {
        return;
    }

    //index the passed tweet
    // if (Object.keys(tweet).length > 0) {
    //     elastic_client.index({  
    //         index: 'tweets',
    //         type: 'tweet',
    //         body: tweet
    //     },function(err,resp,status) {
    //         console.log(resp);
    //     });
    // }

    //Check how many there inside.
    // elastic_client.count({index: 'tweets',type: 'tweet'},function(err,resp,status) {  
    //     console.log("tweets",resp);
    // });

    // Run a search , emit to client side
    elastic_client.search({
        index: 'tweets',
        type: 'tweet',
        body: {
            query: {
                // term: { "constituencyname": "Harwich" }
                // "range" : {
                //     "Date" : {
                //         "gte" : '2016-04-16',
                //         "lt" : '2016-05-16'
                //     }
                // },
                "term" : { "Tweet content" : "today" }
            },
        }
    },function (error, response,status) {
        if (error){
            console.log("search error: "+error)
        }
        else {
            console.log("--- Response ---");
            console.log(response);
            console.log("--- Hits ---");
            response.hits.hits.forEach(function(hit){
                //send to client
                io.emit('tweet', hit._source);
                console.log(hit._source);
            });
        }
    });
    
    //Delete indexed tweets
    // for(let i=0;i<22;i++) {
    //     elastic_client.delete({  
    //     index: 'tweets',
    //     id: i,
    //     type: 'tweet'
    //     },function(err,resp,status) {
    //         console.log(resp);
    //         elastic_client.count({index: 'tweets',type: 'tweet'},function(err,resp,status) {  
    //             console.log("tweet",resp);
    //         });
    //     });
    // }
};