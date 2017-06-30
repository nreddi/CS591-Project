/**
 * Created by n8reddi on 6/25/17.
 */

const express = require('express')
const router = express.Router()

let events = require('search-eventbrite');

/*router.get('/events', function (req, res, next) {
   events.getAll({
    q: 'Concert',
    'location.address':'Boston',
    sort_by: 'date'
}, function(err,res, events){
    if(err) return console.log('err: ', err)
    console.log('events: ', events.forEach(function(event) {
        console.log(event.name)
    }));
    })
*/


 // Models
 let Search = require('./models/search');
 let User = require('./models/user');

 // Libraries
 let request = require('request');

 // Read config data from file
 var obj = JSON.parse(fs.readFileSync('events.js', 'utf8'));
 var eventbriteToken = obj.eventbrite.token;

 module.exports = function (app) {

 // Search Eventbrite API
 app.get('/api/search', function (req, res) {
 // Get search parameters
 let searchQuery = req.headers.query.toLowerCase().trim();
 let searchLocation = req.headers.location.toLowerCase().trim();
 let searchCategory = req.headers.category.toLowerCase().trim();

 // Create object to save search parameters and results to database
 let searchData = new Search();

 // Get the integer ID of the search category
 let categoryId = searchData.getCategoryId(searchCategory);

 // Check database to see if any previous searches match the current search
 Search.find({
 query: searchQuery,
 location: searchLocation,
 category: searchCategory
 }, function (error, searches) {
 if (error) return console.error(error);
 // Check if any matches in database
 if (searches.length > 0) {
 console.log('Found match');
 // Return the results of that match
 res.send(JSON.parse(searches[0].results));
 } else {
 // There were no matches
 console.log('Searching Eventbrite');

 // HTTP Request to Eventbrite API
 var options = {
 method: 'GET',
 url: 'https://www.eventbriteapi.com/v3/events/search/',
 qs: {
 q: searchQuery,
 sort_by: 'date',
 'location.address': searchLocation,
 categories: categoryId,
 expand: 'venue',
 token: eventbriteToken
 }
 };

 request(options, function (error, response, body) {
 if (error) throw new Error(error);
 // Save search results to database
 searchData.query = searchQuery;
 searchData.location = searchLocation;
 searchData.category = searchCategory;
 searchData.results = JSON.stringify(body);
 searchData.save();

 // Return search results
 res.send(body);
 });
 }
 });
 });

 // HTTP Request to Eventbrite API
 var options = {
 method: 'GET',
 url: 'https://www.eventbriteapi.com/v3/events/search/',
 qs: {
 //q: 'fun',
 sort_by: 'best',
 'location.address': 'Boston',
 //categories: '103',
 'start_date.range_start': searchStart,
 'start_date.range_end': searchEnd,
 expand: 'venue',
 token: eventbriteToken
 }
 };

 request(options, function (error, response, body) {
 if (error) throw new Error(error);
 // Return search results
 res.send(body);
 });


 // frontend routes =========================================================
 // route to handle all angular requests
 app.get('*', function (req, res) {
 res.sendfile('./public/index.html');
 });
 };



/*
 request-promise-lite is a smaller version of the request-promise library. The 'regular' request
 package does not return Promises; several wrapper packages (like RPL) add native
 Promises so that we can chain them.
 The async package provides quite a few methods for managing asynchronous calls. We're
 using async.waterfall here which runs a series of functions in order, passing results
 to each one in turn
 */
//const request = require('request-promise-lite')
//const async = require('async')



module.exports = router;

