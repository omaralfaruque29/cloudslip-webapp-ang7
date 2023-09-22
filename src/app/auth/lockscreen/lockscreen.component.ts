import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-lockscreen',
    templateUrl: './lockscreen.component.html',
    styleUrls: ['./lockscreen.component.css']
})
export class LockscreenComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
    }

    onSubmit() {
        this.router.navigate(['/admin/dashboard/index']);
    }

}
