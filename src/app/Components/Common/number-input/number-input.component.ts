import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent implements OnInit{

  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<NumberInputComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService
  ){}
  ngOnInit(): void {
   
  }


  Number:any;
  change(){
  }

  
  save(){

    // alert(this.pinCode);
    if(this.Number == "" || this.Number == undefined){
      this.msg.WarnNotify('Enter Number')
    }else{
      this.dialogRef.close(this.Number);
    }

   
  }


  closeDialogue(){
    this.dialogRef.close('');
  }


}
