import * as Msal from '@azure/msal-browser';
import { msalConfig, tokenRequest} from './authConfig'
import { PublicClientApplication } from '@azure/msal-browser';
/* eslint-disable */


export default class AuthService {
    
    onAuthenticated: any
    msalObj: PublicClientApplication

    constructor(onAuthenticated: any) {

        this.onAuthenticated = onAuthenticated;
        
        this.msalObj = new Msal.PublicClientApplication(msalConfig);

        this.msalObj.handleRedirectPromise()
        .then(authResult => {
                if (authResult) {
                    this.msalObj.setActiveAccount(authResult.account)
                    this.onAuthenticated(this.getTokenSilent())
                    return true
                }        
        })
    }


    getActiveUser(): Msal.AccountInfo | null {
        if (this.msalObj.getActiveAccount()) return this.msalObj.getActiveAccount()
        
        const allAccounts = this.msalObj.getAllAccounts()
        if (allAccounts.length > 0){
            this.msalObj.setActiveAccount(allAccounts[0])
        } else {
            return null
        }
        return this.msalObj.getActiveAccount()
    }
    

     async login(redirectUrl: string) {
        if (this.msalObj.getActiveAccount()) {
            this.onAuthenticated(this.getTokenSilent(this.msalObj.getActiveAccount()?.username));
        } else {
            this.msalObj.loginRedirect()
        }
    }

    loginPopup() {
          return this.msalObj.loginPopup();
    }

     logout() {
            this.msalObj.logoutPopup().then(()=>{
                location.reload()
            })         
    }

    getTokenSilent(sso: string = ""): Promise<Msal.AuthenticationResult | void >{
        tokenRequest.loginHint = sso
        if(this.getActiveUser()){
            tokenRequest.account = this.getActiveUser()
        }
        return this.msalObj.acquireTokenSilent(tokenRequest).catch(err => {
            if (err instanceof Msal.InteractionRequiredAuthError) {
                throw err 
            }
        });
    }

    
    getTokenSilently(): Promise<Msal.AuthenticationResult | void>{
        tokenRequest.loginHint = this.getActiveUser()?.username
        return this.msalObj.acquireTokenSilent(tokenRequest).catch((err)=> {
              throw err
        })
    }

    isAuthenticated(): Boolean {
        var account = this.msalObj.getActiveAccount();
        var accessToken = localStorage.getItem('carbon0.accessToken');

        if (account && accessToken) {
            return true;
        }

        return false;
    }

  
    getUserInfo() {
       return {
            name: this.msalObj.getActiveAccount().name,
            userName: this.msalObj.getActiveAccount().username
        }
    }
}


