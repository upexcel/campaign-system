import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(public localStorageService: LocalStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.localStorageService.getToken();

    if (accessToken && !req.url.includes('login') && !req.url.includes('notify') && !req.url.includes('unsub_status') && !req.url.includes('update_settings')) {
      req = req.clone({
        setParams: {
          accessToken
        }
      });
    }
    else {
      req = req.clone({
        headers: req.headers.set('SecretKey', 'MBw[;Rv]-6M]&3P2Grb'),
      })
    }

    return next.handle(req);
  }

}
