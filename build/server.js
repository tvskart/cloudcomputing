'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _twitter = require('twitter');

var _twitter2 = _interopRequireDefault(_twitter);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _streamHandler = require('./streamHandler');

var _streamHandler2 = _interopRequireDefault(_streamHandler);

var _elasticHandler = require('./elasticHandler');

var _elasticHandler2 = _interopRequireDefault(_elasticHandler);

var _swig = require('swig');

var _swig2 = _interopRequireDefault(_swig);

var _elasticsearch = require('elasticsearch');

var _elasticsearch2 = _interopRequireDefault(_elasticsearch);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Express instance constant

// import twitter from 'ntwitter'; //old twitter node pkg..
var app = (0, _express2.default)();

// import _ from 'lodash';

var port = process.env.PORT || 8080;
app.engine('html', _swig2.default.renderFile);
app.set('view engine', 'html');

//connecting to mongoDB
// mongoose.connect('mongodb://localhost/react-tweets');

var twit = new _twitter2.default(_config2.default.twitter2);
var stream = null;
//Mininal route handling.. Callback function is stored in routes
app.get('/', _routes2.default.index);
//setting location of static files, app has access now
// console.log(__dirname);
app.use('/', _express2.default.static(__dirname + "../public/"));

//start server, its running
var server = app.listen(port);

var io = require('socket.io').listen(server);
io.on('connection', function (socket) {
    socket.emit('server connected');
    socket.on('start stream', function (data) {
        (0, _elasticHandler2.default)(elastic_client, io, {});
        if (stream === null) {
            // runStream();
        }
    });
});

//define stream api, bounding box, handler to process it and store in DB, etc
var runStream = function runStream() {
    console.log('stream running again');
    twit.stream('statuses/filter', _config2.default.stream.words, function (s) {
        stream = s;
        stream.on('limit', function (limitMessage) {
            return console.log(limitMessage);
        });
        stream.on('end', function (response) {
            setTimeout(runStream, 5000);
        });
        stream.on('error', function (error) {
            console.log(error);
            stream.destroy();
            setTimeout(runStream, 5000);
        });
        stream.on('destroy', function (response) {
            console.log('silently destroyed connection');
        });
        stream.on('warning', function (warning) {
            return console.log(warning);
        });
        stream.on('disconnect', function (disconnectMessage) {
            return console.log(disconnectMessage);
        });
        (0, _streamHandler2.default)(stream, io); //handles data
    });
};

//start it
//runStream();

//Elastic Search Code
var elastic_client = new _elasticsearch2.default.Client({
    hosts: [{
        protocol: 'https',
        host: _config2.default.es.host,
        port: 443
    }, {
        host: 'localhost',
        port: 9200
    }]
});

// elastic_client.cluster.health({},function(err,resp,status) {  
//   console.log("-- Client Health --",resp);
// });
// elastic_client.indices.create({
//     index: 'tweets'
// },(err, resp, status) => {
//     if (err) {
//         console.log(err);
//     }
//     // elasticHandler(elastic_client);
// });

//Load json data here, pass it along to client to bulk upload
// let bulk_tweets = [];
// const tweets_list = require('../tweets.json'); //mind that path yo
// (function(tweets_list){
//     let i = 0;
//     for(let tweet in tweets_list) { //tweet is an index. why bro?
//         i = i+1;
//         bulk_tweets.push(
//             { index: {_index: 'tweets', _type: 'tweet'} },
//             tweets_list[tweet]
//         );
//         if (i > 100) break;
//     }
//     elastic_client.bulk({
//         maxRetries: 5,
//         index: 'tweets',
//         type: 'tweet',
//         body: bulk_tweets
//     },function(err,resp,status) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             console.log('this many indices added - ',resp.items.length);
//         }
//         elasticHandler(elastic_client, io, {});
//     });
// })(tweets_list);
// elasticHandler(elastic_client, io, {});
//# sourceMappingURL=server.js.map