import { Component, Output, EventEmitter, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
// import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NewApplication } from "../../../services/domain/application.model";
import { TeamService } from "../../../../team/services/service-api/team.service";
import { ApplicationService } from "../../../services/service-api/application.service";
import { CpuTypes, MaxRams, ApplicationBuildTypes, ApplicationTypes } from "../../../services/domain/application.enums";
import { CurrentUserService } from "../../../../../services/current-user.service";
import { ThemeService } from '../../../../../services/theme.service';
import { MatStepper } from '@angular/material';
import { AlertService } from '../../../../../shared/services/alert.service';
import { Router, ActivatedRoute } from "@angular/router";
import { trigger, transition, style, animate } from '@angular/animations';
import { ApplicationDetailFormComponent } from './application-detail-form/application.detail.form.component';
import { BaseClass } from '../../../../../shared/base.class';
import { SidebarService } from '../../../../../services/sidebar.service';
import { ApplicationResourceConfigurationComponent } from './resource-configuration/resource.configuration.component';
import { IngressConfigurationComponent } from './ingress-configuration/ingress.configuration.form.component';
import { ApplicationEnvironmentMapping } from '../../../../../main/settings/environment-settings/services/domain/environment-settings-model';

@Component({
  selector: "app-application-form",
  templateUrl: "./application.form.component.html",
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
export class ApplicationFormComponent extends BaseClass implements OnInit {

  @Output() onSave = new EventEmitter<boolean>();
  @Output() onSkip = new EventEmitter<boolean>();

  @ViewChild('appDetailForm') applicationDetailFormComponent: ApplicationDetailFormComponent;
  @ViewChild('resourceConfigForm') resourceConfigFormComponent: ApplicationResourceConfigurationComponent;
  @ViewChild('ingressConfigForm') ingressConfigFormComponent: IngressConfigurationComponent;
  @ViewChild('stepper') matStepper: MatStepper;



  // applicationForm: FormGroup;
  // cpuTypes = CpuTypes;
  // maxRams = MaxRams;
  // packageName = "";
  // appFromRepoChecker = false;
  // appFromListChecker = false;
  // formDislpay = false;
  // dropdownSettings: any;
  // environmentMappingChecker = false;
  applicationId: string;
  isEditable = false;
  isCompleted = false;
  themeClass = "theme-cyan";
  smallScreenMenu = "";
  submitted = false;
  applicationFormData: NewApplication;
  appCreationType = null;
  environmentMapping: ApplicationEnvironmentMapping;

  constructor(
    sidebarService: SidebarService,
    cdr: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private teamService: TeamService,
    private applicationService: ApplicationService,
    private alertService: AlertService,
    private currentUserService: CurrentUserService,
    private themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute
    // private environmentSettingsService: EnvironmentSettingsService
  ) {
    super(sidebarService, cdr);
  }

  ngOnInit() {
    if (this.sidebarVisible) {
      this.closeFullWidth();
    }
    this.showNewAppForm();
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

  showNewAppForm() {
    this.route.queryParams.subscribe(
      params => {
        if (params.applicationId) {
          this.applicationService.getApplicationDetail(params.applicationId).subscribe(
            res => {
              this.applicationFormData = res.data;
              if (params.status) {
                if (params.status) {
                  if (params.status === 'PENDING_APP_DETAILS_ADDED') {
                    this.onAppDetailSave({ id: params.applicationId }, this.matStepper);
                  }
                  if (params.status === 'PENDING_APP_CLUSTER_AND_CONFIG_DETAILS_ADDED') {
                    this.onAppDetailSave({ id: params.applicationId }, this.matStepper);
                    this.changeStepper(this.matStepper);
                  }
                }
              }
            }
          );
        }
      }
    );
  }


  onAppDetailsubmit() {
    this.applicationDetailFormComponent.submit();
  }
  onResouceConfigsubmit() {
    this.resourceConfigFormComponent.submit();
  }

  onIngressCongigSubmit() {
    this.ingressConfigFormComponent.submit();
  }

  onAppDetailSave(event, stepper: MatStepper) {
    console.log(event);
    this.applicationId = event.id;
    this.appCreationType = event.creationType;
    // this.companyId = event.team.companyId;
    this.changeStepper(stepper);
  }

  changeStepper(stepper, event?) {
    this.environmentMapping = event;
    stepper.selected.completed = true;
    stepper.next();
  }
  onStepChange(event: any): void {
    if (event.selectedIndex === 1) {
      this.resourceConfigFormComponent.getEnvironmentListForApplication();
    }
  }

  back() {
    this.router.navigate(['main/application']);
  }
  // skipForNow() {
  //   this.applicationService.createTemplate({ "applicationId": this.applicationId }).subscribe(
  //     res => {
  //this.alertService.sendAlert(res);
  //       this.onSkip.emit(true);
  //       this.router.navigateByUrl('/main/application/detail/' + this.applicationId);
  //     }
  //   );
  // }




}
