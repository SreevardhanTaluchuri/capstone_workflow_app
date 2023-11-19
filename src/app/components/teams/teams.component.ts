import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Team } from 'src/app/interfaces/team';
import { ProjectsService } from 'src/app/services/projects.service';
import { TeamService } from 'src/app/services/team.service';
import { UsersService } from 'src/app/services/users.service';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { DeteleDialogComponent } from '../detele-dialog/detele-dialog.component';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  displayedColumns: string[] = [
    'S. no.',
    'Name',
    'Manager',
    'Employees',
    'Projects',
    'Actions'
  ];
  dataSource!: MatTableDataSource<Team>;
  teams!: Team[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private teamService: TeamService,
    public userService: UsersService,
    public projectService: ProjectsService,
    private dashboardService : DashboardService,
    public dialog: MatDialog,
  ) {}

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.teams);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getTeams(){
    this.teamService.getTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.dataSource = new MatTableDataSource(this.teams);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.log(err),
    });
  }

  ngOnInit(): void {
    this.getTeams();
  }

  deleteTeam(id : string){
    const dialogRef = this.dialog.open(DeteleDialogComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teamService.deleteTeam(id).subscribe({
          next : () => {
            this.dashboardService.refreshAppSubject.next('reload');
          },
          error : err => console.log(err),
        });
      }
    });
  }

  openAddTeamDialog(){
    const dialogRef = this.dialog.open(AddDialogComponent, {
      width: '450px',
      data: { page: 'team' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.teamService.addTeam(result).subscribe({
          next : () => {
            this.dashboardService.refreshAppSubject.next('reload');
          },
          error : err => console.log(err)
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
