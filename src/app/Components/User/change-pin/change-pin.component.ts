import { Dialog } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-change-pin',
  templateUrl: './change-pin.component.html',
  styleUrls: ['./change-pin.component.scss']
})
export class ChangePINComponent implements OnInit {



  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<ChangePINComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private dialogue:MatDialog
  ){}
  ngOnInit(): void {
    
  }


  oldPin:any;
  newPin:any;

  changePin(){
    if(this.oldPin == '' || this.oldPin == undefined){
      this.msg.WarnNotify('Enter Old Pincode')
    }else if(this.newPin == '' || this.newPin == undefined){
      this.msg.WarnNotify('Enter New PinCode')
    }
    else {

      $('.loaderDark').show();

      this.http.post(environment.mainApi+this.global.userLink+'updatepin',{
        OldPin: this.oldPin,
        PinCode: this.newPin,
        UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Updated Successfully'){
            this.msg.SuccessNotify('Pincode Updated');
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
