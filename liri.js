require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);


var liriCommand = process.argv[2];

// Possible commands for this liri app
switch (liriCommand) {
    case "my-tweets": myTweets(); break;
    case "spotify-this-song": spotifyThisSong(); break;
    case "movie-this": movieThis(); break;
    case "do-what-it-says": doWhatItSays(); break;
    // Instructions displayed in terminal to the user
    default: console.log("\r\n" + "Try typing one of the following commands after 'node liri.js' : " + "\r\n" +
        "1. my-tweets 'any twitter name' " + "\r\n" +
        "2. spotify-this-song 'any song name' " + "\r\n" +
        "3. movie-this 'any movie name' " + "\r\n" +
        "4. do-what-it-says." + "\r\n" +
        "Be sure to put the movie or song name in quotation marks if it's more than one word.");
};

// Movie function, uses the Request module to call the OMDB api
function movieThis() {
    var movie = process.argv[3];
    if (!movie) {
        movie = "mr nobody";
    }
    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieObject = JSON.parse(body);
            //console.log(movieObject); // Show the text in command prompt
            var movieResults =
                "* Title: " + movieObject.Title + "\r\n" +
                "* Year: " + movieObject.Year + "\r\n" +
                "* IMDB Rating: " + movieObject.imdbRating + "\r\n" +
                "* Rotten Tomatoes Rating: " + movieObject.tomatoRating + "\r\n" +
                "* Country: " + movieObject.Country + "\r\n" +
                "* Language: " + movieObject.Language + "\r\n" +
                "* Plot: " + movieObject.Plot + "\r\n" +
                "* Actors: " + movieObject.Actors + "\r\n"
            console.log(movieResults);
            log(movieResults);
        } else {
            console.log("Error :" + error);
            return;
        }
    });
};

// Tweet function, uses the Twitter module to call the Twitter api
function myTweets() {
    var client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
    var twitterUsername = process.argv[3];
    if (!twitterUsername) {
        twitterUsername = "efgh8441";
    }
    params = { screen_name: twitterUsername };
    client.get("statuses/user_timeline/", params, function (error, data, response) {
        if (!error) {
            for (var i = 0; i < data.length; i++) {
                //console.log(response); // Show the full response in the terminal
                var twitterResults =
                    "@" + data[i].user.screen_name + ": " +
                    data[i].text + "\r\n" +
                    data[i].created_at + "\r\n" ;
                   
                console.log(twitterResults);
                log(twitterResults); // calling log function
            }
        } else {
            console.log("Error :" + error);
            return;
        }
    });
}

// Spotify function, uses the Spotify module to call the Spotify api
function spotifyThisSong(songName) {
    var songName = songName;
    if (!songName) {
        songName = process.argv[3];
    }
    if (!songName) {
        songName = 'All That She Wants';
    }
    spotify.search({ type: "track", query: songName }, function (err, data) {
        if (!err) {
            var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                        "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                        "Song: " + songInfo[i].name + "\r\n" +
                        "Album the song is from: " + songInfo[i].album.name + "\r\n" +
                        "Preview Url: " + songInfo[i].preview_url + "\r\n";

                    console.log(spotifyResults);
                    log(spotifyResults); // calling log function
                }
            }
        } else {
            console.log("Error :" + err);
            return;
        }
    });
};

// Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error) {
            var doWhatItSaysResults = data.split(",");
            spotifyThisSong(doWhatItSaysResults[1]);
        } else {
            console.log("Error occurred" + error);
        }
    });
};
// Do What It Says function, uses the reads and writes module to access the log.txt file and write everything that returns in command line in the log.txt file
function log(logResults) {
    fs.appendFile("log.txt", logResults, function (error) {
        if (error) {
            return console.log(err);
        }
    });
}