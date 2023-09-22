import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {

  public sidebarVisible:boolean = true;

  constructor(private sidebarService:SidebarService,private cdr:ChangeDetectorRef) { }

  ngOnInit() {
  }

  toggleFullWidth(){
    this.sidebarService.toggle();
    this.sidebarVisible = this.sidebarService.getStatus();
    this.cdr.detectChanges();
  }

}
