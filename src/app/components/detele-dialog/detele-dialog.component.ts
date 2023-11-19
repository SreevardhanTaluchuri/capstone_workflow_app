import { Component , Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-detele-dialog',
  templateUrl: './detele-dialog.component.html',
  styleUrls: ['./detele-dialog.component.scss']
})
export class DeteleDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<DeteleDialogComponent>,
  ) {}

  delete(){
    this.dialogRef.close("delete");
  }
  
  cancel(){
    this.dialogRef.close(null);
  }

}
