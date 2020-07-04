import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/interfaces/message';
import { NgForm, AbstractControl } from '@angular/forms';
import { MessageService } from 'src/app/providers/message/message.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-message',
    templateUrl: './message.page.html',
    styleUrls: ['./message.page.scss'],
})
export class MessagePage {
    @ViewChild('submitForm', { static: false }) submitForm: NgForm;
    public submitted: boolean = false;
    public fieldsetDisabled: boolean = false;
    public tag: string;
    public message = <Message>{ tags: [] };
    constructor(private messageService: MessageService, private route: Router,
        private activatedRoute: ActivatedRoute,
    ) { }

    async ionViewWillEnter(): Promise<void> {
        let _id = this.activatedRoute.snapshot.paramMap.get('id');
        if (_id) {
            this.message = await this.messageService.get(_id)
            this.fieldsetDisabled = true;
        }

    }

    async submit(form: NgForm) {
        this.submitted = true;
        if (form.valid) {
            this.submitted = false;
            let message = await this.messageService.create(this.message);
            if (message) {
                this.message._id = message._id;
                return this.route.navigateByUrl('/messages')
            }
        }
    }

    addTags(tag) {
        this.tag.trim().split(' ').forEach((t: string) => this.message.tags.push(t))
        this.tag = null;
    }

}
