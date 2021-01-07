import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ListenerService {

    public topNavlistner = new Subject<any>();
    public layoutlistner = new Subject<any>();

    get listenTopNav() {
        return this.topNavlistner.asObservable();
    }

    get listenLayout() {
        return this.layoutlistner.asObservable();
    }
}
