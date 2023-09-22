import { Component, Output } from '@angular/core';
import { User, Authorities } from '../../services/domain/user.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/service-api/user.service';
import { CurrentUserService } from '../../../../services/current-user.service';
import { ThemeService } from '../../../../services/theme.service';
import { FormBaseClass } from '../../../../shared/form.base.class';

@Component({
    selector: 'app-user-form',
    templateUrl: './user.form.component.html'
})


export class UserFormComponent extends FormBaseClass {

    @Output() onSave = new EventEmitter<boolean>();

    userForm: FormGroup;

    modalHeader: string;
    modalActionButton: string;

    userId: number = null;
    authorityList = [];
    selectedItems = [];
    dropdownSettings: any;

    themeClass: string = "theme-cyan";
    smallScreenMenu = "";

    constructor(
        private themeService: ThemeService,
        private fb: FormBuilder,
        private userService: UserService,
        private toastr: ToastrService,
        public activeModal: NgbActiveModal,
        private currentUserService: CurrentUserService
    ) {
        super();
    }

    ngOnInit() {
        this.setDropDownSetting();
        this.setAuthorityList();
        this.setThemeandShowMenu();
    }

    setThemeandShowMenu() {
        this.themeService.themeClassChange.subscribe(themeClass => {
            this.themeClass = themeClass;
        });

        this.themeService.smallScreenMenuShow.subscribe(showMenuClass => {
            this.smallScreenMenu = showMenuClass;
        });
    }

    setDropDownSetting() {
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'value',
            textField: 'label',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
        };
    }


    setAuthorityList() {
        const currentUser = this.currentUserService.get();
        if (currentUser.authorities.includes('ROLE_ADMIN')) {
            this.authorityList = Authorities.filter(authority => authority.value !== 'ROLE_SUPER_ADMIN');
        }
        else {
            this.authorityList = Authorities;
        }
    }

    createUserForm() {
        this.modalHeader = 'Create new user';
        this.modalActionButton = 'Create';
        this.initForm(new User());
    }

    editUserForm(selecteduser) {
        this.modalHeader = 'Edit user';
        this.modalActionButton = 'Update';
        this.userId = selecteduser.id;
        this.initForm(selecteduser);
        this.userForm.addControl('enabled', new FormControl(selecteduser.enabled));
    }

    initForm(formData) {
        formData = formData ? formData : new User();
        if (formData && formData.userInfo) {
            formData.firstname = formData.userInfo.firstName ? formData.userInfo.firstName : null;
            formData.lastName = formData.userInfo.lastName ? formData.userInfo.lastName : null;
        }
        this.userForm = this.fb.group({
            userId: [formData.id ? formData.id : null],
            firstName: [formData.firstname, [Validators.required]],
            lastName: [formData.lastName, [Validators.required]],
            username: [formData.username, [Validators.required]],
            authorities: [formData.authorities, [Validators.required]]
        });
    }

    submit() {

        this.markFormGroupasTouchedandDirty(this.userForm);

        if (this.formInvalid()) { return; }

        const newUser = this.userForm.value;

        if (this.userId) {
            this.updateUser(newUser);
        }
        else {
            this.createUser(newUser);
        }
    }

    formInvalid() {
        return this.userForm.invalid;
    }

    createUser(newUser) {
        this.userService.createUser(newUser).subscribe(
            data => {
                this.toastr.success(data['message'], 'User Created');
                this.onSave.emit(true);
            }
        )
    }

    updateUser(newUser) {
        this.userService.updateUser(newUser).subscribe(
            data => {
                this.toastr.success(data['message'], 'User Updated');
                this.onSave.emit(true);
            }
        )
    }
}