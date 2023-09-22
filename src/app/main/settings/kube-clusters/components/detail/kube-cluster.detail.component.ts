import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {BaseClass} from "../../../../../shared/base.class";
import {KubeCluster} from "../../services/domain/kube-cluster.model";
import {SidebarService} from "../../../../../services/sidebar.service";
import {KubeClusterService} from "../../services/service-api/kube-cluster.service";
import {FormatMilliCorePipe} from "../../../../../pipes/format-milicore.pipe";
import {FormatMemoryPipe} from "../../../../../pipes/format-memory.pipe";

@Component({
    selector: 'app-kube-cluster-detail',
    templateUrl: './kube-cluster.detail.component.html',
    styleUrls: ['./kube-cluster.detail.component.css'],
    providers: [FormatMilliCorePipe, FormatMemoryPipe]
})

export class KubeClusterDetailComponent extends BaseClass implements OnInit {
    kubeClusterId: string;
    kubeCluster: KubeCluster = new KubeCluster();
    modalRef: NgbModalRef;
    dataLoading: boolean;
    cpuChartOption: any = {};
    memoryChartOption: any = {};
    storageChartOption: any = {};

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private router: Router,
        private route: ActivatedRoute,
        private kubeClusterService: KubeClusterService,
        private formatMilliCorePipe: FormatMilliCorePipe,
        private formatMemoryPipe: FormatMemoryPipe) {
        super(sidebarService, cdr);
        this.dataLoading = true;
    }

    ngOnInit() {
        this.kubeClusterId = this.route.snapshot.params['id'];
        this.getKubeCluster();
    }

    getKubeCluster() {
        this.kubeClusterService.getKubeCluster(this.kubeClusterId).subscribe(
            response => {
                this.kubeCluster = response.data;
                this.initCpuChart(this.kubeCluster.totalCPU, this.kubeCluster.availableCPU);
                this.initMemoryChart(this.kubeCluster.totalMemory, this.kubeCluster.availableMemory);
                this.initStorageChart(this.kubeCluster.totalStorage, this.kubeCluster.availableStorage);
                this.dataLoading = false;
            }, error => {
                this.dataLoading = false;
                console.log(error);
            }
        );
    }

    initCpuChart(totalCpu, availableCpu) {
        this.cpuChartOption = {
            title: {
                text: 'Total CPU',
                textStyle: {
                    fontSize: 14
                },
                subtext: this.formatMilliCorePipe.transform(totalCpu) + ' Core',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['Sold', 'Available']
            },
            series: [
                {
                    name: 'CPU Usage',
                    hoverAnimation: false,
                    type: 'pie',
                    radius: '40%',
                    center: ['50%', '40%'],
                    data: [
                        {
                            value: this.formatMilliCorePipe.transform(totalCpu - availableCpu),
                            name: 'Sold',
                            itemStyle: {
                                color: '#E57373'
                            }
                        },
                        {
                            value: this.formatMilliCorePipe.transform(availableCpu),
                            name: 'Available',
                            itemStyle: {
                                color: '#49c5b6'
                            }
                        }
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }

    initMemoryChart(totalMemory, availableMemory) {
        this.memoryChartOption = {
            title: {
                text: 'Total Memory',
                textStyle: {
                    fontSize: 14
                },
                subtext: this.formatMemoryPipe.transform(totalMemory),
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['Sold', 'Available']
            },
            series: [
                {
                    name: 'Memory Usage (MB)',
                    hoverAnimation: false,
                    type: 'pie',
                    radius: '40%',
                    center: ['50%', '40%'],
                    data: [
                        {
                            value: totalMemory - availableMemory,
                            name: 'Sold',
                            itemStyle: {
                                color: '#E57373'
                            }
                        },
                        {
                            value: availableMemory,
                            name: 'Available',
                            itemStyle: {
                                color: '#49c5b6'
                            }
                        }
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }

    initStorageChart(totalStorage, availableStorage) {
        this.storageChartOption = {
            title: {
                text: 'Total Storage',
                textStyle: {
                    fontSize: 14
                },
                subtext: this.formatMemoryPipe.transform(totalStorage),
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['Sold', 'Available']
            },
            series: [
                {
                    name: 'Storage Usage (GB)',
                    hoverAnimation: false,
                    type: 'pie',
                    radius: '40%',
                    center: ['50%', '40%'],
                    data: [
                        {
                            value: (totalStorage - availableStorage) / 1024,
                            name: 'Sold',
                            itemStyle: {
                                color: '#E57373'
                            }
                        },
                        {
                            value: availableStorage / 1024,
                            name: 'Available',
                            itemStyle: {
                                color: '#49c5b6'
                            }
                        }
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }

    back() {
        this.router.navigate(['/main/kube-clusters']);
    }
}
