
import { Routes } from '@angular/router';
import {ComposeComponent} from "./compose/compose.component";
import {InboxComponent} from "./inbox/inbox.component";
import {RoleGuardService as RoleGuard} from "../../services/role-guard.service";
import {SentComponent} from "./sent/sent.component";
import {MessageDetailsComponent} from "./details/message-details.component";

export const MessagesRoute: Routes = [
    {
        path: 'compose',
        component: ComposeComponent,
        data: {
            title: 'SloppyTiger :: Compose Message',
            authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
        },
        canActivate: [RoleGuard]
    },
    {
        path: 'inbox',
        component: InboxComponent,
        data: {
            title: 'SloppyTiger :: Inbox',
            authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
        },
        canActivate: [RoleGuard]
    },
    {
        path: 'sent',
        component: SentComponent,
        data: {
            title: 'SloppyTiger :: Sent Messages',
            authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
        },
        canActivate: [RoleGuard]
    },
    {
        path: 'inbox/:messageThreadId/:messageId',
        component: MessageDetailsComponent,
        data: {
            title: 'SloppyTiger :: Inbox :: Message Details',
            authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
        },
        canActivate: [RoleGuard]
    },
    {
        path: 'sent/:messageThreadId/:messageId',
        component: MessageDetailsComponent,
        data: {
            title: 'SloppyTiger :: Sent :: Message Details',
            authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
        },
        canActivate: [RoleGuard]
    }
]