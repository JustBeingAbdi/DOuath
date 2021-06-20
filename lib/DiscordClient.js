/**
 * @copyright MIT Licence Copyright (c) 2021 Abdi Hassan
 */


let axios = require("axios");
let jwt = require("jsonwebtoken");
let srs = require("secure-random-string");
let fetch = require("node-fetch");
const FormData = require('form-data');


/**
 * @class DiscordClient
 * @description Discord Ouath provider
 */

class DiscordClient {



    /**
     * 
     * @param {string} clientID Discord Application Client id
     * @param {string} clientSecret Discord Application Client Secret
     */


    constructor(clientID, clientSecret) {
        this._id = clientID
        this._secret = clientSecret
        this._baseURL = `https://discord.com/api/v8`,
        this._baseAuthURL = `https://discord.com/api/oauth2/authorize?client_id=${clientID}&response_type=code`
        this.scopes = [];
        this.redirectURL = ''
    }

  /**
   * 
   * @param {String} scopes Discord Scopes (https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes)
   */

   async setScopes(scopes) {
         this.scopes.push(scopes)
        

    }



   async GenerateURL(redirectURL) {
       let redirecturl = redirectURL || null
       if(!redirectURL){
           if(!this.redirectURL) throw Error("Invalid Redirect URL");
           else {
               redirecturl = this.redirectURL
           }
       }
       let state = jwt.sign(srs({length:40}), this._secret);


       this.redirectURL = redirecturl
       
       
       let redirect = `${this._baseAuthURL}&redirect_uri=${redirecturl}&state=${state}&scope=${!this.scopes ? 'identify' : this.scopes.map(x=>x).join("%20")}`;



       return redirect
        
    }


    /**
      * @param {string} code The authorization code returned by discord.
      * @returns {object} Key for Requests for special data.
     */


    async GetData(code) {
        if(typeof code !== 'string') throw new Error(`"Code" hasn't been provided.`);

        const data = new FormData();
    data.append('client_id', this._id);
    data.append('client_secret', this._secret);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', this.redirectURL);
    data.append('code', code);
    fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: data
    })
    .then(res => res.json())
    .then(async(request) => {

        if(!request.access_token) return new Error("Invalid Information was filled");

        let access_token = request.access_token
        let key = access_token
let user;
let guilds;
let connections;

        if(this.scopes.includes('identify') || this.scopes.includes('email')) {
            user = await this.getUserData(key);
        }
        if(this.scopes.includes("connections")) {
            connections = await this.getConnectiondata(key);
        }
        if(this.scopes.includes("guilds")) {
            guilds = await this.getGuildData(key);
        }
        

        let returnobject = {
            access_token: access_token,
            user: user || null,
            guilds: guilds || null,
            connections: connections || null
            
        }
        
        



        return returnobject
    })
    }


    /**
     * 
     * @param {string} key A JWT Key for access to Strict Data
     * 
     * @returns {object} Discord User Object w/o Email
     */
    async getUserData(key) {
        let access_token = key
        let request = await axios.default({
            method: 'get',
            headers: {
                'Authorization': `Bearer ${access_token}`
            },
            url: `${this._baseURL}/users/@me`
        });

        return request.data;
    }
    /**
     * 
     * @param {string} key A JWT Key for access to Strict Data
     * 
     * @returns {object} Discord User Connections Objects
     */
async getConnectiondata(key) {
    let access_token = key
        let request = await axios.default({
            method: 'get',
            headers: {
                'Authorization': `Bearer ${access_token}`
            },
            url: `${this._baseURL}/users/@me/connections`
        });

        return request.data;
}

/**
     * 
     * @param {string} key A JWT Key for access to Strict Data
     * 
     * @returns {object} Discord User Guilds 
     */
async getGuildData(key) {
    let access_token = key
        let request = await axios.default({
            method: 'get',
            headers: {
                'Authorization': `Bearer ${access_token}`
            },
            url: `${this._baseURL}/users/@me/guilds`
        });
        console.log(request.data);

        return request.data;
}

}



module.exports = DiscordClient