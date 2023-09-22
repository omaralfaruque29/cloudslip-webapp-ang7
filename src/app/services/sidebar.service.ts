import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs/Rx';

@Injectable({
	providedIn: 'root'
})
export class SidebarService {

	public sidebarVisible = true;

    public sidebarVisibleObs = new BehaviorSubject(true);

	constructor() { }

	toggle() {
		this.sidebarVisible = !this.sidebarVisible;
		this.sidebarVisibleObs.next(this.sidebarVisible);
	}

	changeToFull() {
		this.sidebarVisible = false;
        this.sidebarVisibleObs.next(this.sidebarVisible);
	}
	closeFullWidth() {
		this.sidebarVisible = true;
        this.sidebarVisibleObs.next(this.sidebarVisible);
	}

	getStatus() {
		return this.sidebarVisible;
	}
}
