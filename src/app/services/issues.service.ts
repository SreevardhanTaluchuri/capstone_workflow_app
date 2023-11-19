import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Issue } from '../interfaces/issue';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  private _issues! : Issue[];
  refreshIssuesListSubject = new Subject<string>();

  private _url = "http://localhost:5000/api/issues";

  constructor(private http : HttpClient) { }

  get issues() : Issue[]{
    return this._issues;
  }

  addIssue(issue : Issue , token : string): Observable<Issue>{
    return this.http.post<Issue>(this._url , issue ,{
      headers : new HttpHeaders({
        "Authorization" : "Bearer "+token,
      })
    })
  }

  getIssues(token : string) : Observable<Issue[]>{
    return this.http.get<Issue[]>(this._url,{
      headers : new HttpHeaders({
        "Authorization" : "Bearer "+token,
      })
    }).pipe(tap(
      issues => this._issues = issues
    ))
  }

  getIssueById(id : string) : Observable<Issue>{
    return this.http.get<Issue>(this._url + "/"+id);
  }

  updateIssue(id : string , issue : Issue) : Observable<Issue>{
    return this.http.put<Issue>(this._url+"/"+id , issue);
  }

}
