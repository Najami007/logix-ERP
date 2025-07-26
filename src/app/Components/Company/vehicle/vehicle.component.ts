import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent {

  @ViewChild(AddVehicleComponent) addVehicle: any;

  crudList:any = {c:true,r:true,u:true,d:true};
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
    private app: AppComponent,
        private route:Router
  ) {
      this.global.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      })

  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Vehicle');
    this.getSavedData();
  }


  savedDataList: any = [];

  getSavedData() {
    this.http.get(environment.mainApi + 'veh/getVehicle').subscribe(
      (Response: any) => {
        this.savedDataList = Response;
      }
    )
  }


  edit(item: any) {
    this.addVehicle.VehicleID = item.vehicleID;
    this.addVehicle.VehicleName = item.vehicleName;
    this.addVehicle.VehicleNo = item.vehicleNo;
    this.addVehicle.ContactNo = item.contactNo;
    this.addVehicle.actionbtn = 'Update';
  }


  delete(item: any) {
    var postData = {
      VehicleID: item.vehicleID,
      UserID: this.global.getUserID(),

    }

    this.global.openPinCode().subscribe(
      pin => {
        if (pin != '') {

          postData['PinCode'] = pin;
          this.app.startLoaderDark();

          this.http.post(environment.mainApi + 'veh/deleteVehicle', postData).subscribe(
            (Response: any) => {
              if (Response.msg == 'Data Deleted Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.getSavedData();
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
      }
    )


  }

}
