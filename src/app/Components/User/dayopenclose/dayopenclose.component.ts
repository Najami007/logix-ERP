import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../pincode/pincode.component';

@Component({
  selector: 'app-dayopenclose',
  templateUrl: './dayopenclose.component.html',
  styleUrls: ['./dayopenclose.component.scss']
})
export class DayopencloseComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private global: GlobalDataModule,
    private app: AppComponent,
    private msg: NotificationService,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.global.setHeaderTitle('Day Open / Close')
  }

  Type = '';
  date: Date = new Date();

  save() {

    if (this.Type == 'Day Open') {

      this.global.openPassword('Password').subscribe(pin => {
        if (pin !== '') {
          this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
            RestrictionCodeID: 4,
            Password: pin,
            UserID: this.global.getUserID()

          }).subscribe(
            (Response: any) => {
              if (Response.msg == 'Password Matched Successfully') {

                this.app.startLoaderDark();
                this.http.post(environment.mainApi + this.global.userLink + '_dayOpen', {
                  DayOpenDate: this.global.dateFormater(this.date, '-'),
                  UserID: this.global.getUserID()
                }).subscribe(
                  (Response: any) => {
                    if (Response.msg == 'Data Saved Successfully') {
                      this.msg.SuccessNotify(Response.msg);
                      this.date = new Date();
                    } else {
                      this.msg.WarnNotify(Response.msg);
                    }

                    this.app.stopLoaderDark();

                  }
                )

              } else {
                this.msg.WarnNotify(Response.msg);
              }
            }
          )



        }
      })



    }



    if (this.Type == 'Day Close') {
      this.global.openPassword('Password').subscribe(pin => {
        if (pin !== '') {
          this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
            RestrictionCodeID: 4,
            Password: pin,
            UserID: this.global.getUserID()

          }).subscribe(
            (Response: any) => {
              if (Response.msg == 'Password Matched Successfully') {
                this.app.startLoaderDark();
                this.http.post(environment.mainApi + this.global.userLink + '_dayClose', {
                  DayOpenDate: this.global.dateFormater(this.date, '-'),
                  UserID: this.global.getUserID()
                }).subscribe(
                  (Response: any) => {
                    if (Response.msg == 'Data Updated Successfully') {
                      this.msg.SuccessNotify(Response.msg);
                      this.date = new Date();
                    } else {
                      this.msg.WarnNotify(Response.msg);
                    }

                    this.app.stopLoaderDark();
                  }
                )

              } else {
                this.msg.WarnNotify(Response.msg);
              }
            }
          )



        }
      })






    }




  }


  postingRemarks: any;
  projectID = this.global.InvProjectID;




  postBills() {
    if(this.postingRemarks ==  '' || this.postingRemarks == undefined){
      this.msg.WarnNotify('Enter Posting Remarks')
    }else{
      this.global.openPinCode().subscribe(pin => {
        if (pin !== '') {
          this.app.startLoaderDark();
          this.http.post(environment.mainApi + this.global.userLink + 'PostBills', {
            Remarks: this.postingRemarks,
            ProjectID: this.projectID,
            PinCode: pin,
            UserID: this.global.getUserID()
          }).subscribe(
            (Response: any) => {
              if (Response.msg == 'Data Posted Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.postingRemarks = '';
              } else {
                this.msg.WarnNotify(Response.msg);
              }
  
              this.app.stopLoaderDark();
            }
          )
        }
      })
    }
  }


}
