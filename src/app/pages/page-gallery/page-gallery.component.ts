import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EChartOption } from 'echarts';
import { SidebarService } from '../../services/sidebar.service';
import { Lightbox, IAlbum } from 'ngx-lightbox';
import { ActivatedRoute } from '@angular/router';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-page-gallery',
	templateUrl: './page-gallery.component.html',
	styleUrls: ['./page-gallery.component.css'],
	providers: [NgbTabsetConfig]
})
export class PageGalleryComponent implements OnInit {

	public visitorsOptions: EChartOption = {};
	public visitsOptions: EChartOption = {};
	public sidebarVisible: boolean = true;
	private _albums: Array<IAlbum> = new Array<IAlbum>();
	private _albumsTab1: Array<IAlbum> = new Array<IAlbum>();
	private _albumsTab2: Array<IAlbum> = new Array<IAlbum>();
	private _albumsTab3: Array<IAlbum> = new Array<IAlbum>();
	private _albumsTab4: Array<IAlbum> = new Array<IAlbum>();
	public fragment: string = "all";

	constructor(private sidebarService: SidebarService, private cdr: ChangeDetectorRef, private lightbox: Lightbox, private activatedRoute: ActivatedRoute,private tabConfig: NgbTabsetConfig) {
		this.activatedRoute.fragment.subscribe((fragment: string) => {
			if (fragment) {
				this.fragment = fragment;
			}
		});
		this.tabConfig.type = 'pills';

		this.visitorsOptions = this.loadLineChartOptions([3, 5, 1, 6, 5, 4, 8, 3], "#49c5b6");
		this.visitsOptions = this.loadLineChartOptions([4, 6, 3, 2, 5, 6, 5, 4], "#f4516c");

		for (let i = 1; i <= 15; i++) {
			const src = 'assets/images/image-gallery/' + i + '.jpg';
			const thumb = 'assets/images/image-gallery/' + i + '.jpg';
			const album = {
				src: src,
				thumb: thumb,
				centerVertically:true
			};
			this._albums.push(album);
		}
		for (let i = 1; i <= 4; i++) {
			const src = 'assets/images/image-gallery/' + i + '.jpg';
			const thumb = 'assets/images/image-gallery/' + i + '.jpg';
			const album = {
				src: src,
				thumb: thumb,
				centerVertically: true
			};
			this._albumsTab1.push(album);
		}
		for (let i = 5; i <= 7; i++) {
			const src = 'assets/images/image-gallery/' + i + '.jpg';
			const thumb = 'assets/images/image-gallery/' + i + '.jpg';
			const album = {
				src: src,
				thumb: thumb,
				centerVertically: true
			};
			this._albumsTab2.push(album);
		}
		for (let i = 8; i <= 12; i++) {
			const src = 'assets/images/image-gallery/' + i + '.jpg';
			const thumb = 'assets/images/image-gallery/' + i + '.jpg';
			const album = {
				src: src,
				thumb: thumb,
				centerVertically: true
			};
			this._albumsTab3.push(album);
		}
		for (let i = 13; i <= 15; i++) {
			const src = 'assets/images/image-gallery/' + i + '.jpg';
			const thumb = 'assets/images/image-gallery/' + i + '.jpg';
			const album = {
				src: src,
				thumb: thumb,
				centerVertically: true
			};
			this._albumsTab4.push(album);
		}
	}

	ngOnInit() {
	}

	toggleFullWidth() {
		this.sidebarService.toggle();
		this.sidebarVisible = this.sidebarService.getStatus();
		this.cdr.detectChanges();
	}

	loadLineChartOptions(data, color) {
		let chartOption: EChartOption;
		let xAxisData: Array<any> = new Array<any>();

		data.forEach(element => {
			xAxisData.push("");
		});

		return chartOption = {
			xAxis: {
				type: 'category',
				show: false,
				data: xAxisData,
				boundaryGap: false,
			},
			yAxis: {
				type: 'value',
				show: false
			},
			tooltip: {
				trigger: 'axis',
				formatter: function (params, ticket, callback) {
					return '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + color + ';"></span>' + params[0].value;
				}
			},
			grid: {
				left: '0%',
				right: '0%',
				bottom: '0%',
				top: '0%',
				containLabel: false
			},
			series: [{
				data: data,
				type: 'line',
				showSymbol: false,
				symbolSize: 1,
				lineStyle: {
					color: color,
					width: 1
				}
			}]
		};
	}

	open(album: Array<IAlbum>,index: number): void {
		// open lightbox
		this.lightbox.open(album, index);
	}

	close(): void {
		// close lightbox programmatically
		this.lightbox.close();
	}

}
