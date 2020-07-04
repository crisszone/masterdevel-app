import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SessionService } from './services/session/session.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    public dark = true;
    public appPages = [
        {
            title: 'Message',
            url: '/message',
            icon: 'chatbubbles'
        }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private session: SessionService
    ) {
        this.initializeApp();
    }

    get isLoggedIn() {
        return !!this.session.credential
    };

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    ngOnInit() {
        this.checkLoginStatus();

    }

    logout() {
        this.session.logout()
    }

    checkLoginStatus() {
        this.session.isLoggedIn()
    }
}
