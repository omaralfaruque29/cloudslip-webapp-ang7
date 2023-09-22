import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import {CurrentUserService} from '../services/current-user.service';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *appHasAnyAuthority=''ROLE_ADMIN''>...</some-element>
 *
 *     <some-element *appHasAnyAuthority='['ROLE_ADMIN', 'ROLE_DEV']'>...</some-element>
 * ```
 */
@Directive({
    selector: '[hasAnyAuthority]'
})
export class HasAnyAuthorityDirective {

    private authorities: string[];

    constructor(
        private currentUserService: CurrentUserService,
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef
    ) {}

    @Input()
    set hasAnyAuthority(value: string | string[]) {
        this.authorities = typeof value === 'string' ? [value] : value;
        this.updateView();
        // Get notified each time authentication state changes.
        this.currentUserService.getAuthenticationState().subscribe(identity => this.updateView());
    }

    private updateView(): void {
        const hasAnyAuthority = this.currentUserService.hasAnyAuthority(this.authorities);
        this.viewContainerRef.clear();
        if (hasAnyAuthority) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
    }
}
