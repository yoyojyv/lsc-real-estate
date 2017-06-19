import {NgModule, Optional, SkipSelf} from '@angular/core';
import {HttpModule, XSRFStrategy, CookieXSRFStrategy} from '@angular/http';
import {EnsureModuleLoadedOnceGuard} from '../shared/ensureModuleLoadedOnceGuard';

// import { Sorter } from './sorter';
// import { TrackByService } from './trackby.service';

import {AlertService} from './alert.service';
import {AuthService} from './auth.service';
import {AuthGuard} from './auth.guard';
import {PagerService} from './pager.service';
import {UserService} from './user.service';
import {PropertyService} from './property.service';

@NgModule({
  imports: [HttpModule],
  providers: [
    //Default XSRF provider setup (change cookie or header name if needed):
    //{ provide: XSRFStrategy, useValue: new CookieXSRFStrategy('XSRF-TOKEN', 'X-XSRF-TOKEN') },
    // DataService, DataFilterService, Sorter, TrackByService] // these should be singleton
    AlertService,
    AuthService,
    AuthGuard,
    PagerService,
    UserService,
    PropertyService,
  ]
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {    // Ensure that CoreModule is only loaded into AppModule

  // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }

}



