import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  signInForm!: FormGroup;

  constructor(private fb: FormBuilder , private router : Router,private authService : AuthService) {}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  save() {
    if (this.signInForm.valid) {
      this.authService.login(this.signInForm.value).subscribe({
        next : res => {
          localStorage.setItem("token" , res.message);
          this.router.navigate(['/dashboard/issues'])
        },
        error : err => console.log(err),
      })
    }
  }
}
