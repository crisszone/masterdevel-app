import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { Credential } from 'src/app/interfaces/credential';

const ROUTE = '/api/credential';

@Injectable({
    providedIn: 'root'
})
export class AuthenticateService {
    constructor(private api: ApiService) { }

    public async login(credential: Credential): Promise<boolean> {
        try {
            await this.api.put(ROUTE, credential);
            return true;
        } catch (error) {
            return false;
        }
    }
}
