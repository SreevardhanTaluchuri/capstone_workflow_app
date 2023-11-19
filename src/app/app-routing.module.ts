import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { dashboardGuard } from './components/dashboard/dashboard.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IssuesComponent } from './components/issues/issues.component';
import { HomeComponent } from './components/home/home.component';
import { TeamsComponent } from './components/teams/teams.component';
import { ProjectsComponent } from './components/projects/projects.component';

const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'issues',
        component: IssuesComponent,
      },
      {
        path : 'teams',
        component : TeamsComponent,
      },
      {
        path : 'projects',
        component : ProjectsComponent
      }
    ],
    canActivate: [dashboardGuard],
  },
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
