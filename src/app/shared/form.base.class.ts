import { FormGroup } from '@angular/forms';
import { AlertService } from './services/alert.service';

export class FormBaseClass {

    markFormGroupasTouchedandDirty(formToMakeTouchedandDirty: FormGroup) {
        Object.keys(formToMakeTouchedandDirty.controls).forEach(key => {
            formToMakeTouchedandDirty.get(key).markAsDirty();
            formToMakeTouchedandDirty.get(key).markAsTouched();
        });
    }

    markFormGroupAsClean(formToMakeUntouchedAndPending: FormGroup) {
        Object.keys(formToMakeUntouchedAndPending.controls).forEach(key => {
            formToMakeUntouchedAndPending.get(key).markAsPending();
            formToMakeUntouchedAndPending.get(key).markAsPristine();
            formToMakeUntouchedAndPending.get(key).markAsUntouched();
        });
    }

    formInvalid(form: FormGroup) {
        return form.invalid;
    }
}
