/**
 * @copyright MIT Licence Copyright (c) 2021 Abdi Hassan
 */





let axios = require("axios");
let jwt = require("jsonwebtoken");
let srs = require("secure-random-string");
let fetch = require("node-fetch");
const FormData = require('form-data');
let Google = require("./GoogleClient");


/**
 * @class Facebook/Insta Client
 * @description Facebook/Insta Ouath provider
 */
/**
     * Facebook/Insta Scopes
     */

     let scopes = [
        "ads_management",
         "ads_read",
         "attribution_read",
         "business_management",
         "email",
         "groups_access_member_info",
         "instagram_basic",
         "instagram_content_publish",
         "instagram_manage_comments",
         "instagram_manage_insights",
         "leads_retrieval",
         "pages_events",
         "pages_manage_ads",
         "pages_manage_cta",
         "pages_manage_instant_articles",
         "pages_manage_engagement",
         "pages_manage_posts",
         "pages_manage_metadata",
         "pages_messaging",
         "pages_read_engagement",
         "pages_read_user_content",
         "pages_show_list",
         "pages_user_gender",
         "pages_user_locale",
         "pages_user_timezone",
         "public_profile",
         "publish_to_groups",
         "publish_video",
         "read_insights",
         "user_age_range",
         "user_birthday",
         "user_friends",
         "user_gender",
         "user_hometown",
         "user_likes",
         "user_link",
         "user_location",
         "user_messenger_contact",
         "user_photos",
         "user_posts",
         "user_videos",
         "instagram_graph_user_media",
         "instagram_graph_user_profile",

     ]

class FacebookClient {


    



    /**
     * 
     * @param {string} clientID Facebook Application Client id
     * @param {string} clientSecret Facebook Application Client Secret
     */


    constructor(clientID, clientSecret) {
        this._id = clientID
        this._secret = clientSecret
        this._baseURL = `graph.facebook.com`,
        this._baseAuthURL = `https://www.facebook.com/v11.0/dialog/oauth?client_id=${this._id}&state=${srs({length:30})}&response_type=code`
        this.scopes = [];
        this.redirectURL = ''
    }

  /**
   * 
   * @param {String | Array} scope Facebook/Insta Permissions (https://developers.facebook.com/docs/permissions/reference)
   */

   async setScopes(scope) {
       if(!scope || typeof scope !== String && Array) throw Error("Please Write the scope in a string or array");
         if(typeof scope === string){
             if(!scopes.includes(scope)) throw Error("This Scope is not a valid Facebook Scope (https://developers.facebook.com/docs/permissions/reference)");
            return this.scopes.push(scope);
         } else if(typeof scope === Array){
             if(!scopes.includes(scope.forEach(x))) throw Error("These Scope is not a valid Facebook Scope (https://developers.facebook.com/docs/permissions/reference)")

            return scope.forEach(x => this.scopes.push(x));
         }
         else {
             throw Error("Unable to set scope. Please Try again or Contact the Devs");
         }
        

    }



   async GenerateURL(redirectURL) {
       let redirecturl = redirectURL || null
       if(!redirectURL){
           if(!this.redirectURL) throw Error("Invalid Redirect URL");
           else {
               redirecturl = this.redirectURL
           }
       }
      


       this.redirectURL = redirecturl
       
       
       let redirect = `${this._baseAuthURL}&redirect_uri=${redirecturl}&scope=${!this.scopes ? 'identify' : this.scopes.map(x=>x).join("%20")}`;



       return redirect
        
    }


    /**
      * @param {string} code The authorization code returned by facebook.
      * @returns {object} Key for Requests for special data.
     */


    async getData(code) {
        if(typeof code !== 'string') throw new Error(`"Code" hasn't been provided.`);

        
    fetch(`https://graph.facebook.com/v11.0/oauth/access_token?client_id=${this._id}&client_secret=${this._secret}&redirect_uri=${this.redirectURL}&code=${code}`, {
        method: 'GET',
    })
    .then(res => res.json())
    .then(async(request) => {

        if(!request.access_token) return new Error("Invalid Information was filled");

        let access_token = request.access_token
        let key = access_token
let user;


        if(this.scopes.includes('email') || this.scopes.includes('public_profile')) {
            user = await this.getUserData(key);
        }
        
        

        let returnobject = {
            access_token: access_token,
            user: user || null,
            
        }
        
        



        return returnobject
    })
    }


    /**
     * 
     * @param {string} key A JWT Key for access to Strict Data
     * 
     * @returns {object} Facebook User Object w/o Email
     */
    async getUserData(key) {
        let access_token = key
        let request = await axios.default({
            method: 'get',
            
            url: `${this._baseURL}/user?access_token=${key}`
        });

        return request.data;
    }
    

}



module.exports = FacebookClient