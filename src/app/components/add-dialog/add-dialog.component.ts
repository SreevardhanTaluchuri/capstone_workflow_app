import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Team } from 'src/app/interfaces/team';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { TeamService } from 'src/app/services/team.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
})
export class AddDialogComponent implements OnInit {
  form!: FormGroup;
  projectForm!: FormGroup;
  availableForManager!: User[];
  availableUsers: User[] = [];
  selectedUsers!: User[];
  teams!: Team[];
  role!: number;
  constructor(
    private dialogRef: MatDialogRef<AddDialogComponent>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA)
    public data: { page: string },

    private usersService: UsersService,
    private teamService: TeamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.data.page == 'team') {
      this.form = this.fb.group({
        name: ['', [Validators.required]],
        manager: ['', [Validators.required]],
        employees: [''],
        projects: this.fb.array([this.buildProjects()]),
      });
      this.availableForManager = this.usersService.users.filter(
        (user) => parseInt(user.role) == 1
      );
      this.availableUsers = this.usersService.users.filter(
        (user) => parseInt(user.role) == 1 && !user.team
      );

      this.form.get('manager')?.valueChanges.subscribe((manager) => {
        this.availableUsers = this.availableForManager.filter(
          (user) => user.name != manager && !user.team
        );
      });

      this.form.get('employees')?.valueChanges.subscribe((value) => {
        this.selectedUsers = value.map((item: string) => {
          return this.availableUsers.find((user) => user.name == item);
        });
      });
    }
    if (this.data.page == 'project') {
      this.projectForm = this.fb.group({
        name: ['', Validators.required],
        team: ['', Validators.required],
        employees: ['', Validators.required],
      });
      this.role = parseInt(this.authService.loggedInUser.role);
      if (this.role == 3) {
        this.teamService.getTeams().subscribe({
          next: (teams) => (this.teams = teams),
          error: (err) => console.log(err),
        });
      } else {
        this.teamService
          .getTeamUsingId(this.authService.loggedInUser.team)
          .subscribe({
            next: (team) => (this.teams = [team]),
            error: (err) => console.log(err),
          });
      }
      this.projectForm.get('team')?.valueChanges.subscribe((value) => {
        this.availableUsers = [];
        const teamFound = this.teams.filter((_team) => _team.name == value)[0];
        teamFound.employees.forEach((employee) => {
          this.usersService.getUserById(employee).subscribe({
            next: (employee) => this.availableUsers.push(employee),
          });
        });
      });
    }
  }

  get projects(): FormArray {
    return <FormArray>this.form.get('projects');
  }

  buildProjects(): FormGroup {
    return this.fb.group({
      name: '',
      employees: '',
    });
  }

  addProjects(): void {
    this.projects.push(this.buildProjects());
  }

  save() {
    if (this.data.page == 'team') {
      const formData: any = this.form.value;
      formData.manager = this.usersService.getUserByName(formData.manager)?.id;
      formData.employees = formData.employees.map(
        (employee: string) => this.usersService.getUserByName(employee)?.id
      );
      formData.projects = formData.projects.map((project: any) => {
        project.employees = project.employees.map(
          (employee: string) => this.usersService.getUserByName(employee)?.id
        );
        return project;
      });
      this.dialogRef.close(formData);
    }

    if (this.data.page == 'project') {
      const formData = this.projectForm.value;
      const teamFound = this.teams.filter(team => team.name == formData.team)[0];
      formData.team = teamFound.id;
      const employeesId : string[] = [];
      formData.employees = formData.employees.map((employee : string) => {
        const user = this.availableUsers.filter(user => user.name == employee)[0];
        employeesId.push(user.id || "");
      })
      formData.employees = employeesId;
      this.dialogRef.close(formData);
    }
  }
  dismiss() {
    this.dialogRef.close(null);
  }
}
