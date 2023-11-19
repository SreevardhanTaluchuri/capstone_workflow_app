import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { IssuesService } from 'src/app/services/issues.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/interfaces/user';
import { Issue } from 'src/app/interfaces/issue';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatAccordion } from '@angular/material/expansion';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss'],
})
export class IssuesComponent implements OnInit {
  users! : User[];
  issues! : Issue[];
  role! : number;
  issuesObservable! : Observable<Issue[]>;
  dataSource! : MatTableDataSource<Issue>;
  selectedIssue : Issue | null =  null;
  panelOpenState1 = false;
  panelOpenState2 = false;
  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private issuesService: IssuesService,
    private usersService : UsersService,
    private dashboardService : DashboardService
  ) {}

  ngOnInit(): void {
    this.role = parseInt(this.authService.loggedInUser.role);
    this.users = this.usersService.users;
    this.issues = this.issuesService.issues;
    this.selectedIssue = this.issues[0];
    this.dataSource = new MatTableDataSource<Issue>(this.issues);
    this.issuesObservable = this.dataSource.connect();
  }

  applyFilter(event : Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  expandTask(issue : Issue){
    this.selectedIssue = issue;
  }

  addIssue() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '450px',
      data : [ ...this.users.map(item => ({name : item.name , id : item.id}))
    ]});

    dialogRef.afterClosed().subscribe((result) => {
      this.issuesService.addIssue(result, this.authService.token).subscribe({
        next: (issue) => console.log(issue),
        error: (err) => console.log(err),
      });
      setTimeout(() => {
        this.dashboardService.refreshAppSubject.next("reload");
      },100);
    });
  }
}
