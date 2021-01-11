"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require('node-fetch');
class SparkAPI {
    constructor() {
        this.access_token = "";
        this.userInfo = null;
        this.api_base = "https://api.positivegrid.com/v2/";
    }
    log(msg) {
        console.log(msg);
    }
    login(user, pwd) {
        return __awaiter(this, void 0, void 0, function* () {
            // perform login and get access token
            let url = this.api_base + "/auth";
            let payload = { "username": user, "password": pwd };
            //post to API as JSON
            let response = yield fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            let data = response.json();
            if (data.success == true) {
                this.access_token = data.token;
                this.log(`Got access token: ${this.access_token}`);
                return true;
            }
            else {
                this.log(`Login failed: ${JSON.stringify(data)}`);
                return false;
            }
            // example json response: 
            /*
            // OK
            {
                "success": true,
                "token": "token.stuff>"
            }
    
            // bad password
            {
                "errorMessage": "unauthorized",
                "code": "USER_UNAUTHORIZED",
                "status": 401
            }
            */
        });
    }
    getUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            // get user info
            let url = this.api_base + "/user";
            //post to API as JSON
            let response = yield fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + this.access_token },
                body: null, credentials: 'include'
            });
            let data = response.json();
            return data;
            // example json response: 
            /*
            {
                "success": true,
                "token": "token.stuff>"
            }
            */
            // edit profile: https://account.positivegrid.com/profile
        });
    }
    getToneCloudPresets() {
        return __awaiter(this, void 0, void 0, function* () {
            // get user info
            let url = this.api_base + "/user";
            //post to API as JSON
            let response = yield fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + this.access_token },
                body: null, credentials: 'include'
            });
            let data = response.json();
            return data;
            // example json response: 
        });
    }
}
exports.SparkAPI = SparkAPI;
//# sourceMappingURL=sparkAPI.js.map