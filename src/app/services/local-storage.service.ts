import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setNavStatic(data) {
    localStorage.setItem('nav-static', JSON.stringify(data));
  }

  setClose(data) {
    localStorage.setItem('close', JSON.stringify(data));
  }

  setLoginDetails(token, email) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', JSON.stringify(email));
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  getNavStatic() {
    return JSON.parse(localStorage.getItem('nav-static') === 'undefined' ? 'false' : localStorage.getItem('nav-static'));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getClose() {
    return JSON.parse((localStorage.getItem('close')));
  }

  clearLocalStorage() {
    localStorage.clear();
  }

}
