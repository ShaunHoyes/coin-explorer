var Profile = require("./profile.js");
var renderer = require("./renderer.js");
var querystring = require("querystring");
var commonHeaders = {'Content-Type': 'text/html'};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
};

function home(request, response) {
  if(request.url === "/") {
    if(request.method.toLowerCase() === "get") {
      response.writeHead(200, commonHeaders);
      renderer.view("header", {}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    } else {
      request.on("data", function(postBody) {
        var query = querystring.parse(postBody.toString());
        response.writeHead(303, {"Location": "/" + query.coin});
        response.end();
      });

    }
  }

}

function user(request, response) {
  var coin = request.url.replace("/", "");
  if(coin.length > 0) {
    response.writeHead(200, commonHeaders);
    renderer.view("header", {}, response);

    var coinProfile = new Profile(coin);
    coinProfile.on("end", function(profileJSON) {
      var values = {
        coin: profileJSON[0].name,
        rank: profileJSON[0].rank,
        price_usd: profileJSON[0].price_usd,
        price_btc: profileJSON[0].price_btc,
        price_satoshi: numberWithCommas(profileJSON[0].price_btc * 100000000),
        market_cap_usd: numberWithCommas(profileJSON[0].market_cap_usd),
        total_supply: numberWithCommas(profileJSON[0].total_supply)
        // javascriptPoints: profileJSON.points.JavaScript
      }
      // Simple response
      renderer.view("profile", values, response);
      renderer.view("footer", {}, response);
      response.end();
    });

    //on "error"
    coinProfile.on("error", function(error) {
      // show error
      renderer.view("error", {errorMessage: error.message}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    });

  }

}

module.exports.home = home;
module.exports.user = user;
