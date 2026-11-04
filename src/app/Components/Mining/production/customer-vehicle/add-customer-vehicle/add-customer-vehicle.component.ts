import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-customer-vehicle',
  templateUrl: './add-customer-vehicle.component.html',
  styleUrls: ['./add-customer-vehicle.component.scss']
})
export class AddCustomerVehicleComponent implements OnInit {


  public global = inject(GlobalDataModule);
  public http = inject(HttpClient);
  public app = inject(AppComponent);
  public msg = inject(NotificationService)

    @Output() updateEmitter = new EventEmitter();



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
    this.global.setHeaderTitle('Mine');
    this.getSavedData();
      this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;
  }


  model = this.blankModel();

  blankModel() {
    return { cusVehID: 0, cusVehName: '', cusVehNo: '',cusVehSize:'',cusVehCapacity:'' };
  }

  get editMode():boolean{
    return this.model.cusVehID > 0;
  }

  savedMines: any = [];
  searchText = '';



  getSavedData() {
    var url = `${environment.mainApi + this.global.miningLink}GetMine`;
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.savedMines = Response;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }


  onSubmit(): void {

    if (this.model.cusVehName == '') {
      this.msg.WarnNotify("Enter Vehicle Name");
      return;
    }
    if (this.model.cusVehNo == '') {
      this.msg.WarnNotify("Enter Vehicle No.");
      return;
    }
    if (this.model.cusVehCapacity == '') {
      this.msg.WarnNotify("Enter Vehicle Capacity");
      return;
    }
    if (this.model.cusVehSize == '') {
      this.msg.WarnNotify("Enter Vehicle Size");
      return;
    }


    var payload = {
      cusVehID: this.model.cusVehID,
      cusVehName: this.model.cusVehName,
      cusVehNo: this.model.cusVehNo || '-',
      cusVehSize:this.model.cusVehSize,
      cusVehCapacity:this.model.cusVehCapacity,
      PinCode: '',
      UserId: this.global.getUserID(),

    }


    if (this.model.cusVehID > 0) {
      this.global.openPinCode().subscribe(pin => {
        if (pin != '') {
          payload.PinCode = pin;
          this.save('update', payload);
        }
      })
    } else {
      this.save('insert', payload)
    }

    // TODO: call your service here instead of using the local array

  }


  save(type: any, payload: any) {


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
            this.updateEmitter.emit();
            this.resetForm();

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





  resetForm(): void {

    this.model = this.blankModel();
  }
}
