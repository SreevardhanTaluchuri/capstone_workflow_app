import { Injectable } from '@angular/core';
import { Project } from '../interfaces/project';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private _projects! : Project[];
  refreshProjectListSubject = new Subject<string>();
  private _url : string = "http://localhost:5000/api/projects";

  constructor(private http : HttpClient) { }

  get projects() : Project[]{
    return this._projects;
  }

  getProjectsById(id : string){
    return this._projects.find(project => project.id == id);
  }

  getProjects(token : string) : Observable<Project[]>{
    return this.http.get<Project[]>(this._url , {
      headers : new HttpHeaders({
        "Authorization" : "Bearer "+token,
      })
    }).pipe(tap(
      projects => this._projects = projects
    ))
  }

  deleteProject(id : string) : Observable<Project>{
    return this.http.delete<Project>(this._url + "/"+id);
  }

  getProjectsInTeam(team : string) : Observable<Project[]> {
    return this.http.get<Project[]>(this._url+"/team/"+team).pipe(tap(
      projects => this._projects = projects
    ))
  }

  updateProject(id : string , project : Project) : Observable<Project>{
    return this.http.put<Project>(this._url+"/"+id , project);
  }

  addProject(project : Project) : Observable<Project>{
    return this.http.post<Project>(this._url , project);
  }
}
