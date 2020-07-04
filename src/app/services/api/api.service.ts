import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import * as crypto from 'crypto-js';
import { UrlSerializer, Params, UrlTree } from '@angular/router';
import { Router } from '@angular/router';

export const SERVER = 'http://localhost:8000'
const ERROR_MESSAGE = `😢 Don't possible to process the error information`;

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public sharedSecret: string;
    private header: { [k: string]: string } = {};
    constructor(private http: HttpClient, public toastController: ToastController,
        private serializer: UrlSerializer, private router: Router) { }

    public async post(route: string, body: any, option?: HttpOptions) {
        return await this.request('post', route, body, option || {})
    }

    public async put(route: string, body: any, option?: HttpOptions) {
        return await this.request('put', route, body, option || {})
    }

    public async patch(route: string, body: any, option?: HttpOptions) {
        return await this.request('patch', route, body, option || {})
    }

    public async copy(route: string, option?: HttpOptions) {
        return await this.request('copy', route, null, option || {})
    }

    public async get(route: string, option?: HttpOptions) {
        return await this.request('get', route, null, option || {})
    }

    public async delete(route: string, option?: HttpOptions) {
        return await this.request('delete', route, null, option || {})
    }

    public registerHeader(key: string, value: string) {
        if (value === undefined) delete this.header[key]
        else this.header[key] = value;
    }

    private async request(verb: 'post' | 'patch' | 'get' | 'put' | 'delete' | 'copy', route: string, body: any, option: HttpOptions) {
        option.headers = Object.assign({}, option.headers || {}, this.header);
        option.body = body || {};

        if (this.sharedSecret && option.headers['X-Key']) {
            let tree = this.router.createUrlTree([route], { queryParams: option.params})
            let url = this.serializer.serialize(tree);
            let message = `${option.headers['X-Key']};${url};${JSON.stringify(option.body)}`;
            option.headers['X-Route'] = route;
            option.headers['X-Signature'] = crypto
                .HmacSHA256(message, this.sharedSecret)
                .toString(crypto.enc.Hex);
        }

        try {
            let promise = new Promise((resolve, reject) => {
                var subs = this.http.request(verb, SERVER + route, option);
                subs.subscribe(resolve, reject)
            })
            const result: any = await promise;
            if (result && result.message) this.presentToast(`😎 ${result.message}`, 'primary');
            return result;
        } catch (error) {
            let stringError = '';
            if (error)
                if (error.error && error.error.message) stringError = `😢 ${error.error.message}`;
                else if (error.status === 0) stringError = `😢 ${error.statusText}`;
                else if (error.message) stringError = `😢 ${error.message}`;
                else if (error.statusText) stringError = `😢 ${error.statusText}`;
                else stringError = `${ERROR_MESSAGE}: ${JSON.stringify(error)}`;
            else stringError = `${ERROR_MESSAGE}`;
            this.presentToast(stringError)
            throw stringError;
        }
    }

    private async presentToast(message: string, color: 'primary' | 'danger' = 'danger') {
        const toast = await this.toastController.create({
            color, message,
            duration: 10000,
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel',
                    handler: () => { }
                }
            ]
        });
        toast.present();
    }
}


interface HttpOptions {
    body?: any;
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    params?: HttpParams | {
        [param: string]: string | string[];
    };
}