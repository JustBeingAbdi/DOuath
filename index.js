let DiscordClient = require("./lib/DiscordClient");
let GoogleClient = require("./lib/GoogleClient");
let FacebookClient = require("./lib/FacebookClient");
let TwitterClient = require("./lib/TwitterClient");
let Discord = DiscordClient
let Google = GoogleClient;
let Facebook = FacebookClient;
let Twitter = TwitterClient;

module.exports = Discord, Google, Twitter, Facebook