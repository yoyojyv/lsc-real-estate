import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";

@Component({
  selector: 'pager',
  template: `    

    <ul *ngIf="pager.pages && pager.pages.length" class="pagination">
      <li [ngClass]="{disabled:pager.currentPage === 1}">
        <a (click)="changePage(1, 'first')" [innerHTML]="pager.firstText || '«'">First</a>
      </li>
      <li [ngClass]="{disabled:pager.currentPage === 1}">
        <a (click)="changePage(pager.currentPage - 1)" [innerHTML]="pager.previousText || '‹'">Previous</a>
      </li>
      <li *ngFor="let page of pager.pages" [ngClass]="{active:pager.currentPage === page}">
        <a (click)="changePage(page)">{{page}}</a>
      </li>
      <li [ngClass]="{disabled:pager.currentPage === pager.totalPages}">
        <a (click)="changePage(pager.currentPage + 1)" [innerHTML]="pager.nextText || '›' ">Next</a>
      </li>
      <li [ngClass]="{disabled:pager.currentPage === pager.totalPages}">
        <a (click)="changePage(pager.totalPages, 'last')" [innerHTML]="pager.lastText || '»' ">Last</a>
      </li>
    </ul>
  `
})
export class Pager implements OnInit {

  currentPage: number = 1;

  @Input("pager") pager: any;
  @Output("pageChanged") pageChanged = new EventEmitter();

  ngOnInit() {
  }

  changePage(page, type) {

    if (type === 'first') {
      if (this.pager.currentPage === 1) {
        return;
      }
    }

    if (type === 'last') {
      if (this.pager.currentPage === this.pager.totalPages) {
        return;
      }
    }

    if (page < 1) {
      return;
    }

    if (page > this.pager.totalPages) {
      return;
    }

    this.currentPage = page;
    this.pageChangeListener();
  }

  pageChangeListener() {
    this.pageChanged.emit({
      page: this.currentPage
    });
  }

}
