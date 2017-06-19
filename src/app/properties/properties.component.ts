import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IPagedPrams, IPagedResults, IProperty, IUser} from '../shared/interfaces';
import {PagerService} from '../core/pager.service';
import {PropertyService} from '../core/property.service';
import {AuthService} from "../core/auth.service";
import {AlertService} from "../core/alert.service";

@Component({
  selector: 'properties',
  templateUrl: 'properties.component.html'
})
export class PropertiesComponent implements OnInit, OnDestroy {

  currentUserInfo: any;

  pageParam: IPagedPrams = {page: 1, limit: 10};
  properties: IProperty[] = [];

  // pager object
  pager: any = {};

  private pageParamSub: any;

  columns: any[] = [
    {
      display: '우선',
      variable: 'priority',
      sortable: true,
    },
    {
      display: '번호',
      variable: 'no',
      sortable: true,
    },
    {
      display: '계약',
      variable: 'status',
      sortable: true,
    },
    {
      display: '상가명',
      variable: 'title',
      sortable: true,
    },
    {
      display: '주소1',
      variable: 'address1',
      sortable: true,
    },
    {
      display: '업종',
      variable: 'typeDetail',
      sortable: true,
    },
    {
      display: '가격',
      variable: 'sumDepositAndPremium',
      sortable: true,
    },
    {
      display: '평/㎡',
      variable: 'sizeSupplyPyeong',
      sortable: true,
    },
    {
      display: '층',
      variable: 'floor',
      sortable: true
    },
    {
      display: '담당',
      variable: 'personInCharge',
      sortable: true
    }

  ];

  sort: any = {};

  constructor(private router: Router, private route: ActivatedRoute, private propertyService: PropertyService,
              private pagerService: PagerService, private authService: AuthService, private alertService: AlertService) {
  }

  ngOnInit(): void {

    this.currentUserInfo = this.authService.getCurrentUserInfo();

    // if (this.route.snapshot.queryParams) {
    //   const queryParam = JSON.parse(JSON.stringify(this.route.snapshot.queryParams));
    //   this.pageParam.page = Number(queryParam.page) || 1;
    //   this.pageParam.limit = Number(queryParam.limit) || 10;
    // }

    this.pageParamSub = this.route.params.subscribe(params => {
      const queryParam = JSON.parse(JSON.stringify(params));
      this.pageParam.page = Number(queryParam.page) || 1;
      this.pageParam.limit = Number(queryParam.limit) || 10;
      if (queryParam.sort) {
        this.pageParam.sort = queryParam.sort;
      }
      if (queryParam.search) {
        this.pageParam.search = queryParam.search;
      }
      this.getPropertiesPage(this.pageParam);
    });

  }

  getPropertiesPage(param: IPagedPrams) {
    this.propertyService.getPropertiesPage(param)
      .subscribe(
        (response: IPagedResults<IProperty[]>) => {
          this.properties = response.content;
          this.pager = this.pagerService.getPager(response.totalElements, this.pageParam.page, this.pageParam.limit);
        },
        (err: any) => {
          if (err.toString().indexOf('No JWT present or') > -1) {
            this.router.navigate(['login']);
          } else {
            this.alertService.error(err);
          }
        },
        () => {
        })
  }

  search() {
    this.pageParam.page = 1;
    this.router.navigate(['/properties', this.pageParam]);
  }

  getPriorityColor(prority: string) {

    switch (prority) {
      case 'a': {
        return 'darkred';
      }

      case 'b': {
        return 'blue';
      }

      case 'c': {
        return 'yellowgreen';
      }

    }

  }

  pageChanged(pageEvent) {

    // this.pageParam.page = pageEvent.page;
    this.pageParam.page = pageEvent.page;
    // this.getPropertiesPage(this.pageParam);

    this.router.navigate(['/properties', this.pageParam]);
  }

  selectedClass(columnName): string {
    let column = this.columns.filter((it) => {
      return it.variable === 'columnName';
    });

    let sortable = column['sortable'] || false;

    let classText = sortable ? 'sortable' : '';
    if (columnName == this.sort.property) {
      classText += (' sort-' + this.sort.direction)
    } else {
      return ''
    }
    return classText
  }

  changeSorting(columnName: string): void {
    let sort = this.sort;
    let originDir = sort.direction || null;
    if (sort.property === columnName) {
      // same property
      // asc or desc
      if (originDir === null) {
        sort.direction = 'asc';
      } else if (originDir === 'asc') {
        sort.direction = 'desc';
      } else if (originDir === 'desc') {
        sort.direction = null;
      }
    } else {
      sort.direction = 'asc';
    }
    sort.property = columnName;

    if (sort.property !== null && sort.direction != null) {
      this.pageParam.sort = `${sort.property},${sort.direction}`;
    } else {
      this.pageParam.sort = '';
    }

    this.pageParam.page = 1;

    // this.getPropertiesPage(this.pageParam);
    this.router.navigate(['/properties', this.pageParam]);
  }

  navigateDetail(property: IProperty): void {
    this.router.navigate(['/properties', property._id, this.pageParam]);
  }

  navigateNew() {
    this.router.navigate(['/properties/new']);
  }

  ngOnDestroy() {
    if (this.pageParamSub) {
      this.pageParamSub.unsubscribe();
    }
  }
}
