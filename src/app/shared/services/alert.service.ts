import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    'providedIn': 'root'
})


export class AlertService {
    constructor(private toastr: ToastrService) { }


    public sendAlert(res, additonalMessage?) {
        if (res.status === 'success') {
            this.toastr.success(res.message + (additonalMessage ? additonalMessage : ''));
        } else if (res.status === 'error') {
            this.toastr.error(res.message + (additonalMessage ? additonalMessage : ''));
        }
    }

    public sendErrorAlert(message) {
        this.toastr.error(message);
    }

    public sendWarningAlert(message) {
        this.toastr.warning(message);
    }
}