require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require('moment');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


let theThirdObj = process.argv[2];
let thirdValue = process.argv[3];
let query0 = process.argv.slice(3).join(" ");



const concertThis = () => {
    axios.get("https://rest.bandsintown.com/artists/" + query0 + "/events?app_id=codingbootcamp").then(
        function (response) {
            console.log("***   Venue: " + response.data[0].venue.name);
            console.log("***   Country: " + response.data[0].venue.country);
            let time = response.data[0].datetime;
            let timeCorrected = moment(time).format("MMMM Do YYYY");
            console.log("***   Time: " + timeCorrected);
        },

        function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        }
    );
};


 const spotifyThisSong = () => {
    //var Spotify = require('node-spotify-api');
    //var spotify = new Spotify(keys.spotify);

    //var spotify = require('spotify');
 
    spotify.search({ type: 'track', query: query0, limit: 1 }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
        let spotifyArr = data.tracks.items[0].album.artists[0].name;
        let name = data.tracks.items[0].name;
        let spotifyLink = data.tracks.items[0].external_urls.spotify;
        let albumName = data.tracks.items[0].album.name;
        console.log("***   Singer: " + spotifyArr);
        console.log("***   Track name: " + name);
        console.log("***   Spotify Link: " + spotifyLink);
        console.log("***   Album: " + albumName);
        return;

    });
}; 



const movieThis = () => {
    var queryUrl = "http://www.omdbapi.com/?t=" + thirdValue + "&plot=short&apikey=2f2e8d81";
    console.log(queryUrl);
    axios.get(queryUrl)

        .then(function (response) {
            //console.log(response.data);
            console.log("*** Title of the movie:" + " " + response.data.Title);
            console.log("*** Year the movie came out:" + " " + response.data.Year);
            console.log("*** IMDB Rating of the movie:" + " " + response.data.Rated);
            console.log("*** Rotten Tomatoes Rating of the movie:" + " " + response.data.Ratings.Value);
            console.log("*** Country where the movie was produced:" + " " + response.data.Country);
            console.log("*** Language of the movie:" + " " + response.data.Language);
            console.log("*** Plot of the movie:" + " " + response.data.Plot);
            console.log("*** Actors in the movie:" + " " + response.data.Actors);
        })
};


const doWhatItSays = () => {
    fs.readFile("random.txt", "utf8", (error, data) => {
        if (error) {
            return console.log(error);
        }
        let dataArr = data.split(",");
        //console.log(dataArr);

        let data0 = dataArr.slice(0).join(" ");
        //console.log(data0);
        if (dataArr[0] === "concert-this") {
            //console.log(dataArr[1]);
            let newValue = dataArr[1].slice(1, dataArr.length);
            //console.log(newValue);
            query0 = newValue;
            concertThis();
        } else if (dataArr[0] === "spotify-this-song") {
            //console.log(dataArr[1]);
            let newValue = dataArr[1].slice(1, dataArr.length);
            //console.log(newValue);
            query0 = newValue;
            spotifyThisSong();
        } else if (dataArr[0] === "movie-this") {
            //console.log(dataArr[1]);
            let newValue = dataArr[1].slice(1, dataArr.length);
            //console.log(newValue);
            thirdValue = newValue;
            movieThis();
        } else{
            console.log(data0);
        }
    })
}







if (theThirdObj === "concert-this") {
    concertThis();
} else if (theThirdObj === "spotify-this-song") {
    spotifyThisSong();
} else if (theThirdObj === "movie-this") {
    movieThis();
} else if (theThirdObj === "do-what-it-says") {
    doWhatItSays();
}


