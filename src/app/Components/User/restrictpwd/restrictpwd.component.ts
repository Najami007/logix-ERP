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
    private global:GlobalDataModule,
    private dialog:MatDialog
    
  ){}


  ngOnInit(): void {
    this.global.setHeaderTitle('Restriction Password');
    this.getCodes();
  }

  password = '';
  restrictionCodeID = 0;


  codesList:any = [];

  getCodes(){
    this.http.get(environment.mainApi+this.global.userLink+'GetRestrictionCode').subscribe(
      (Response:any)=>{
        this.codesList = Response;
        console.log(Response)

      }
    )
  }





  updateCode(){
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
            }

            this.app.stopLoaderDark()
          }
        )
      }
    })
  }


  resetCode(){
    this.global.openPinCode().subscribe(pin=>{
      if(pin != ''){
        this.app.startLoaderDark()
        this.http.post(environment.mainApi+this.global.userLink+'ResetRestrictionCode',{
          RestrictionCodeID: this.restrictionCodeID,
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



