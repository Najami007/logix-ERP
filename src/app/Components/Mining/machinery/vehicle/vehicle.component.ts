import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { SavedVehiclesComponent } from './saved-vehicles/saved-vehicles.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {

  @ViewChild(SavedVehiclesComponent) savedVehicleComp: any;
  @ViewChild(AddVehicleComponent)    addVehicleForm:any;



  page: number = 1;
  count: number = 0;

  tableSize: number = 10;
  tableSizes: any = [];

  onTableDataChange(event: any) {

    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  crudList: any = { c: true, r: true, u: true, d: true };


  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
    private app: AppComponent,
    private route: Router
  ) {

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Vehicle');
    this.getVehileList();
  }

  selectedTab = 0;

  vehicleList: any = [];

  getVehileList() {

    var url = `${environment.mainApi + this.global.miningLink}GetVehicle?VehicleID=0`

    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.vehicleList = Response;
        },
        error: (error: any) => {
          console.log('error occured while loading vehicle list' + error);
        }
      }
    )

  }



  saveVehicle(type: any, payload: any) {

    const insertType = {
      insert: 'InsertVehicle',
      update: 'UpdateVehicle',
      delete: 'DeleteVehicle'
    }[type];


    var url = `${environment.mainApi + this.global.miningLink}${insertType}`;

    console.log(url,payload);

    this.http.post(url, payload).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully'
            || Response.msg == 'Data Updated Successfully'
            || Response.msg == 'Data Deleted Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.getVehileList();
            this.addVehicleForm.onCancel()
          } else {
            this.msg.WarnNotify(Response.msg);
          }
        }
      }
    )

  }


  editVehicle(item:any){

    this.addVehicleForm.editVehicle(item);
    this.changeTab(0)

  }




  changeTab(index: any) {
    this.selectedTab = index;
  }


}
