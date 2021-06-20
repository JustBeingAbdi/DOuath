

// Discord Example


let express = require("express");
let DiscordClient = require("ouath-clients");
let client = new DiscordClient('ClientId', 'ClientSecret');


client.setScopes("identify");
client.setScopes("guilds");



let app = express();

app.get("/authorize", async(req,res) => {
    let ouath = await client.GenerateURL("https://example.com/callback");
    res.redirect(ouath);
});


app.get("/callback", async(req,res) => {
    let code = req.query.code;
    let data = await client.GetData(code);
    // Your own code after

    res.redirect("/");
});


app.listen(3000);