'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (elastic_client, io, tweet) {
    if (!elastic_client) {
        return;
    }

    // let tweets1 = require('../finaltweets1.json');
    // console.log(tweets1.length);
    // fs.readFile('./finaltweets1.json', 'utf8', function (err, data) {
    //     if (err) throw err; // we'll not consider error handling for now
    //     var obj = JSON.parse(data);
    //     console.log(obj.length);
    // });

    //index the passed tweet
    if (Object.keys(tweet).length > 0) {
        elastic_client.index({
            index: 'tweets',
            type: 'tweet',
            body: tweet
        }, function (err, resp, status) {
            console.log(resp);
        });
    }

    // Check how many there inside.
    // elastic_client.count({index: 'tweets',type: 'tweet'},function(err,resp,status) {  
    //     console.log("tweets",resp);
    // });

    // Run a search , emit to client side
    // elastic_client.search({
    //     index: 'tweets',
    //     type: 'tweet',
    //     body: {
    //         query: {
    //             // term: { "constituencyname": "Harwich" }
    //             // "range" : {
    //             //     "Date" : {
    //             //         "gte" : '2016-04-16',
    //             //         "lt" : '2016-05-16'
    //             //     }
    //             // },
    //             "term" : { "Tweet content" : "today" }
    //         },
    //     }
    // },function (error, response,status) {
    //     if (error){
    //         console.log("search error: "+error)
    //     }
    //     else {
    //         console.log("--- Response ---");
    //         console.log(response);
    //         console.log("--- Hits ---");
    //         response.hits.hits.forEach(function(hit){
    //             //send to client
    //             io.emit('tweet', hit._source);
    //             console.log(hit._source);
    //         });
    //     }
    // });

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
//# sourceMappingURL=elasticHandler.js.map