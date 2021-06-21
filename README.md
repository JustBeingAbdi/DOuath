# Ouath Clients


## Introduction

Ouath Client is a Multi Ouath Provider which helps you access the different ouath apis faster and more easier.

Current Ouath Clients offer Discord and Google but more will come like Twitter etc..



## Examples

```javascript



// Discord Example

let express = require("express");
let Clients = require("ouath-clients");
let client = new Clients.Discord('ClientID', 'ClientSecret');


client.setScopes("identify");
client.setScopes("guilds");



let app = express();

app.get("/authorize", async(req,res) => {
    let ouath = await client.GenerateURL("https://example.com/callback");
    res.redirect(ouath);
});


app.get("/callback", async(req,res) => {
    let code = req.query.code;
    let data = await client.getData(code);
    // Your own code after

    res.redirect("/");
});




app.listen(3000);




// Google Example

let express = require("express");
let Clients = require("ouath-clients");
let client = new Clients.Google('ApiKey', 'ApiSecret');

client.setScopes("https://www.googleapis.com/oauth2/v1/userinfo");



let app = express();

app.get("/authorize", async(req,res) => {
    let ouath = await client.GenerateURL("https://example.com/callback");
    res.redirect(ouath);
});


app.get("/callback", async(req,res) => {
    let code = req.query.code;
    let data = await client.getData(code);
    // Your own code after

    res.redirect("/");
});





app.listen(3000);


// Facebook/Instagram Example

let express = require("express");
let Clients = require("ouath-clients");
let client = new Clients.Facebook('ClientID', 'ClientSecret');


client.setScopes(["email", "public_profile"]);



let app = express();

app.get("/authorize", async(req,res) => {
    let ouath = await client.GenerateURL("https://example.com/callback");
    res.redirect(ouath);
});


app.get("/callback", async(req,res) => {
    let code = req.query.code;
    let data = await client.getData(code);
    // Your own code after

    res.redirect("/");
});




app.listen(3000);


// Twitter Example

let express = require("express");
let Clients = require("ouath-clients");
let client = new Clients.Twitter('oauth_consumer_key', 'oauth_consumer_secret');





let app = express();

app.get("/authorize", async(req,res) => {
    let ouath = await client.GenerateURL("https://example.com/callback");
    res.redirect(ouath);
});


app.get("/callback", async(req,res) => {
    let ouath_token = req.query.ouath_token;
    let ouath_verifier = req.query.ouath_verifier
    let data = await client.getToken(ouath_token, ouath_verifier);
    // Your own code after

    res.redirect("/");
});




app.listen(3000);


```
