require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var moment = require ('moment');
var request = require ('request');
var inquirer = require ('inquirer');
var fs = require ('fs');

var cmd = ""; 
var userArg = "";

function makeChoice() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'cmd',
          message: 'Please choose 1 of 4 tasks for Liri-bot to accomplish.',
          choices: ['do-what-it-says', 'concert-this', 'spotify-this-song', 'movie-this']
        }
      ])
      .then(answers => {
        cmd = answers.cmd;
        cmdSwitch();
      });
    }


    function iqConcertThis() {
        if (userArg === "") {
            inquirer
            .prompt([
                {
                type: 'input',
                name: 'userArg',
                message: 'Please provide Liri-bot with the artist(s) you would like to look-up: '
                }
            ])
            .then(answers => {
                userArg = answers.userArg;
                concertThis();
            });
        } else {
            concertThis();
        }
    }


    function concertThis() {
      
        var queryURL = "https://rest.bandsintown.com/artists/" + userArg + "/events?app_id=codingbootcamp"
    
        request(queryURL, function(err, res, body) {
            
          if (!err && res.statusCode === 200) {
        
           
             var obj = JSON.parse(body);
        
            
                console.log(" ");
                console.log("Here are some upcoming events involving: " + userArg)
                console.log("--------------------------------------------------");
    
                var text = "\nHere are some upcoming events involving: " + userArg + "\n--------------------------------------------------"
                fs.appendFile("log.txt", text, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
        
                for (let i = 0; i < obj.length; i++) {
        
                    var showDate = moment(obj[i].datetime).format('L');
        
                    console.log(" ");
                    console.log("Venue: " + obj[i].venue.name);
                    console.log("Location: " + obj[i].venue.city + " " + obj[i].venue.region);
                    console.log("Date: " + showDate);
                    console.log("-----------------------");
    
                  
                    var text = "\nVenue: " + obj[i].venue.name + "\nLocation: " + obj[i].venue.city + " " + obj[i].venue.region + "\nDate: " + showDate + "\n-----------------------"
                    fs.appendFile("log.txt", text, function(err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        });
    } 
 
    function iqSpotifyThisSong() {
        
        if (userArg === "") {
            inquirer
            .prompt([
                {
                type: 'input',
                name: 'userArg',
                message: 'Please provide Liri-bot with the song that you would like to look-up: '
                }
            ])
            .then(answers => {
                userArg = answers.userArg;
                spotifyThisSong();
            });
        } else {
            spotifyThisSong();
        }
    } 
    function spotifyThisSong() {
    
        if (userArg === undefined) {
            userArg = "Ace of Base The Sign";
        }
    
        var spotify = new Spotify({
            id: keys.spotify.id,
            secret: keys.spotify.secret
            });
            spotify.search({ type: 'track', query: userArg}, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var artistInfo = data.tracks.items[0].artists;
            var songTitle = data.tracks.items[0].name;
            var extLink = data.tracks.items[0].external_urls.spotify;
            var albumName = data.tracks.items[0].album.name;
            console.log(" ");
            console.log("Spotify-ing the song: " + songTitle)
            console.log("--------------------------------------------------");
            console.log("Artist(s): " + artistInfo[0].name);
            console.log("Song Title: " + songTitle);
            console.log("Click link to listen! " + extLink);
            console.log("Album name: " + albumName);
            console.log("--------------------------------------------------");
    
                
                var text = "\nSpotify-ing the song: " + songTitle + "\n--------------------------------------------------\nArtist(s): " + artistInfo[0].name + "\nSong Title: " + songTitle + "\nClick link to listen! " + extLink + "\nAlbum name: " + albumName + "\n--------------------------------------------------";
                fs.appendFile("log.txt", text, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
    
            });
    
    
    } 
    function iqMovieThis() {
        
        if (userArg === "") {
            inquirer
            .prompt([
                {
                type: 'input',
                name: 'userArg',
                message: 'Please provide Liri-bot with the movie that you would like to look-up: '
                }
            ])
            .then(answers => {
                userArg = answers.userArg;
                movieThis();
            });
        } else {
            movieThis();
        }
    } 
    function movieThis() {
    
        if (userArg === undefined) {
            userArg = "Mr. Nobody";
        }
    
        var queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + userArg
        request(queryURL, function(err, res, body) {

          if (!err && res.statusCode === 200) {
        
            var obj = JSON.parse(body);
    
            console.log(" ");
            console.log("Below is information about the movie: " + obj.Title);
            console.log("-----------------------");
            console.log("Title: " + obj.Title);
            console.log("Year of Release: " + obj.Year);
    
            
            var text = "\nBelow is information about the movie: " + obj.Title + "\n-----------------------\nTitle: " + obj.Title + "\nYear of Release: " + obj.Year;
            fs.appendFile("log.txt", text, function(err) {
                if (err) {
                    console.log(err);
                }
            });
    
            for (let i = 0; i < obj.Ratings.length; i++) {
                console.log(obj.Ratings[i].Source + ": " + obj.Ratings[i].Value);
            }
    
            console.log("Country of Origin: " + obj.Country);
            console.log("Language: " + obj.Language);
            console.log("-----------------------");
            console.log("Plot Summary: " + obj.Plot);
            console.log("Actors: " + obj.Actors);
            console.log("-----------------------");
    
            var text = "\nCountry of Origin: " + obj.Country + "\nLanguage: " + obj.Language + "\n-----------------------\nPlot Summary: " + obj.Plot + "\nActors: " + obj.Actors + "\n-----------------------";
            fs.appendFile("log.txt", text, function(err) {
                if (err) {
                    console.log(err);
                }
            });
    
            }  
        });
    }
    
  
    function doWhatItSays() {
       fs.readFile("random.txt", "utf8", function(err, data) {
            if (err) {
              return console.log(err);
            }
        
           
            var randomArr = data.split(",");
    
            
            inquirer
                .prompt([
                    {
                    type: 'list',
                    name: 'userChoice',
                    message: 'Please choose from this list what you would like Liri-bot to accomplish: ',
                    choices: randomArr
                    }
                ])
                .then(answers => {
                    var userChoice = answers.userChoice;
                    var userChoiceArr = userChoice.split(":");
                    cmd = userChoiceArr[0].trim(" ");
                    userArg = userChoiceArr[1].trim(" ");
                    cmdSwitch();
                });
          
        });
    } 
    
    function cmdSwitch() {
        switch(cmd) {
            case "concert-this":
                iqConcertThis();
                break;
            case "spotify-this-song":
                iqSpotifyThisSong();
                break;
            case "movie-this":
                iqMovieThis();
                break;
            case "do-what-it-says":
                doWhatItSays();
                break;
        }
    } 
    makeAChoice(); 