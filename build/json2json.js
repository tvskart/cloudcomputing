'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _elasticHandler = require('./elasticHandler');

var _elasticHandler2 = _interopRequireDefault(_elasticHandler);

var _elasticsearch = require('elasticsearch');

var _elasticsearch2 = _interopRequireDefault(_elasticsearch);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var elastic_client = new _elasticsearch2.default.Client({
    hosts: [{
        protocol: 'https',
        host: _config2.default.es.host,
        port: 443
    }
    // ,
    // {
    //     host: 'localhost',
    //     port: 9200
    // }
    ]
});

// elastic_client.count({index: 'tweets',type: 'tweet'},function(err,resp,status) {  
//     console.log("tweets",resp);
// });

// elastic_client.indices.create({
//     index: 'tweets'
// },(err, resp, status) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log('success');
//     // elasticHandler(elastic_client);
// });

//Load json data here, pass it along to client to bulk upload
var bulk_tweets = [];
var tweets_list = [];
var filePath = './finaltweets2.json';
var stream = _fs2.default.createReadStream(filePath, { flags: 'r', encoding: 'utf-8' });
var buf = '';
var flag = true;
stream.on('data', function (d) {
    buf += d.toString(); // when data is read, stash it in a string buffer
    pump(); // then process the buffer
    if (count > 100 && flag) {
        flag = false;
        pushElastic();
    }
});

function pump() {
    var pos;

    while ((pos = buf.indexOf('\n')) >= 0) {
        // keep going while there's a newline somewhere in the buffer
        if (pos == 0) {
            // if there's more than one newline in a row, the buffer will now start with a newline
            buf = buf.slice(1); // discard it
            continue; // so that the next iteration will start with data
        }
        processLine(buf.slice(0, pos)); // hand off the line
        buf = buf.slice(pos + 1); // and slice the processed data off the buffer
    }
}

function processLine(line) {
    // here's where we do something with a line

    if (line[line.length - 1] == '\r') line = line.substr(0, line.length - 1); // discard CR (0x0D)

    if (line.length > 0) {
        // ignore empty lines
        var obj = JSON.parse(line); // parse the JSON
        // console.log(obj); // do something with the data here!
        publish(obj);
    }
}

var count = 0;
function publish(data) {
    var tweet = {
        author: _lodash2.default.get(data, 'user.name'),
        avatar: _lodash2.default.get(data, 'user.profile_image_url'),
        body: _lodash2.default.get(data, 'text'),
        date: _lodash2.default.get(data, 'created_at'),
        screenname: _lodash2.default.get(data, 'user.screen_name'),
        favs: _lodash2.default.get(data, 'favorite_count'),
        retweets: _lodash2.default.get(data, 'retweet_count'),
        loc_name: _lodash2.default.get(data, 'place.full_name'),
        loc_lat: _lodash2.default.get(data, 'coordinates.coordinates[1]') || _lodash2.default.get(data, 'geo.coordinates[0]'),
        loc_lon: _lodash2.default.get(data, 'coordinates.coordinates[0]') || _lodash2.default.get(data, 'geo.coordinates[1]')
    };
    // console.log(tweet);

    if (tweet.loc_lat && tweet.loc_lon) {
        // console.log(tweet);
        count += 1;
        // console.log(count, tweet);
        tweets_list.push(tweet);
    }
}

function pushElastic() {
    console.log('end', tweets_list.length);

    (function (tweets_list) {
        var i = 0;
        for (var tweet in tweets_list) {
            //tweet is an index. why bro?
            i = i + 1;
            bulk_tweets.push({ index: { _index: 'tweets', _type: 'tweet' } }, tweets_list[tweet]);
        }

        elastic_client.bulk({
            maxRetries: 5,
            index: 'tweets',
            type: 'tweet',
            body: bulk_tweets
        }, function (err, resp, status) {
            if (err) {
                console.log(err);
            } else {
                console.log('this many indices added - ', resp.items.length);
            }
        });
    })(tweets_list);
    tweets_list = [];
    bulk_tweets = [];
}
//# sourceMappingURL=json2json.js.map