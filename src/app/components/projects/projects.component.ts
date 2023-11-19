import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Issue } from 'src/app/interfaces/issue';
import { Project } from 'src/app/interfaces/project';
import { User } from 'src/app/interfaces/user';
import { IssuesService } from 'src/app/services/issues.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { UsersService } from 'src/app/services/users.service';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DeteleDialogComponent } from '../detele-dialog/detele-dialog.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  displayedColumns: string[] = [
    'S. no.',
    'Name',
    'Tasks',
    'Employees',
    'Actions',
  ];
  dataSource!: MatTableDataSource<Project>;
  projects!: Project[];
  tasks: { [key: string]: Issue[] } = {};
  employees: { [key: string]: User[] } = {};
  isLoading: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private projectsService: ProjectsService,
    private issuesService: IssuesService,
    private usersService: UsersService,
    private dashboardService: DashboardService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.projects);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.projectsService.getProjects(this.authService.token).subscribe({
      next: (projects) => {
        this.projects = projects;
        this.dataSource = new MatTableDataSource(this.projects);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.projects.forEach((project, i) => {
          project.employees.forEach((employee, index) => {
            this.usersService.getUserById(employee).subscribe({
              next: (user) => {
                this.employees[project.name] = this.employees[project.name]
                  ? [...this.employees[project.name], user]
                  : [user];
                if (index == project.employees.length - 1 && i == projects.length -1 ) {
                  this.isLoading = this.isLoading + 1;
                }
              },
              error: (err) => console.log(err),
            });
          });
          project.tasks.forEach((task, index) => {
              this.issuesService.getIssueById(task).subscribe({
                next: (task) => {
                  this.tasks[project.name] = this.tasks[project.name]
                    ? [...this.tasks[project.name], task]
                    : [task];
                },
              });
          });
        });
      },
      error: (err) => console.log(err),
    });
  }

  deleteProject(id: string) {
    const dialogRef = this.dialog.open(DeteleDialogComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectsService.deleteProject(id).subscribe({
          next: () => {
            this.dashboardService.refreshAppSubject.next('reloadData');
          },
          error: (err) => console.log(err),
        });
      }
    });
  }

  openAddProjectDialog() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      width: '450px',
      data: { page: 'project' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectsService.addProject(result).subscribe({
          next: () => {
            this.dashboardService.refreshAppSubject.next('reloadApp');
          },
          error: (err) => console.log(err),
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource._filterData);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
