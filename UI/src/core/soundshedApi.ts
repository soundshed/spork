import { Preset } from "../spork/src/interfaces/preset";

export interface UserRegistration {

}

export interface UserRegistrationResult {
    error: string;
    data: any;
}

export interface UserDetails {
    data: {
        userId: string;
    }
}
export interface Login {
    email: string;
    password: string;
}

export interface LoginResult {
    error: string;
    data: any;
}

export interface Tone {
    user: {
        id: string;
        name: string;
    },
    deviceType: string;
    categories: string[];
    artists: string[];
    schema: string;
    preset:Preset;
}

export interface ActionResult<T> {
    completedOk: boolean;
    message: string;
    result?: T;
}

export class SoundshedApi {
    baseUrl: string = "http://localhost:3000/api/";
    currentToken: string;

    async registerUser(registration: UserRegistration): Promise<ActionResult<UserRegistrationResult>> {

        let url = this.baseUrl + "user/register";
        let response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(registration) });
        let result = <UserRegistrationResult><any>response.json();

        if (result.error == null) {
            return { completedOk: true, message: "OK", result: result };
        } else {
            return {
                completedOk: false, message: result.error
            };

        }
    }

    async login(loginDetails: Login): Promise<ActionResult<LoginResult>> {

        let url = this.baseUrl + "user/login";
        let response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginDetails) });
        let result = <LoginResult><any>response.json();

        if (result.error == null) {
            this.currentToken = result.data.token;
            return { completedOk: true, message: "OK", result: result };
        } else {
            return {
                completedOk: false, message: result.error
            };

        }
    }
}