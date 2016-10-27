import Tweet from './models/Tweet';
import _ from 'lodash';
import fs from 'fs';

//Handles the twitter stream data, and socket io obj avail
module.exports = function(stream, io) {
    let writableStream = fs.createWriteStream('../tweets.txt');

    stream.on('data',(data) => {
        //tweet obj
        let tweet = {
            author: _.get(data, 'user.name'),
            avatar: _.get(data,'user.profile_image_url'),
            body: _.get(data, 'text'),
            date: _.get(data, 'created_at'),
            screenname: _.get(data, 'user.screen_name'),
            favs: _.get(data,'favorite_count'),
            retweets: _.get(data,'retweet_count'),
            loc_name: _.get(data,'place.full_name'),
            loc_lat: _.get(data,'coordinates.coordinates[1]') || _.get(data,'geo.coordinates[0]'),
            loc_lon: _.get(data,'coordinates.coordinates[0]')|| _.get(data,'geo.coordinates[1]')
        };
        console.log(tweet);
        // if (tweet.loc_lat && tweet.loc_lon) console.log(tweet);

        let tweetEntry = new Tweet(tweet);
        // Save 'er to the database
        tweetEntry.save(function(err) {
            if (!err) {
                // If everything is cool, socket.io emits the tweet.
                console.log('tweet saved');
                //io.broadcast.emit('tweet', tweet);
                io.emit('tweet', tweet);
                //Write to File
                // writableStream.write(tweet.body);
            }
        });
    });
};