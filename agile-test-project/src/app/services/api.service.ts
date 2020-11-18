import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public getApi(url: string, body?: any): Observable<any> {
    return this.http.get(url, body)
      .pipe(
      catchError(error => {
        if (error.statusText === 'Unauthorized') {
          // TODO redirect to home page
        }
        return throwError(error.message);
      })
    );
  }

  public postApi(url: string, body?: any): Observable<any> {
    return this.http.post(url, body);
  }
}
