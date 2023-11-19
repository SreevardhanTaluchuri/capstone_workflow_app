import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm! : FormGroup;
  success : boolean = false;

  constructor(private authService : AuthService ,private fb: FormBuilder, private router : Router){ }

  passwordMatcher = (c : AbstractControl) : {[key : string] : boolean} | null => {
    const password = c.get('password');
    const confirmPassword = c.get('confirmPassword');
    if(confirmPassword?.pristine) return null;
    if(password?.value != confirmPassword?.value) {
      return {'match' : true}
    };
    return null;
  }

  validateAge = (c : AbstractControl) : {[key : string] : boolean} | null => {
    const age = c.get('age');
    if(age?.pristine) return null;
    if(parseInt(age?.value) < 18 && parseInt(age?.value) > 99) {
      return {'invalidAge' : true}
    };
    return null;
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3) , Validators.maxLength(30)]],
      email : ['' , [Validators.required , Validators.email]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },{validator : this.passwordMatcher}),
    });
  }

  save(){
    if(this.signUpForm.valid){
      const user = {
        name : this.signUpForm.get("name")?.value,
        email : this.signUpForm.get("email")?.value,
        password : this.signUpForm.get("passwordGroup.password")?.value,
      }
      this.authService.signUp(user).subscribe({
        next : res => {
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/sign-in'])
          },1000)
        },
        error : err => console.log(err)
      })
    }
  }

}
