import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

//Grab everything with import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {IPagedPrams, IPagedResults, IUser} from '../shared/interfaces';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class UserService {

  baseUrl: string = '/api/users';

  constructor(private http: Http, private authHttp: AuthHttp) {
  }

  getUsersPage(pageParam: IPagedPrams): Observable<IPagedResults<IUser[]>> {
    return this.authHttp.get(`${this.baseUrl}/page?page=${pageParam.page}&limit=${pageParam.limit}`)
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  getUser(id: string): Observable<IUser> {
    return this.authHttp.get(`${this.baseUrl}/${id}`)
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  saveUser(user: IUser): Observable<any> {
    return this.authHttp.post(`${this.baseUrl}`, user)
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  removeUser(id: string): Observable<any> {
    return this.authHttp.post(`${this.baseUrl}/${id}/remove`, {})
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
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
