import fs from 'fs';
module.exports = {
    ESSearch
};

function ESSearch(elastic_client, io, search_term, callback) {
    if(!elastic_client) {
        return;
    }

    // Run a search , emit to client side
    let search_query = {};
    search_term = search_term.toLowerCase();
    if (search_term === '') {
        search_query.match_all = {};
    } else {
        search_query.term = { "body" : search_term };
    }
    console.log('search query', search_query);
    elastic_client.search({
        index: 'tweets',
        type: 'tweet',
        body: {
            query: search_query,
            size: 100
        }
    },function (error, response,status) {
        if (error){
            console.log("search error: "+error);
        }
        else {
            let tweets = [];
            console.log("--- Response ---");
            console.log(response);
            console.log("--- Hits ---");
            response.hits.hits.forEach(function(hit){
                //send to client
                // io.emit('tweet', hit._source);
                // console.log(hit._source);
                tweets.push(hit._source);
            });
            callback(tweets);
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
