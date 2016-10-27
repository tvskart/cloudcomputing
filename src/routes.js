//import Tweet from '../models/Tweet';
import React from 'react';
import { render } from 'react-dom';
//DEPRECATED - lol - Not in use
module.exports = {
    index: (req, res) => {
        // res.render('index');
        // Tweet.getTweets(0, function(tweets) {
        //     res.send(tweets);
        // });
        res.render('index', {
            tweets: tweets
        });
    }
};
