const OAuth = require("oauth");

class Twitter {
  constructor(config) {
    this.config = config;
    console.log(this.config);
    console.log(this.config.CONSUMER_KEY);
    this.oauth = new OAuth.OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      this.config.CONSUMER_KEY,
      this.config.CONSUMER_SECRET,
      "1.0A",
      null,
      "HMAC-SHA1"
    );
  }

  tweet(status) {
    const postBody = {
      status: status,
    };

    return new Promise((resolve, reject) => {
      this.oauth.post(
        "https://api.twitter.com/1.1/statuses/update.json",
        this.config.ACCESS_TOKEN, // oauth_token (user access token)
        this.config.ACCESS_TOKEN_SECRET, // oauth_secret (user secret)
        postBody, // post body
        "", // post content type ?
        function (err, data, res) {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(data));
          }
        }
      );
    });
  }
}

module.exports = Twitter;