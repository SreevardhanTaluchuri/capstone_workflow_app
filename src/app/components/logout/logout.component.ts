import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(private dialogRef: MatDialogRef<LogoutComponent>,){}

  logout(){
    this.dialogRef.close("close");
  }

  cancel(){
    this.dialogRef.close(null);
  }

}
