import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/interfaces/project';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  projects! : Project[];
  selectedProject! : Project;
  constructor(private projectService : ProjectsService){ }

  ngOnInit(): void {
    this.projects = this.projectService.projects;
    this.selectedProject = this.projects[0];
  }

  selectProject(event : string){
    this.selectedProject = this.projects.find(project => project.name == event) as Project;
  }

  addProject(){
    
  }

}
