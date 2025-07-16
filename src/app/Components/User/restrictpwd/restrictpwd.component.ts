import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../pincode/pincode.component';

@Component({
  selector: 'app-restrictpwd',
  templateUrl: './restrictpwd.component.html',
  styleUrls: ['./restrictpwd.component.scss']
})
export class RestrictpwdComponent implements OnInit {


  constructor(
    private http:HttpClient,
    private app:AppComponent,
    private msg:NotificationService,
    public global:GlobalDataModule,
    private dialog:MatDialog
    
  ){}


  ngOnInit(): void {
    this.global.setHeaderTitle('Restriction Codes');
    this.getCodes();
  }

  password = '';
  restrictionCodeID = 0;


  codesList:any = [];

  getCodes(){
    this.http.get(environment.mainApi+this.global.userLink+'GetRestrictionCode').subscribe(
      (Response:any)=>{
        this.codesList = Response;

      }
    )
  }



  openPwdModal(item:any){
    this.restrictionCodeID = item.restrictionCodeID;
    this.global.openBootstrapModal('#pwdModal',true);
    setTimeout(() => {
       $('#pwd').trigger('select');
      $('#pwd').trigger('focus');
    }, 500);
  }


  updateCode(){
    if(this.password == '' || this.password == undefined){
      this.msg.WarnNotify('Enter Password');
      return;
    }
    this.global.closeBootstrapModal('#pwdModal',true);
    this.global.openPinCode().subscribe(pin=>{
      if(pin != ''){
        this.app.startLoaderDark()
        this.http.post(environment.mainApi+this.global.userLink+'UpdateRestrictionCode',{
          RestrictionCodeID: this.restrictionCodeID,
          Password: this.password,

          PinCode: pin,
          UserID: this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Updated Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.reset();
            }else{
              this.msg.WarnNotify(Response.msg);
               this.global.openBootstrapModal('#pwdModal',true);
            }

            this.app.stopLoaderDark()
          },
          (Error:any)=>{
             this.global.openBootstrapModal('#pwdModal',true);
          }
        )
      }
    })
  }


  resetCode(reqRestrictionCodeID:any){
    this.global.openPinCode().subscribe(pin=>{
      if(pin != ''){
        this.app.startLoaderDark()
        this.http.post(environment.mainApi+this.global.userLink+'ResetRestrictionCode',{
          RestrictionCodeID: reqRestrictionCodeID,
          PinCode: pin,
          UserID: this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Updated Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.reset();
            }else{
              this.msg.WarnNotify(Response.msg);
            }

            this.app.stopLoaderDark()
          }
        )
      }
    })
  }




  reset(){
    this.password = '';
    this.restrictionCodeID = 0;
  }


}



