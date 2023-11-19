import { Component, OnInit } from '@angular/core';
import { SignUp } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { IssuesService } from 'src/app/services/issues.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { TeamService } from 'src/app/services/team.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  apiLoaded: number = 0;
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private issuesService: IssuesService,
    private projectsService: ProjectsService,
    private teamService: TeamService,
    private dashboardService: DashboardService
  ) {}

  getIssues() {
    this.issuesService.getIssues(this.authService.token).subscribe({
      next: () => {
        this.apiLoaded = this.apiLoaded + 1;
      },
      error: (err) => console.log(err),
    });
  }

  getUsers() {
    this.usersService.getUsers().subscribe({
      next: () => (this.apiLoaded = this.apiLoaded + 1),
      error: (err) => console.log(err),
    });
  }

  getProjects() {
    if (
      this.authService.loggedInUser.team &&
      parseInt(this.authService.loggedInUser.role) == 1
    ) {
      this.projectsService
        .getProjectsInTeam(this.authService.loggedInUser.team)
        .subscribe({
          next: () => (this.apiLoaded = this.apiLoaded + 1),
          error: (err) => console.log(err),
        });
    } else {
      this.projectsService.getProjects(this.authService.token).subscribe({
        next: () => (this.apiLoaded = this.apiLoaded + 1),
        error: (err) => console.log(err),
      });
    }
  }

  refreshIssuesList() {
    this.issuesService.refreshIssuesListSubject.subscribe({
      next: () => {
        this.apiLoaded = 2;
        setTimeout(() => {
          this.getIssues();
        }, 100);
      },
    });
    this.projectsService.refreshProjectListSubject.subscribe({
      next: () => {
        this.apiLoaded = 2;
        setTimeout(() => {
          this.getProjects();
        }, 100);
      },
    });
  }

  getTeam() {
    this.teamService
      .getTeamUsingId(this.authService.loggedInUser.team)
      .subscribe({
        next: () => {},
        error: (err) => console.log(err),
      });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getProjects();
    this.getTeam();
    this.refreshIssuesList();
    this.getIssues();

    this.dashboardService.refreshAppSubject.subscribe({
      next: (event) => {
        this.apiLoaded = 0;
        this.getUsers();
        this.getProjects();
        this.getTeam();
        this.refreshIssuesList();
        this.getIssues();
      },
    });
  }
}
