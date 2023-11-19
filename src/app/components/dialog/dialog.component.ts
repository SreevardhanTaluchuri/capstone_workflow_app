import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Issue } from 'src/app/interfaces/issue';
import { Project } from 'src/app/interfaces/project';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { TeamService } from 'src/app/services/team.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  projects!: Project[];
  issue: Issue = {
    title: '',
    description: '',
    due_date: '',
    priority: '',
    status: '',
    assignee: '',
    points: 0,
    reporter: '',
    project: '',
    type: '',
  };
  status!: string[];
  reporter!: User;
  role!: number;

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public users: User[],
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private teamService: TeamService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.role = parseInt(this.authService.loggedInUser.role);
    if (this.authService.loggedInUser.team)
      this.projects = this.projectsService.projects.filter((project) =>
        project.employees.find(
          (employee) => employee == this.authService.loggedInUser._id
        )
      );
    else {
      if (this.role < 2) {
        this.usersService
          .getUserById(this.authService.loggedInUser._id)
          .subscribe({
            next: (user) => {
              this.reporter = user;
              this.users = [user];
            },
            error: (err) => console.log(err),
          });
        this.projects = this.projectsService.projects.filter((project) =>
          project.employees.find(
            (employee) => employee == this.authService.loggedInUser._id
          )
        );
        this.status = this.projects[0].status;
      } else {
        this.projects = this.projectsService.projects;
      }
    }
  }

  findProjectByName = (name: string) =>
    this.projectsService.projects.find((item) => item.name == name);

  updateOptions(event: string) {
    const projectFound = this.findProjectByName(event) as Project;
    if (projectFound) this.status = projectFound.status;
    if (projectFound) {
      this.users = [];
      for (var i = 0, len1 = this.usersService.users.length; i < len1; i++) {
        for (var j = 0, len2 = projectFound.employees.length; j < len2; j++) {
          if (this.usersService.users[i].id === projectFound.employees[j]) {
            this.users.push(this.usersService.users[i]);
          }
        }
      }
    }
    if (this.authService.loggedInUser.team) {
      this.teamService
        .getTeamUsingId(this.authService.loggedInUser.team)
        .subscribe({
          next: (team) => {
            this.usersService.getUserById(team.manager).subscribe({
              next: (user) => (this.reporter = user),
              error: (err) => console.log(err),
            });
          },
        });
    } else {
      this.usersService
        .getUserById(this.authService.loggedInUser._id)
        .subscribe({
          next: (user) => (this.reporter = user),
          error: (err) => console.log(err),
        });
    }
  }

  addIssue() {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.issue.due_date = new Date(this.issue.due_date)
          .valueOf()
          .toString();
        const assigneeFound = users.filter(
          (user) => user.name == this.issue.assignee
        )[0];
        this.issue.assignee = assigneeFound
          ? (assigneeFound?.id?.toString() as string)
          : '';

        if (this.authService.loggedInUser.team == '') {
          console.log('HIIII');
          this.issue.project = this.projects[0].id as string;
          console.log(this.issue.project);
        } else {
          const projectFound = this.findProjectByName(
            this.issue.project
          ) as Project;
          this.issue.project = projectFound.id as string;
        }
        const reporterFound = users.filter(
          (user) => user.name == this.issue.reporter
        )[0];
        this.issue.reporter = reporterFound
          ? (reporterFound?.id?.toString() as string)
          : '';

        // console.log(this.issue);
        this.dialogRef.close({
          ...this.issue,
        });
      },
    });
  }
}
