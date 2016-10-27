import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
// schema for tweet obj
var schema = new mongoose.Schema({
    author : 'String',
    avatar: 'String',
    body : 'String',
    date: 'Date',
    screenname: 'String',
    favs: 'Number',
    retweets: 'Number',
    loc_name : 'String',
    loc_lat : 'String',
    loc_lon : 'String',
    active: 'Boolean'
});

//instance method
// schema.methods.toString = function(err, res) {
//   return this.model('Animal').find({ type: this.type }, cb);
// };

//static method
schema.statics.getTweets = function(page, callback) {

  let tweets = [],
      start = (page * 10);

  // Query the db, using skip and limit to achieve page chunks
    Tweet.find({},'screenname body loc_name loc_lat loc_lon'/*,{skip: start, limit: 10}*/).sort({date: 'desc'}).exec().then(function(docs){
        // If everything is cool...
        if(docs) {
            tweets = docs;  // We got tweets
            tweets.forEach(function(tweet){
                tweet.active = true; // Set them to active
            });
        }

        // Pass them back to the specified callback
        callback(tweets);
    });
};

const Tweet = mongoose.model('Tweet', schema);
module.exports = Tweet;