import { SidebarService } from '../services/sidebar.service';
import { ChangeDetectorRef } from '@angular/core';


export class BaseClass {
    sidebarVisible = true;

    // variables for multiple selection on table
    initialSelection = [];
    allowMultiSelect = true;
    selection: any;
    tableValue = [];
    activeTab = '';
    activeTabLink = '';

    constructor(
        private sidebarService: SidebarService,
        private cdr: ChangeDetectorRef
    ) { }
    /** Sidebar resize on button click */
    toggleFullWidth() {
        this.sidebarService.toggle();
        this.sidebarVisible = this.sidebarService.getStatus();
        this.cdr.detectChanges();
    }

    changeToFullWidth() {
        this.sidebarService.changeToFull();
        this.sidebarVisible = this.sidebarService.getStatus();
        this.cdr.detectChanges();
    }

    closeFullWidth() {
        this.sidebarService.closeFullWidth();
        this.sidebarVisible = this.sidebarService.getStatus();
        this.cdr.detectChanges();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.tableValue.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.tableValue.forEach(row => this.selection.select(row));
    }

    chageTab(tabName: string, tabLink: string) {
        if (this.activeTab !== tabName) {
            document.getElementById(tabName).classList.add('show');
            document.getElementById(tabName).classList.add('active');

            document.getElementById(tabLink).classList.add('active');

            if (this.activeTab !== '') {
                document.getElementById(this.activeTab).classList.remove('show');
                document.getElementById(this.activeTab).classList.remove('active');

                document.getElementById(this.activeTabLink).classList.remove('active');
            }
            this.activeTab = tabName;
            this.activeTabLink = tabLink;
        }
    }

}
