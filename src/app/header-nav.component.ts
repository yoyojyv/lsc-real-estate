import {Component} from '@angular/core';
import {AuthService} from "./core/auth.service";
import {Router} from "@angular/router";


@Component({
  selector: 'header-nav',
  templateUrl: 'header-nav.component.html'
})
export class HeaderNavComponent {

  userInfo: any;

  isMenuExpanded: boolean = false;

  constructor(private authService: AuthService, private router: Router) {

    this.userInfo = authService.getCurrentUserInfo();

    authService.authEventEmitter.subscribe(_ => {
      this.userInfo = authService.getCurrentUserInfo();
    });

  }

  toggleMenu() {
    this.isMenuExpanded = !this.isMenuExpanded;
  }


}
