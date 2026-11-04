import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { error } from 'jquery';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { AddCustomerVehicleComponent } from './add-customer-vehicle/add-customer-vehicle.component';

export interface Mine {
  id: number;
  mineName: string;
  description: string;
}

@Component({
  selector: 'app-customer-vehicle',
  templateUrl: './customer-vehicle.component.html',
  styleUrls: ['./customer-vehicle.component.scss']
})
export class CustomerVehicleComponent implements OnInit {


  @ViewChild(AddCustomerVehicleComponent) addVehicle:any;

  public global = inject(GlobalDataModule);
  public http = inject(HttpClient);
  public app = inject(AppComponent);
  public msg = inject(NotificationService)


  page: number = 1;
  count: number = 0;

  tableSize: number = 0;
  tableSizes: any = [];
  jumpPage: any = 0;
  tmpPage: number = 0;

  onTableDataChange(event: any) {

    this.page = event;
    this.getSavedData();

  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getSavedData();

  }



  onProdSearchKeyup(e: any, value: any) {

    if (e.target.value.length == 0 && this.tmpPage == 0) {
      this.tmpPage = this.page;
      this.page = 1;
    }
    if (e.key == 'Backspace') {
      if (value.length == 1) {
        this.page = this.tmpPage;
        this.tmpPage = 0;
      }
    }


  }




  ngOnInit(): void {
    this.global.setHeaderTitle('Customer Vehicle');
    this.getSavedData();
      this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;
  }


 


  savedDataList: any = [];
  searchText = '';



  getSavedData() {
    var url = `${environment.mainApi + this.global.miningLink}GetCusVehicle`;
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.savedDataList = Response;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }




   edit(item: any): void {
    this.addVehicle.model = { cusVehID: item.cusVehID, cusVehName: item.cusVehName, cusVehNo: item.cusVehNo,cusVehCapacity:item.cusVehCapacity,cusVehSize:item.cusVehSize };
  }

  delete(item:any): void {
    var payload = {
      cusVehID: item.cusVehID,
      PinCode: '',
      UserId: this.global.getUserID(),
    }

    this.global.openPinCode().subscribe(pin=>{
      if(pin != ''){
        payload.PinCode = pin;
        this.saveMine('delete',payload);
      }
    })

  }

  saveMine(type: any, payload: any) {


    const insertType = {
       insert: 'InsertCusVehicle',
      update: 'UpdateCusVehicle',
      delete: 'DeleteCusVehicle',
    }[type];


    var url = `${environment.mainApi + this.global.miningLink}${insertType}`;

    console.log(url, payload);
    this.app.startLoaderDark();
    this.http.post(url, payload).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully'
            || Response.msg == 'Data Updated Successfully'
            || Response.msg == 'Data Deleted Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.getSavedData();
            this.addVehicle.resetForm();

          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
        },
        error: (error) => {
          console.log(error);
          this.app.stopLoaderDark();
        }
      }
    )

  }


}
