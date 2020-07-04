import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../providers/auth/auth.service';
import { Credential } from 'src/app/interfaces/credential';
import { Storage } from '@ionic/storage';

const SESSION_KEY = 'SESSION_KEY';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private _credential;
    constructor(private storage: Storage, private router: Router, private auth: AuthenticateService,
        private api: ApiService) { }

    public get credential(): Credential {
        return this._credential;
    }

    async login(credential: Credential) {
        let session = await this.auth.login(credential);
        this.setSession(credential, session);
    }


    async logout() {
        this._credential = null;
        this.setSession(null, null);
    }

    private async setSession(credential: Credential, session: any) {
        if (credential && session) {
            this._credential = credential;
            this.api.sharedSecret = credential.shared_secret
            this.api.registerHeader('X-Key', credential.key)
            await this.storage.set(SESSION_KEY, credential);
            this.router.navigateByUrl('/messages');
        } else {
            this.logout;
            this.api.registerHeader('Authorization', undefined)
            await this.storage.remove(SESSION_KEY);
            this.router.navigateByUrl('/');
        }
    }

    private async loadSession() {
        try {
            let info = await this.storage.get(SESSION_KEY);
            await this.setSession(info, true);
        } catch (error) {
            this.router.navigateByUrl('/');
        }
    }

    async isLoggedIn(): Promise<boolean> {
        await this.loadSession()
        return !!this.credential;
    }
}
