import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
// import twitter from 'ntwitter'; //old twitter node pkg..
import Twitter from 'twitter';

import config from './config';
import routes from './routes';
import streamHandler from './streamHandler';
import elasticHandler from './elasticHandler';

// import _ from 'lodash';
import swig from 'swig';
import elasticsearch from 'elasticsearch';
import fs from 'fs';

//Express instance constant
const app = express();
const port = process.env.PORT || 8080;
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

//connecting to mongoDB
// mongoose.connect('mongodb://localhost/react-tweets');

const twit = new Twitter(config.twitter2);
let stream = null;
//Mininal route handling.. Callback function is stored in routes
app.get('/', routes.index);
//setting location of static files, app has access now
// console.log(__dirname);
app.use('/', express.static(__dirname + "../public/"));

//start server, its running
const server = app.listen(port);

const io = require('socket.io').listen(server);
io.on('connection', function (socket) {
    socket.emit('server connected');
    socket.on('start stream', function (data) {
        elasticHandler(elastic_client, io, {});
        if (stream === null) {
            // runStream();
        }
    });
});

//define stream api, bounding box, handler to process it and store in DB, etc
let runStream = () => {
    console.log('stream running again');
    twit.stream('statuses/filter', config.stream.words, function(s) {
        stream = s;
        stream.on('limit', function(limitMessage) {
            return console.log(limitMessage);
        });
        stream.on('end', (response) => {
            setTimeout(runStream, 5000);
        });
        stream.on('error', function(error) {
            console.log(error);
            stream.destroy();
            setTimeout(runStream, 5000);
        });
        stream.on('destroy', (response) => {
            console.log('silently destroyed connection');
        });
        stream.on('warning', function(warning) {
            return console.log(warning);
        });
        stream.on('disconnect', function(disconnectMessage) {
            return console.log(disconnectMessage);
        });
        streamHandler(stream, io); //handles data
    });
};

//start it
//runStream();

//Elastic Search Code
const elastic_client = new elasticsearch.Client({
    hosts: [
        {
            protocol: 'https',
            host: config.es.host,
            port: 443
        },
        {
            host: 'localhost',
            port: 9200
        }
    ]
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