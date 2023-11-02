import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import * as $ from 'jquery';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit{

  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private dialogue:MatDialog
  ){}
  ngOnInit(): void {
    
  }


  password:any;
  pinCode:any;

  changePassword(){
    if(this.password == '' || this.password == undefined){
      this.msg.WarnNotify('Enter Password')
    }else if(this.pinCode == '' || this.pinCode == undefined){
      this.msg.WarnNotify('Enter PinCode')
    }
    else {

      $('.loaderDark').show();

      this.http.post(environment.mainApi+'user/changepassword',{
        Password:this.password,
        PinCode: this.pinCode,
        UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Updated Successfully'){
            this.msg.SuccessNotify('Password Updated');
            this.dialogRef.close();
            $('.loaderDark').fadeOut();
            
          }else{
            this.msg.WarnNotify(Response.msg);
            $('.loaderDark').fadeOut();
          }
        }
      )

    }
  }


  closeDialogue(){
    this.dialogRef.close();
  }

}
