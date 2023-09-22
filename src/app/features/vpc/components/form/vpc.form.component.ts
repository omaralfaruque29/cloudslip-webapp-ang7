import { Component, Output, EventEmitter, OnInit } from "@angular/core";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBaseClass } from "../../../../shared/form.base.class";
import { TeamService } from "../../../team/services/service-api/team.service";
import { VpcService } from "../../services/service-api/vpc.service";
import { CurrentUserService } from "../../../../services/current-user.service";
import { ThemeService } from '../../../../services/theme.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { Router } from "@angular/router";
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: "app-vpc-form",
  templateUrl: "./vpc.form.component.html",
  animations: [
    trigger('myInsertRemoveTrigger', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('.25s', style({ opacity: 1 })),
    ]),
    transition(':leave', [
      animate('.25s', style({ opacity: 0 }))
    ])
  ]),
]
})
export class VpcFormComponent extends FormBaseClass implements OnInit {

  @Output() onSave = new EventEmitter<boolean>();
  @Output() onSkip = new EventEmitter<boolean>();

  vpcForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private vpcService: VpcService,
    private alertService: AlertService,
    private currentUserService: CurrentUserService,
    private themeService: ThemeService,
    private router: Router
    // private environmentSettingsService: EnvironmentSettingsService
  ) {
    super();
  }

  ngOnInit() {

  }
}
