'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import Tweet from '../models/Tweet';
module.exports = {
    index: function index(req, res) {
        // res.render('index');
        // Tweet.getTweets(0, function(tweets) {
        //     res.send(tweets);
        // });
        res.render('index', {
            tweets: tweets
        });
    }
};
//# sourceMappingURL=routes.js.map