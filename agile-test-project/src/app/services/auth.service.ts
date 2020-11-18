import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';

const auth = 'http://interview.agileengine.com/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  public accessToken: BehaviorSubject<string> = new BehaviorSubject(localStorage.getItem('_idToken'));
  private isLogin: boolean;

  constructor(private apiService: ApiService) { }

  singIn(): void {
    if (!this.isLogin) {
      this.generateToken('23567b218376f79d9415').subscribe((res: { token: string }) => {
        localStorage.setItem('_idToken', res.token);
        this.isLogin = true;
        this.accessToken.next('true');
      });
    }
  }

  getAccessToken(): string {
    return localStorage.getItem('_idToken');
  }

  generateToken(apiKey): Observable<any> {
    return this.apiService.postApi(auth, {apiKey});
  }
}
