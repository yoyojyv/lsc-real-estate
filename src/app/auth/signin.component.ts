import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../core/auth.service';
import {AlertService} from '../core/alert.service';

@Component({
  selector: 'signin',
  templateUrl: 'signin.component.html'
})
export class SigninComponent implements OnInit {

  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService) { }

  ngOnInit() {
    // reset login status
    this.authService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    this.authService.login(this.model.username, this.model.password)
      .subscribe(
        data => {
          // login successful so redirect to return url
          this.router.navigateByUrl(this.returnUrl);
        },
        error => {
          // login failed so display error
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
