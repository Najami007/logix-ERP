import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../pincode/pincode.component';
import Swal from 'sweetalert2';

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
  ) {


      ///////////// will Check day is opened or not
    
      
   }


   openStatus = true;
   dataRow:any = [];

  disableDOCPwdFeature = this.global.disableDOCPwdFeature;


  ngOnInit(): void {
    this.global.setHeaderTitle('Day Open / Close');
      this.global.getCurrentOpenDay().subscribe(
          (Response: any) => {
          

            if(Response.length > 0){
               this.openStatus = true;
              this.dataRow = Response;
            }else{
              this.openStatus = false;
            }
          }
        )
  }

  Type = '';
  date: Date = new Date();

  save() {

    if (this.Type == 'Day Open') {

       if (this.disableDOCPwdFeature) {
        Swal.fire({
          title: 'Alert!',
          text: 'Confirm To Open Day',
          position: 'center',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
        }).then((result) => {
          if (result.isConfirmed) {

            //////on confirm button pressed the api will run

            this.dayOpenClose('Open')
           
          }
        });

        return;

      }

      this.global.openPassword('Password').subscribe(pin => {
        if (pin !== '') {
          this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
            RestrictionCodeID: 4,
            Password: pin,
            UserID: this.global.getUserID()

          }).subscribe(
            (Response: any) => {
              if (Response.msg == 'Password Matched Successfully') {

                this.dayOpenClose('Open')

              } else {
                this.msg.WarnNotify(Response.msg);
              }
            }
          )



        }
      })



    }



    if (this.Type == 'Day Close') {

      if (this.disableDOCPwdFeature) {
        Swal.fire({
          title: 'Alert!',
          text: 'Confirm To Close Day',
          position: 'center',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
        }).then((result) => {
          if (result.isConfirmed) {

            //////on confirm button pressed the api will run

            this.dayOpenClose('Close')
          }
        });

        return;

      }

      this.global.openPassword('Password').subscribe(pin => {
        if (pin !== '') {
          this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
            RestrictionCodeID: 4,
            Password: pin,
            UserID: this.global.getUserID()

          }).subscribe(
            (Response: any) => {
              if (Response.msg == 'Password Matched Successfully') {
                this.dayOpenClose('Close')

              } else {
                this.msg.WarnNotify(Response.msg);
              }
            }
          )



        }
      })






    }




  }

  dayOpenClose(type: any) {

    var url = type == 'Open' ? '_dayOpen' : '_dayClose'

    this.app.startLoaderDark();
    this.http.post(environment.mainApi + this.global.userLink + url, {
      DayOpenDate: this.global.dateFormater(this.date, '-'),
      UserID: this.global.getUserID()
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.date = new Date();
           this.ngOnInit();
        } else {
          this.msg.WarnNotify(Response.msg);
        }

        this.app.stopLoaderDark();

      }
    )

  }




  postingRemarks: any;
  projectID = this.global.InvProjectID;




  postBills() {
    if (this.postingRemarks == '' || this.postingRemarks == undefined) {
      this.msg.WarnNotify('Enter Posting Remarks')
    } else {
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
