import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AddTeam, Team } from '../interfaces/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private _url = "http://localhost:5000/api/teams";
  constructor(private http : HttpClient) { }
  team! : Team;
  teams! : Team[];

  getTeamUsingId(id : string) : Observable<Team>{
    console.log(id);
    return this.http.get<Team>(this._url+"/"+id).pipe(
      tap(team =>{
        this.team = team;
      })
    );
  }

  addTeam(team : AddTeam){
    console.log(team);
    return this.http.post(this._url , team);
  }

  getTeams() : Observable<Team[]>{
    return this.http.get<Team[]>(this._url).pipe(tap(
      teams => this.teams = teams
    ))
  }

  deleteTeam(id : string) : Observable<Team>{
    return this.http.delete<Team>(this._url+"/"+id);
  }

}
