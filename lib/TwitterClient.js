/**
 * @copyright MIT Licence Copyright (c) 2021 Abdi Hassan
 */


let axios = require("axios");
let jwt = require("jsonwebtoken");
let srs = require("secure-random-string");
let fetch = require("node-fetch");
const FormData = require('form-data');


/**
 * @class TwitterClient
 * @description Twitter Ouath provider
 */

class TwitterClient {



    /**
     * @constructor oauth_consumer_key & oauth_consumer_secret (https://developer.twitter.com/en/docs/basics/apps/overview)
     * @param {string} oauth_consumer_key Twitter App Key
     * @param {string} oauth_consumer_secret Twitter App Secret
     */


    constructor(oauth_consumer_key, oauth_consumer_secret) {
        this._id = oauth_consumer_key
        this._secret = oauth_consumer_secret
        this._baseURL = `https://api.twitter.com`,
        this._baseAuthURL = `https://api.twitter.com/oauth/authorize`
        this.redirectURL = ''
    }

  

   

    /**
     * 
     * @param {string} redirectURI Redirect Url after successfull Authorization
     * @param {String} login_hint Email adress or sub identifier for hint for the Google Authentication Server (https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#oauth-2.0-endpoints)
     */
    

    async generateUrl(redirectURI) {
        if(typeof redirectURI !== string) throw Error("RedirectUri is not a string..");

        if(!redirectURI) {
            if(this.redirectURL) redirectURI = this.redirectURL
            else throw Error("Please Provide a Redirect Url");
        }
        this.redirectURL = redirectURI;
let encodedurl = encodeURI(this.redirectURL);
        let req = await axios.default({
            method: 'post',
            url: `${this._baseURL}/ouath/request_token`,
            headers: {
                Authorization: `OAuth oauth_nonce="${srs({length:30})}", oauth_callback="${encodedurl}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${new Date().getMilliseconds()}", oauth_consumer_key="${this._id}", oauth_signature="Pc%2BMLdv028fxCErFyi8KXFM%2BddU%3D", oauth_version="1.0"`
            }
        });


        



        return `${this._baseAuthURL}?oauth_token=${req.data.ouath_token}`;
    }


    /**
     * @param {string} ouath_token Ouath_Token from successfull authorization.
     * @param {string} ouath_verifier Ouath-Verifier from successfull authorization.
     */

     async getToken(ouath_token, ouath_verifier) {
         let req = await axios.default({
             method: 'post',
             url: `${this._baseURL}/oauth/access_token?oauth_token=${ouath_token}&oauth_verifier=${ouath_verifier}`

         });



         let returnobject = {
             oauth_token:req.data.ouath_token || null,
             oauth_token_secret:req.data.oauth_token_secret || null,
             user_id:req.data.user_id || null,
             screen_name:req.data.screen_name || null,
         }


         return returnobject;



         



         
     }
    




}

module.exports = TwitterClient