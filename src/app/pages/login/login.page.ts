import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { Credential } from 'src/app/interfaces/credential';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    public view = false;
    public credential = <Credential>{};
    public submitted = false;

    constructor(public router: Router, private session: SessionService) { }

    ngOnInit() {
    }


    onLogin(form: NgForm) {
        this.submitted = true;
        if (form.valid) {
            this.session.login(this.credential);
        }
    }

    onSignup() {
        this.router.navigateByUrl('/signup');
    }

}
