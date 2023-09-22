import { Routes } from '@angular/router';
import {KubeClusterComponent} from "./components/kube-cluster.component";
import {KubeClusterDetailComponent} from "./components/detail/kube-cluster.detail.component";

export const KubeClusterRoutes: Routes = [{
    path: '', component: KubeClusterComponent,

    },
    {
        path: 'detail/:id', component: KubeClusterDetailComponent

    }
];
