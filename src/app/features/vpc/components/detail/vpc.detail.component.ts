import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';
import { Vpc } from '../../services/domain/vpc.model';
import { VpcService } from '../../services/service-api/vpc.service';
import { BaseClass } from '../../../../shared/base.class';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {FormatMilliCorePipe} from "../../../../pipes/format-milicore.pipe";
import {FormatMemoryPipe} from "../../../../pipes/format-memory.pipe";

@Component({
    selector: 'app-vpc-detail',
    templateUrl: './vpc.detail.component.html',
    styleUrls: ['./vpc.detail.component.css'],
    providers: [FormatMilliCorePipe, FormatMemoryPipe]
})

export class VpcDetailComponent extends BaseClass implements OnInit {
    vpcId: string;
    vpc: Vpc = new Vpc();
    modalRef: NgbModalRef;
    dataLoading: boolean;
    cpuChartOption: any = {};
    memoryChartOption: any = {};
    storageChartOption: any = {};

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private router: Router,
        private vpcService: VpcService,
        private route: ActivatedRoute,
        private formatMilliCorePipe: FormatMilliCorePipe,
        private formatMemoryPipe: FormatMemoryPipe) {
        super(sidebarService, cdr);
        this.dataLoading = true;
    }

    ngOnInit() {
        this.vpcId = this.route.snapshot.params['id'];
        this.getVpc();
    }

    getVpc() {
        this.vpcService.getVpc(this.vpcId).subscribe(
            response => {
                this.vpc = response.data;
                this.initCpuChart(this.vpc.totalCPU, this.vpc.availableCPU);
                this.initMemoryChart(this.vpc.totalMemory, this.vpc.availableMemory);
                this.initStorageChart(this.vpc.totalStorage, this.vpc.availableStorage);
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
                data: ['Used', 'Available']
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
                            name: 'Used',
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
                data: ['Used', 'Available']
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
                            name: 'Used',
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
                data: ['Used', 'Available']
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
                            name: 'Used',
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
        this.router.navigate(['/main/vpc']);
    }
}
