import { Component } from '@angular/core';
import { OnboardingService } from '../services/service-api/onboarding.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CurrentUserService } from '../../../services/current-user.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.scss'],
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

export class OnboardingComponent {

    welcome = true;
    waiting = false;
    gitInfo = false;
    dockerInfo = false;

    slides = [
        { src: '../../../../assets/images/automatic.svg', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi, ea!' },
        { src: '../../../../assets/images/automaticDatabase.svg', text: 'Kub Deploy Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi, ea!' },
        { src: '../../../../assets/images/robot.svg', text: 'Docker Deploy Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi, ea!' },
        { src: '../../../../assets/images/cloud.svg', text: 'So many Things Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi, ea!' }
    ];
    slideConfig = { "slidesToShow": 1, "slidesToScroll": 1, "autoplay": true, autoplaySpeed: 7000, dots: true };

    constructor(
        private _onBoardingService: OnboardingService,
        private _alertService: AlertService,
        private _router: Router,
        private _currentUserService: CurrentUserService,
        private _localStorage: LocalStorageService
    ) { }

    slickInit(e) {
        console.log('slick initialized');
    }

    getStart() {
        this.welcome = false;
        this.waiting = true;
        setTimeout(() => { this.waiting = false; this.gitInfo = true; }, 3000);
        // 3000
    }

    getDockerStart() {
        this.gitInfo = false;
        this.waiting = true;
        setTimeout(() => { this.waiting = false; this.dockerInfo = true; }, 2500);

    }

    skipNow() {
        this._onBoardingService.skipInitialSetting().subscribe(
            res => {
                this._alertService.sendAlert(res);
                if (res.status === 'success') {
                    this._router.navigate(['/']);
                    const user = this._currentUserService.get();
                    user.initialSettingStatus = 'SKIPPED';
                    this._localStorage.store('currentUser', user);
                }
            }
        );
    }
    completeInitialSetup() {
        this._onBoardingService.completeInitialSetting().subscribe(
            res => {
                this._alertService.sendAlert(res);
                if (res.status === 'success') {
                    const user = this._currentUserService.get();
                    user.initialSettingStatus = 'COMPLETED';
                    this._localStorage.store('currentUser', user);
                    this._router.navigate(['/']);
                }
            }
        );
    }
}
