/**
 * @copyright MIT Licence Copyright (c) 2021 Abdi Hassan
 */


let axios = require("axios");
let jwt = require("jsonwebtoken");
let srs = require("secure-random-string");



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
   * @param {Strin | Array} scopes Discord Scopes (https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes)
   */

   async setScopes(...scopes) {
         if (scopes.length < 1) throw new Error('No scopes were provided.');
    if (Array.isArray(scopes[0])) scopes = scopes.flat();

    this.scopes.push(scopes);


    return this;
        

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
      * @returns {string} Key for Requests for special data.
     */


    async GetData(code) {
        if(typeof code !== 'string') throw new Error(`"Code" hasn't been provided.`);

        let request = await axios.default({
            method: 'POST',
            url: `${this._baseURL}/ouath2/token`,
            data: {
                client_id: this._id,
            client_secret: this._secret,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: this.redirectURI,
            }
        });

        if(!request.data.access_token) return new Error("Invalid Information was filled");

        let access_token = request.data.access_token
        let key = await jwt.sign(access_token, this._secret);
let user;
let connections;
let guilds;

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
            user: {},

            connections: [],
            guild: []

            
        }
        if(user) returnobject.user = user;
        if(connections) returnobject.connections = connections
        if(guilds) returnobject.guilds = guilds



        return returnobject
        
    }


    /**
     * 
     * @param {string} key A JWT Key for access to Strict Data
     * 
     * @returns {object} Discord User Object w/o Email
     */
    async getUserData(key) {
        let access_token = jwt.decode(key);
        let request = await axios.default({
            method: 'get',
            headers: {
                'Authorization': `Bearer ${key}`
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
    let access_token = jwt.decode(key);
        let request = await axios.default({
            method: 'get',
            headers: {
                'Authorization': `Bearer ${key}`
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
    let access_token = jwt.decode(key);
        let request = await axios.default({
            method: 'get',
            headers: {
                'Authorization': `Bearer ${key}`
            },
            url: `${this._baseURL}/users/@me/guilds`
        });

        return request.data;
}

}



module.exports = DiscordClient