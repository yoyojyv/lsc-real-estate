import {Injectable, Injector} from '@angular/core';
import {RequestOptionsArgs} from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable()
export class SafeAuthHttp {

  constructor(private authHttp: AuthHttp, private authService: AuthService) {
  }

  /**
   * http get
   *
   * @param url
   * @param options
   * @returns {Observable<Response>}
   */
  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return Observable.create(observer => {
      observer.onNext(this.checkAuthToken());
      observer.complete();
    }).mergeMap((loggedIn: any) => {
      return this.authHttp.get(url, options).timeout(10000);
    });
  }

  /**
   * http post
   *
   * @param url
   * @param body
   * @param options
   * @returns {Observable<Response>}
   */
  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return Observable.create(observer => {
      observer.onNext(this.checkAuthToken());
      observer.complete();
    }).mergeMap((loggedIn: any) => {
      return this.authHttp.post(url, body, options).timeout(10000);
    });

    // return Observable.fromPromise(this.checkAuthToken()).mergeMap((loggedIn: any) => {
    //   return this.authHttp.post(url, body, options).timeout(10000);
    // });

  }

  private checkAuthToken(): boolean {
    return this.authService.tokenExpired();
  }

}
