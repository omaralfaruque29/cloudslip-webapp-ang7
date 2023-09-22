
export class User {
    id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    isEnabled: boolean;
    authorities: any;
}

export let Authorities = [
    { label: 'ROLE_DEV', value: 'ROLE_DEV' },
    { label: 'ROLE_OPS', value: 'ROLE_OPS' },
    { label: 'ROLE_ADMIN', value: 'ROLE_ADMIN' },
    { label: 'ROLE_SUPER_ADMIN', value: 'ROLE_SUPER_ADMIN' }
]
