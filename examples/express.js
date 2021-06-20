

// Discord Example


let express = require("express");
let DiscordClient = require("../lib/DiscordClient");
let client = new DiscordClient('830400250014466048', '_TdVPLeUbXjS4Zgm1B1DwDiUMLFXWsUd');



client.setScopes("guilds");



let app = express();

app.get("/authorize", async(req,res) => {
    let ouath = await client.GenerateURL("https://3000-aqua-hamster-tp01u5bc.ws-eu09.gitpod.io/callback");
    res.redirect(ouath);
});


app.get("/callback", async(req,res) => {
    let code = req.query.code;
    let data = await client.GetData(code);
    
    res.redirect("/");
});


app.listen(3000);