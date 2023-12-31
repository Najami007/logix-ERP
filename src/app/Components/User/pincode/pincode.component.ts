import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.scss']
})
export class PincodeComponent implements OnInit{

  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<PincodeComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService
  ){}

  ngOnInit(): void {
   
  }




  pinCode:any = '';

  save(){

    // alert(this.pinCode);
    if(this.pinCode == "" || this.pinCode == undefined){
      this.msg.WarnNotify('Enter PinCode')
    }else{
      this.dialogRef.close(this.pinCode);
    }

   
  }


  closeDialogue(){
    this.dialogRef.close('');
  }


}
