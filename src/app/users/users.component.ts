import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../core/user.service';
import {IPagedPrams, IPagedResults, IUser} from '../shared/interfaces';
import {PagerService} from '../core/pager.service';
import {AuthService} from '../core/auth.service';
import {AlertService} from '../core/alert.service';

@Component({
  selector: 'users',
  templateUrl: 'users.component.html'
})
export class UsersComponent implements OnInit {

  currentUserInfo: any;

  pageParam: IPagedPrams = {page: 1, limit: 10};
  users: IUser[] = [];

  // pager object
  pager: any = {};
  pagedItems: any[];

  constructor(private router: Router, private userService: UserService,
              private authService: AuthService, private pagerService: PagerService,
              private alertService: AlertService) {
    this.currentUserInfo = this.authService.getCurrentUserInfo();
    if (!this.currentUserInfo || this.currentUserInfo.role != 'super_admin') {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.getUsersPage(this.pageParam);
  }

  getUsersPage(param: IPagedPrams) {
    this.userService.getUsersPage(param)
      .subscribe(
        (response: IPagedResults<IUser[]>) => {
          this.users = response.content;
          this.pager = this.pagerService.getPager(response.totalElements, this.pageParam.page, this.pageParam.limit);
        },
        (err: any) => console.log(err),
        () => {})
  }

  removeUser(user: IUser) {
    if (confirm('해당 유저를 정말 삭제 하시겠습니까?')) {
      this.userService.removeUser(user._id)
        .subscribe(
          (result: any) => {
            //this.router.navigate(['/users']);
            location.reload(true);
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

  navigateNew() {
    this.router.navigate(['/users/new']);
  }

  editUser(user: IUser) {
    this.router.navigate(['/users', user._id]);
  }

  pageChanged(pageEvent) {
    this.pageParam.page = pageEvent.page;
    this.getUsersPage(this.pageParam);
  }

}
