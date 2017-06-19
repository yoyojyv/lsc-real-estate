import {EventEmitter, Injectable} from '@angular/core';
import {JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {CONSTANTS} from '../shared/app-constants';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService {

  jwtHelper: JwtHelper = new JwtHelper();
  public authEventEmitter: EventEmitter<any>;

  constructor(private http: Http) {
    this.authEventEmitter = new EventEmitter();
  }

  tokenExpired() {
    let token = this.getCurrentToken();
    return token != null && !tokenNotExpired(CONSTANTS.tokenKeyName, token);
  }

  getCurrentToken() {
    return localStorage.getItem(CONSTANTS.tokenKeyName);
  }

  getCurrentUserId() {
    let token = this.getCurrentToken();
    if (token) {
      let decoded = this.jwtHelper.decodeToken(token);
      if (decoded && decoded.username) {
        return decoded.username;
      }
    }
    return null;
  }

  getCurrentUserInfo() {
    let token = this.getCurrentToken();
    if (token) {
      let {_id, username, role, name} = this.jwtHelper.decodeToken(token);
      return {_id, username, role, name, isAdmin: (role === 'super_admin' || role === 'admin')};
    }
    return null;
  }

  login(username: string, password: string) {

    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post('/api/auth/login', JSON.stringify({username: username, password: password}), options)
      .map((response: Response) => {
        const res = response.json();
        const token = res.token;
        if (token) {
          localStorage.setItem(CONSTANTS.tokenKeyName, token);
          this.authEventEmitter.emit();
        }
        return response.json();
      })
      .catch(this.handleError);
  }

  logout() {
    localStorage.removeItem(CONSTANTS.tokenKeyName);
    this.authEventEmitter.emit();
  }

  private handleError(error: any) {
    if (error instanceof Response) {
      let errMessage = '';
      try {
        // errMessage = error.json().error;
        errMessage = error.json().message;
      } catch(err) {
        errMessage = error.statusText;
      }
      return Observable.throw(errMessage);
      // Use the following instead if using lite-server
      //return Observable.throw(err.text() || 'backend server error');
    }
    return Observable.throw(error || 'Server error');
  }
}
