import { SparkAPI } from "../sparkAPI";

let api = new SparkAPI();

api.login("","").then(async result=> {

    let user= await api.getUserInfo();

    console.log(user);
})