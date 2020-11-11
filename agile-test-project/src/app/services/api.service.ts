import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient) { }

  getApi(_url, _body?: any): Observable<any> {
    return this._http.get(_url, _body)
  }

  postApi(_url, _body?: any) {
    return this._http.post(_url, _body)
  }
}
