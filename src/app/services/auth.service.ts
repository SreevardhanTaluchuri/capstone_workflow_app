import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Login, SignUp } from '../interfaces/user';
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _url: string = 'http://localhost:5000/api/auth/';
  loggedInUser = {
    email : '',
    team : "",
    _id : "",
    role : "",
  }

  private _token!: string;
  constructor(private http: HttpClient) {}

  get token(): string {
    return this._token;
  }

  set token(token : string){
    this._token = token;
  }

  signUp(user: SignUp): Observable<string> {
    return this.http
      .post<string>(this._url + 'register', user)
      .pipe(tap((token) => (this._token = token)));
  }

  login(user: Login): Observable<{message : string}> {
    return this.http
      .post<{message : string}>(this._url + 'login', user)
      .pipe(tap((token) => (this._token = token.message)));
  }

  getDecodedAccessToken(): any {
    try {
      this.loggedInUser = jwtDecode(this._token);
      return this.loggedInUser;
    } catch(Error) {
      return null;
    }
  }
}
