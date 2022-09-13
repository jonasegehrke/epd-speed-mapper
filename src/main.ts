import {createApp} from 'vue'
import App from './App.vue'
import createAuthRefreshInterceptor from "axios-auth-refresh";
import './index.css'
import AuthService from './auth';
import axios from '../src/api/ApiClient';


const app = createApp(App);


    const authService = new AuthService((response: any) => {
        response.then((result: any) => {
            const accessToken = result.accessToken
            localStorage.setItem("carbon0.accessToken", accessToken)
        }).catch((err: any)=>{
            throw err
        })
        return Promise.resolve()
    })
    
    app.provide("$AuthService", authService)
    
    
    // Function that will be called to refresh authorization
    const refreshAuthLogic = (failedRequest: any ) => authService.getTokenSilently().then(response => {
      if (response?.tokenType === 'Bearer') {
        localStorage.setItem('carbon0.accessToken', response.accessToken);
        failedRequest.response.config.headers['Authorization'] = 'Bearer ' + response.accessToken;
        return Promise.resolve(failedRequest);
      } else {
         authService.login(location.pathname + location.search);
        return Promise.resolve(failedRequest);
      }
    }).catch((err)=>{
      console.log(err)
    });
    
    // // Instantiate the interceptor (you can chain it as it returns the axios instance)
    createAuthRefreshInterceptor(axios, refreshAuthLogic, {
      pauseInstanceWhileRefreshing: false // default: false
    });

    app.mount('#app')