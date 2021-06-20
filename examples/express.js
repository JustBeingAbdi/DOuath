let DiscordClient = require("./lib/DiscordClient");
const inquirer = require("inquirer");


let client = new DiscordClient("840283929336479826", "wpNFXUSaZcKEz6kyClYC1SaL5k9ijTTU");

async function Int() {
   let c = await client.GetData("hEVPcWbhOdYpm9eAeuOst7V4UX25xx");
   console.log(c);
}
Int()

