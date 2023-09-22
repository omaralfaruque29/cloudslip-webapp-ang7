import { Injectable } from "@angular/core";
import * as endpoints from '../kube-cluster.endpoints';
import { FacadeDataService } from '../../../../../services/facade.data.service';
import { Observable } from "rxjs";

@Injectable({
    'providedIn': 'root'
})

export class KubeClusterService {
    constructor(private facadeDataService: FacadeDataService) {
    }
    createKubeCluster(kubeCluster): Observable<any> {
        return this.facadeDataService.post(endpoints.CREATE_PUBLIC_CLUSTER, kubeCluster);
    }
    getKubeClustersList(): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_PUBLIC_CLUSTERS_LIST);
    }
    getKubeCluster ( id ): Observable<any> {
        return this.facadeDataService.get( endpoints.GET_PUBLIC_CLUSTER + id );
    }
    getRegionList(): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_REGION_LIST);
    }
    deleteEnvironmentOpton(kubeClusterId: string): Observable<any> {
        return this.facadeDataService.delete(endpoints.DELETE_PUBLIC_CLUSTER + kubeClusterId);
    }
    updateKubeCluster(kubeCluster): Observable<any> {
        return this.facadeDataService.put(endpoints.UPDATE_PUBLIC_CLUSTER, kubeCluster);
    }

}
