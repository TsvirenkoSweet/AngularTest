import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import {Observable} from 'rxjs'
import {AuthService} from "../services/auth.service";
import {Injectable} from "@angular/core";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string | null= this.authService.getAccessToken();

    if (token) {
      req = req.clone({headers: req.headers.append('Authorization', `Bearer ${token}`)});
    }

    return next.handle(req);
  }
}
