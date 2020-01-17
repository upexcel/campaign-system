import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private http: HttpClient,
    public localStorageService: LocalStorageService
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!state.url.includes('login')) {
      if (this.loginToken()) {
        return true && this.checkAuth();
      } else {
        this.router.navigate(['login'])
        return false;
      }
    } else {
      if (this.loginToken()) {
        this.router.navigate(['dashboard'])
        return false;
      } else {
        return true;
      }
    }
  }

  loginToken() {
    return this.localStorageService.getToken();
  }

  async checkAuth() {
    try {
      const auth = await this.http.get(`${environment.apibase}/verify`).toPromise();
      if (!auth['status']) this.router.navigate(['login']);
      return auth['status'];
    } catch (error) {
      this.localStorageService.clearLocalStorage();
      this.router.navigate(['login']);
      return false;
    }
  }

}
