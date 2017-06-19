import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

//Grab everything with import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {IPagedPrams, IPagedResults, IProperty, IUser} from '../shared/interfaces';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class PropertyService {

  baseUrl: string = '/api/properties';

  constructor(private http: Http, private authHttp: AuthHttp) {
  }

  getPropertiesPage(pageParam: IPagedPrams): Observable<IPagedResults<IProperty[]>> {

    let options = new RequestOptions({
      params: pageParam
    });

    return this.authHttp.get(`${this.baseUrl}/page`, options)
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  getPropertyDetail(id: string): Observable<IProperty> {
    return this.authHttp.get(`${this.baseUrl}/${id}`)
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  removeProperty(id: any) {
    return this.authHttp.post(`${this.baseUrl}/${id}/remove`, {})
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  saveProperty(property: IProperty): Observable<any> {
    return this.authHttp.post(`${this.baseUrl}`, property)
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
