import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { LogoutComponent } from '../logout/logout.component';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

const SMALL_WIDTH_BREAKPOINT = 768;
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnChanges {
  opened!: boolean;
  isScreenSmall!: boolean;
  role! : number;
  @Input() apiloaded: number = 0;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  constructor(
    private _breakPointObserver: BreakpointObserver,
    public userService: UsersService,
    private authService : AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnChanges() {}

  logOut() {
    const dialogRef = this.dialog.open(LogoutComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        localStorage.clear();
        this.router.navigate(['/signin']);
      }
    });
  }

  ngOnInit(): void {
    const {role} = this.authService.getDecodedAccessToken();
    this.role = parseInt(role);
    this._breakPointObserver
      .observe([`(max-width : ${SMALL_WIDTH_BREAKPOINT}px)`])
      .subscribe((state: BreakpointState) => {
        this.isScreenSmall = state.matches;
      });

    this.router.events.subscribe(() => {
      if (this.isScreenSmall) {
        this.sidenav.close();
      }
    });
  }
}
