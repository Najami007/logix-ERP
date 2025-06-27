import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent {

  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
    private route: Router,
    private app: AppComponent
  ) {

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })


  }
  ngOnInit(): void {
  }

  @Output() saveEventEmitter = new EventEmitter();

  actionbtn = 'Save';
  VehicleID: any = 0;

  VehicleName: any = '';
  VehicleNo: any = '';
  ContactNo: any = '';
  Description: any = '';



  save() {

    if (this.VehicleName == '') {
      this.msg.WarnNotify('Enter Vehicle Name');
      return;
    }
    if (this.VehicleNo == '') {
      this.msg.WarnNotify('Enter Vehicle No');
      return;
    }
    if (this.ContactNo == '') {
      this.msg.WarnNotify('Enter Contact No');
      return;
    }


    var postData = {
      VehicleID: this.VehicleID,
      VehicleName: this.VehicleName,
      VehicleNo: this.VehicleNo,
      ContactNo: this.ContactNo,
      Description: this.Description || '-',
      UserID: this.global.getUserID()
    }

   
    var url = '';
    if (this.VehicleID > 0) {
      url = 'UpdateVehicle';
      this.global.openPinCode().subscribe(
        pin => {
          if (pin != '') {
            postData['PinCode'] = pin;
            this.insert(url, postData)
          }
        }
      )
    } else {
      url = 'insertVehicle';
      this.insert(url, postData);
    }









  }


  insert(url: any, postData) {
     this.app.startLoaderDark();
    this.http.post(environment.mainApi + 'veh/' + url, postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.saveEventEmitter.emit();
        } else {
          this.msg.WarnNotify(Response.msg);
        }
        this.app.stopLoaderDark();
      },
      (Error: any) => {
        this.app.stopLoaderDark();
        console.log(Error);
      }
    )
  }

  reset() {
    this.VehicleID = 0;
    this.VehicleName = '';
    this.VehicleNo = '';
    this.ContactNo = '';
    this.Description = '';
    this.actionbtn = 'Save';


  }

}
