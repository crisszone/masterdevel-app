import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/providers/message/message.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.page.html',
    styleUrls: ['./messages.page.scss'],
})
export class MessagesPage {
    public tag: string = '';
    public messages: Array<Message> = [];
    constructor(private messageService: MessageService) {

    }
    ionViewDidEnter() {
        this.doRefresh();
    }

    async doRefresh(event?) {
        let messages = await this.messageService.index(this.tag);
        if (messages) this.messages = messages;
        if (event) event.target.complete();
    }

}
