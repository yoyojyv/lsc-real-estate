import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { appRouting } from './app.routing';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {Http, RequestOptions} from '@angular/http';
import {CONSTANTS} from './shared/app-constants';
import {NgDaumAddressModule} from 'ng2-daum-address/index';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: CONSTANTS.tokenKeyName,
    tokenGetter: (() => localStorage.getItem(CONSTANTS.tokenKeyName)),
    globalHeaders: [{'Content-Type':'application/json'}],
  }), http, options);
}

@NgModule({
  imports: [
    BrowserModule,
    appRouting.routes,
    CoreModule, // Singleton objects
    SharedModule, //Shared (multi-instance) objects
    NgDaumAddressModule, // daum address
  ],
  declarations: [ AppComponent, appRouting.components ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
