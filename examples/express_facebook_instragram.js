

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