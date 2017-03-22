var EventEmitter = require("events").EventEmitter;
var https = require("https");
var http = require("http");
var util = require("util");

/**
 * @param coin
 * @constructor
 */
function Profile(coin) {

    EventEmitter.call(this);

    var profileEmitter = this;

    var request = https.get("https://api.coinmarketcap.com/v1/ticker/" + coin + "/", function(response) {
        var body = "";

        if (response.statusCode !== 200) {
            request.abort();
            profileEmitter.emit("error", new Error("There was an error getting the profile for " + coin + ". (" + http.STATUS_CODES[response.statusCode] + ")"));
        }

        response.on('data', function (chunk) {
            body += chunk;
            profileEmitter.emit("data", chunk);
        });

        response.on('end', function () {
            if(response.statusCode === 200) {
                try {
                    var profile = JSON.parse(body);
                    profileEmitter.emit("end", profile);
                } catch (error) {
                    profileEmitter.emit("error", error);
                }
            }
        }).on("error", function(error){
            profileEmitter.emit("error", error);
        });
    });
}

util.inherits( Profile, EventEmitter );

module.exports = Profile;
