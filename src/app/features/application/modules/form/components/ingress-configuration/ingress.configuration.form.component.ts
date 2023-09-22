import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApplicationAdvancedConfig, CustomIngressConfiguration } from '../../../../services/domain/application.model';
import { FormBaseClass } from '../../../../../../shared/form.base.class';
import { ApplicationService } from '../../../../services/service-api/application.service';
import { AlertService } from '../../../../../../shared/services/alert.service';
import { Router } from '@angular/router';



@Component({
    selector: 'app-ingress-config',
    templateUrl: './ingress.configuration.component.html',
    styles: [`.ingressCard{max-width: 20rem} .vpcIngressCard{width:100%}`]
})



export class IngressConfigurationComponent extends FormBaseClass implements OnInit {
    appPort = 8080;
    appMetricsPort = 8081;
    advancedConfigForm: FormGroup;
    creationType = null;
    applicationEnvironmentMappings = { environmentList: [] };
    customIngressConfigs: CustomIngressConfiguration[] = [];

    @Input('applicationId') set applicationId(value) {
        if (value) {
            this.advancedConfigForm.controls.applicationId.setValue(value);
        }
    }

    @Input('appCreationType') set appCreationType(value) {
        if (value) {
            this.creationType = value;
        }
    }

    @Input('environmentMapping') set environmentMapping(value) {
        if (value) {
            this.applicationEnvironmentMappings = value;
            console.log(this.applicationEnvironmentMappings);
        }
    }

    @Output() onSave = new EventEmitter<boolean>();

    constructor(
        private fb: FormBuilder,
        private applicationService: ApplicationService,
        private alertService: AlertService,
        private router: Router
    ) { super(); }

    ngOnInit() {
        this.initForm(new ApplicationAdvancedConfig());
    }


    initForm(formData: ApplicationAdvancedConfig) {
        this.advancedConfigForm = this.fb.group({
            applicationId: [formData.applicationId],
            tlsSecretName: [formData.tlsSecretName],
            ingressEnabled: [formData.ingressEnabled],
            blueGreenDeploymentEnabled: [formData.blueGreenDeploymentEnabled],
            istioEnabled: [formData.istioEnabled],
            istioIngressGatewayEnabled: [formData.istioIngressGatewayEnabled],
            healthCheckUrl: [formData.healthCheckUrl],
            customIngressConfigList: [formData.customIngressConfigList],
            appPort: [formData.appPort],
            appMetricsPort: [formData.appMetricsPort]
        });
        // this.advancedConfigForm.controls.healthCheckUrl.setValue('/');
    }

    oningressChange() {
        this.advancedConfigForm.controls.istioIngressGatewayEnabled.setValue(!this.advancedConfigForm.controls.ingressEnabled.value);
    }

    addNewCutomIngress(url, vpc, env) {
        const newCustomIngressMapping = new CustomIngressConfiguration();
        newCustomIngressMapping.customIngress = url;
        newCustomIngressMapping.environmentId = env.environment.id;
        newCustomIngressMapping.vpcId = vpc.vpcId;
        this.customIngressConfigs.push(newCustomIngressMapping);
        console.log(this.customIngressConfigs);
    }

    submit() {
        this.markFormGroupasTouchedandDirty(this.advancedConfigForm);
        if (this.formInvalid(this.advancedConfigForm)) { return; }

        let newConfig: ApplicationAdvancedConfig = new ApplicationAdvancedConfig();
        newConfig = this.advancedConfigForm.value;

        if (this.creationType === 'NEW_APP') {
            newConfig.healthCheckUrl = '/';
            newConfig.appPort = 8080;
            newConfig.appMetricsPort = 8081;
        }

        newConfig.customIngressConfigList = this.customIngressConfigs;

        this.applicationService.addAdvancedConfigforApplication(newConfig).subscribe(
            res => {
                this.alertService.sendAlert(res);
                this.onSave.emit(true);
                this.applicationService.createTemplate({ "applicationId": this.advancedConfigForm.controls.applicationId.value }).subscribe(
                    res => {
                        //this.alertService.sendAlert(res);
                        //   this.onSkip.emit(true);
                        this.router.navigateByUrl('/main/application/detail/' + this.advancedConfigForm.controls.applicationId.value);
                    }
                );
            }
        );
    }
}
