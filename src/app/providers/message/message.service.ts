import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Message } from 'src/app/interfaces/message';

const ROUTE = '/api/message';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    constructor(private api: ApiService) { }

    public async create(message: Message): Promise<Message> {
        try {
            let result = await this.api.post(ROUTE, message);
            return result;
        } catch (error) {
            return null;
        }
    }

    public async index(tag: string) {
        try {
            let results = await this.api.get(ROUTE, { params: { tag } })
            return results;
        } catch (error) {
            return [];
        }
    }

    public async get(_id: string): Promise<Message> {
        try {
            let result = await this.api.get(ROUTE + `/${_id}`)
            return result;
        } catch (error) {
            return null;
        }
    }
}
