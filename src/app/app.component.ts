import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'task-app';

  constructor(private authService : AuthService , private router : Router){ }

  ngOnInit(): void {
    const token = localStorage.getItem("token");
    if(token){
      this.authService.token = token;
      console.log(this.authService.getDecodedAccessToken());
    }
  }
}
