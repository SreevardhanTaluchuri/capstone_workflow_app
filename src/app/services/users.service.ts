import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _users : User[] = [];

  private _url = "http://localhost:5000/api/user";

  constructor(private http : HttpClient) { }

  get users() : User[]{
    return this._users;
  }

  getUserByName(name : string) : User | undefined{
    return this.users.find(user => user.name == name);
  }

  getUserById(id : string) : Observable<User>{
    return this.http.get<User>(this._url+"/"+id);
  }

  getUserFromId(id : string ) : User | undefined{
    return this._users.find((user) => user.id == id);
  }


  getUsers() : Observable<User[]>{
    return this.http.get<User[]>(this._url).pipe(tap(
      users => this._users = users
    ));
  }
}
