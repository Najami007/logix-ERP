import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-update-subscription',
  templateUrl: './update-subscription.component.html',
  styleUrls: ['./update-subscription.component.scss']
})
export class UpdateSubscriptionComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<UpdateSubscriptionComponent>,
    public global:GlobalDataModule,
    public http:HttpClient,
    private msg:NotificationService
  ){}
  ngOnInit(): void {

    if(this.editData){
      this.message = this.editData.message;
      this.UserID = this.editData.UserID;
    }


    }
  UserID = 0;
  message = '';
  token = '';
  date = new Date();


  save(){

    if(this.token == '' || this.token == undefined){
      this.msg.WarnNotify('Enter Token')
    }else{

        $('.loaderDark').show();
        this.http.post(environment.mainApi+this.global.userLink+'updateUserSubscription',{
          UserID:this.UserID,
          Starting : this.global.encodeSubscriptionDate(this.date,''),
          Ending :this.token,
          CurrentUserID:this.UserID
         
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Updated Successfully'){
              this.msg.SuccessNotify('Subscription Updated');
              this.dialogRef.close('update');
            }
            else{
              this.msg.WarnNotify(Response.msg);
            }
            $('.loaderDark').fadeOut();
          },
          (Error:any)=>{
            this.msg.WarnNotify(Error);
            $('.loaderDark').fadeOut();
          }
        )
      
    
    }

  }


  closeDialogue(){
    this.dialogRef.close('');
  }


}
