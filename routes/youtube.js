/**
 * Created by n8reddi on 6/28/17.
 */

var express = require('express');
var router = express.Router();

/*
router.get('/', function(req, res, next){

    search('deadmau5', opts, function(err, results) {
        if(err) return console.log(err);

        console.dir(results);
    });
    res.json()
})
*/
// search the results from the eventbrite query
let search = require('youtube-search');
let opts = {
    maxResults: 5,
    key: 'AIzaSyA8PZxKXoeZx8XOiD_uOjS0hBRrjjbePls'
};
search(events, opts, function(err, results) {
    if(err) return console.log('err', err)
    console.log(results.forEach(function(link) {console.log(link.link)}));
});

module.exports = router;