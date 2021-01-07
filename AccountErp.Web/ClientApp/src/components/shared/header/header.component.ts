import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ListenerService } from '../../../services';

import * as jwt_decode from 'jwt-decode';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
    currentUsername = '';

    subscription: Subscription;

    constructor(private messageService: ListenerService) {
        this.subscription = this.messageService
            .listenTopNav
            .subscribe(() => {
                this.loadCurrentUserProfile();
            });
    }

    ngOnInit(): void {
        this.loadCurrentUserProfile();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadCurrentUserProfile() {
        const authToken = localStorage.getItem('AuthToken');
        if (!authToken) {
            return;
        }
        const decodedToken = jwt_decode(authToken);
        this.currentUsername = decodedToken.given_name;
    }
}

