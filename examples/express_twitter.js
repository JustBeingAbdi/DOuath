

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