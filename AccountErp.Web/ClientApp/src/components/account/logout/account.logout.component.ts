import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListenerService } from '../../../services';

@Component({
    selector: 'app-logout',
    templateUrl: './account.logout.component.html'
})

export class LogoutComponent implements OnInit {
    constructor(private router: Router,
        private listenerService: ListenerService) { }

    ngOnInit() {
        localStorage.clear();
        this.listenerService.layoutlistner.next();
        this.router.navigate(['/account/login']);
    }
}
