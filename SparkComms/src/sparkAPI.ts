export class SparkAPI {

    access_token = "";

    api_base = "https://api.positivegrid.com/v2/"

    async login(user, pwd) {
        // perform login and get access token
        let url = this.api_base + "/auth";
        let payload = { "username": user, "password": pwd };

        //post to API as JSON
        let response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        let data = <any>response.json();

        if (data.success == true) {
            this.access_token = data.token;
        }

        // example json response: 
        /*
        {
            "success": true,
            "token": "token.stuff>"
        }
        */
    }

    async getUserInfo() {
        // get user info
        let url = this.api_base + "/user";

        //post to API as JSON
        let response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + this.access_token },
            body: null, credentials: 'include'
        });
        let data = <any>response.json();


        // example json response: 
        /*
        {
            "success": true,
            "token": "token.stuff>"
        }
        */
    }
    
    async getToneCloudPresets() {
        // get user info
        let url = this.api_base + "/user";

        //post to API as JSON
        let response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + this.access_token },
            body: null, credentials: 'include'
        });
        let data = <any>response.json();


        // example json response: 
    }
}