import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { from, groupBy, mergeMap, toArray } from 'rxjs';
import { Issue } from 'src/app/interfaces/issue';
import { Project } from 'src/app/interfaces/project';
import { IssuesService } from 'src/app/services/issues.service';
import { ProjectsService } from 'src/app/services/projects.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { BugTypeService } from 'src/app/services/bug-type.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent implements OnInit, OnChanges {
  projects!: Project[];
  issues!: Issue[];
  @Input() selectedProject!: Project;
  columns: Issue[][] = [];
  connectedList: string[] = [];
  status: string[] = [];
  filteredIssuesList!: Issue[];
  hoveredOn : number | null = null;
  newStatusBtnClicked : boolean = false;
  newStatus! : string;
  role! : number;

  constructor(
    private projectService: ProjectsService,
    private issuesService: IssuesService,
    public bugTypeService : BugTypeService,
    public authService : AuthService
  ) {}

  backgroundColor(bugType : string){
    return {'backgound-color' : 'this.bugTypeService.getColorFromTypeName(bugType)'};
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedProject != null) {
      this.filteredIssuesList = this.issues?.filter(
        (issue) => issue.project == this.selectedProject?.id
      );
    } else {
      console.log(this.selectedProject);
      this.filteredIssuesList = this.issues;
    }
    this.columns = [];
      this.projects?.[0].status.forEach((item) => {
        const data = this.filteredIssuesList.filter(
          (_item) => _item.status == item
        );
        this.columns.push(data);
      });
  }

  ngOnInit(): void {
    this.role = parseInt(this.authService.loggedInUser.role);
    console.log(this.authService.loggedInUser.team)
    var num = 0;
    this.issues = this.issuesService.issues;
    this.projects = this.projectService.projects;
    this.filteredIssuesList = this.issues;
    from(this.filteredIssuesList)
      .pipe(
        groupBy((issue) => issue.status),
        mergeMap((issue) => issue.pipe(toArray()))
      )
      .subscribe((issues) => {
        this.connectedList.push(num.toString());
        num = num + 1;
      });
    this.status = this.projects[0].status;
    this.projects[0].status.forEach((item) => {
      const data = this.filteredIssuesList.filter(
        (_item) => _item.status == item
      );
      this.columns.push(data);
    });
  }

  addStatus(){
    const project = this.selectedProject;
    project.status = [...project?.status , this.newStatus.toString().toLocaleUpperCase()];
    this.projectService.updateProject(project.id || "" , project).subscribe({
      next : (project : Project) => {
        this.projectService.refreshProjectListSubject.next("refresh");
      },
      error : err => console.log(err),
    })
  }

  removeStatus(i : number){
    const selectedStatus = this.status[i];
    const project = this.selectedProject;
    project.status = project.status.filter(item => item != selectedStatus);
    this.projectService.updateProject(project.id || "" , project).subscribe({
      next : (project : Project) => {
        this.projectService.refreshProjectListSubject.next("refresh");
      },
      error : err => console.log(err),
    })
  }

  public dropGrid(event: CdkDragDrop<Issue[]>): void {
    const status = this.status[event.previousIndex];
    this.status[event.previousIndex] = this.status[event.currentIndex];
    this.status[event.currentIndex] = status;
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  public drop(event: CdkDragDrop<Issue[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log("error");
      const issue: Issue = event.container.data[event.currentIndex];
      issue.status = this.status[parseInt(event.container.id)];
      this.issuesService.updateIssue(issue.id || '', issue).subscribe({
        next: () => {},
        error: (err) => console.log(err),
      });
    }
  }
}
