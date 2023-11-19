import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IssuesComponent } from './components/issues/issues.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { DialogComponent } from './components/dialog/dialog.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { PriorityComponent } from './components/priority/priority.component';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import { HomeComponent } from './components/home/home.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LogoutComponent } from './components/logout/logout.component';
import { ConvertDatePipe } from './shared/convertDate';
import { TeamsComponent } from './components/teams/teams.component';
import { AddDialogComponent } from './components/add-dialog/add-dialog.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { DeteleDialogComponent } from './components/detele-dialog/detele-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    DashboardComponent,
    IssuesComponent,
    DialogComponent,
    SidenavComponent,
    ToolbarComponent,
    PriorityComponent,
    KanbanBoardComponent,
    HomeComponent,
    LogoutComponent,
    ConvertDatePipe,
    TeamsComponent,
    AddDialogComponent,
    ProjectsComponent,
    DeteleDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
