/**
 * @copyright MIT Licence Copyright (c) 2021 Abdi Hassan
 */


let axios = require("axios");
let jwt = require("jsonwebtoken");
let srs = require("secure-random-string");
let fetch = require("node-fetch");
const FormData = require('form-data');


/**
 * @class GoogleClient
 * @description Google Ouath provider
 */

class GoogleClient {



    /**
     * @constructor Id & Secret (https://console.developers.google.com/apis/credentials)
     * @param {string} clientID Google Client id
     * @param {string} clientSecret Google Client Secret
     */


    constructor(clientID, clientSecret) {
        this._id = clientID
        this._secret = clientSecret
        this._baseURL = `https://www.googleapis.com`,
        this._baseAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this._id}&response_type=token&prompt=consent`
        this.scopes = [];
        this.redirectURL = ''
    }

  /**
   * 
   * @param {String | Array} scope Google Scopes (https://developers.google.com/identity/protocols/oauth2/scopes)
   */

   async setScopes(scope) {
         if(!scope || typeof scope !== String && Array) throw Error("Please Write the scope in a string or array");
         if(typeof scope === string){
             return this.scopes.push(scope);
         } else if(typeof scope === Array){
             
            return scope.forEach(x => this.scopes.push(x));
         }
         else {
             throw Error("Unable to set scope. Please Try again or Contact the Devs");
         }
        

    }

    /**
     * 
     * @param {string} redirectURI Redirect Url after successfull Authorization
     * @param {String} login_hint Email adress or sub identifier for hint for the Google Authentication Server (https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#oauth-2.0-endpoints)
     */
    

    async generateUrl(redirectURI, login_hint = null) {
        if(typeof redirectURI !== string) throw Error("RedirectUri is not a string..");

        if(!redirectURI) {
            if(this.redirectURL) redirectURI = this.redirectURL
            else throw Error("Please Provide a Redirect Url");
        }
        this.redirectURL = redirectURI;



        return `${this._baseAuthURL}&redirect_uri=${this.redirectURL}&scope=${!this.scopes ? 'profile' : this.scopes.map(x=>x).join("%20")}${!login_hint ? '' : `&login_hint=${login_hint}`}`
    }


    /**
     * @param {string} code Access_Token
     */

     async getData(code) {
         let returnobject = []

        this.scopes.forEach(async(x) => {
            let request = await axios.default({
             method: 'get',
             url: x + '?alt=json',
             headers: {
                 'Authorization': 'Bearer ' + code
             }
         });
        



         returnobject.push(request.data);
        });


        return returnobject
         



         
     }
    




}

module.exports = GoogleClient