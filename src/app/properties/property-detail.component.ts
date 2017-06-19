import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IPagedPrams, IPagedResults, IProperty, IUser} from '../shared/interfaces';
import {PagerService} from '../core/pager.service';
import {PropertyService} from '../core/property.service';
import {AuthService} from '../core/auth.service';
import {AlertService} from '../core/alert.service';

@Component({
  selector: 'property-detail',
  templateUrl: 'property-detail.component.html'
})
export class PropertyDetailComponent implements OnInit {

  property: IProperty;

  currentUserInfo: any;

  constructor(private router: Router, private route: ActivatedRoute,
              private propertyService: PropertyService, private pagerService: PagerService,
              private authService: AuthService, private alertService: AlertService) {


  }

  ngOnInit(): void {
    const id:string = this.route.snapshot.params['id'];
    this.getDetail(id);
    this.currentUserInfo = this.authService.getCurrentUserInfo();

    // this.route.queryParams.subscribe((params) => {
    // });

  }

  getDetail(id: string) {
    this.propertyService.getPropertyDetail(id)
      .subscribe(
        (property: IProperty) => {
          this.property = property;
        },
        (err: any) => {
          if (err.toString().indexOf('No JWT present or') > -1) {
            this.router.navigate(['login']);
          } else {
            this.alertService.error(err);
          }
        }
      );
  }

  navigateEdit() {
    this.router.navigate(['/properties', this.property._id, 'edit']);
  }

  remove(id) {
    if (confirm('해당 매물을 정말 삭제 하시겠습니까?')) {
      this.propertyService.removeProperty(id)
        .subscribe(
          (result: any) => {
            history.back();
          },
          (err: any) => {
            if (err.toString().indexOf('No JWT present or') > -1) {
              this.router.navigate(['login']);
            } else {
              this.alertService.error(err);
            }
          }
        );
    }
  }

  back() {
    history.back();
  }
}
