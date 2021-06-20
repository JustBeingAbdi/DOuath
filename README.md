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


```
