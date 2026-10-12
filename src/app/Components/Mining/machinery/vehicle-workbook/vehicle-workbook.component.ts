import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment.development';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-vehicle-workbook',
  standalone: false,
  templateUrl: './vehicle-workbook.component.html',
  styleUrls: ['./vehicle-workbook.component.scss'],
})
export class VehicleWorkbookComponent implements OnInit {

  private readonly snackBar = inject(MatSnackBar);

  public readonly global = inject(GlobalDataModule);
  public readonly http = inject(HttpClient);
  public readonly msg = inject(NotificationService);
  public readonly app = inject(AppComponent)


  @ViewChild('entryForm') entryForm?: NgForm;

  selectedTab = 0;
  // ---- Form (template-driven, bound with [(ngModel)]) ----
  model = this.blankModel();
  vehicleOptions: any = [];
  vehicles: any[] = [];

  // ---- Saved records ----
  vehicleFilterOptions: any = [];
  search = '';
  FilterVehicleID: number = 0;
  // fromDate: Date | null = null;
  // toDate: Date | null = null;
  curDate = new Date();
  fromDate: any =  this.setDates('start');
  toDate: any =this.setDates('end');


  setDates(type: 'start' | 'end'): Date {
    const y = this.curDate.getFullYear();
    const m = this.curDate.getMonth();

    return type === 'start'
      ? new Date(y, m, 1)        // first day of the month
      : new Date(y, m + 1, 0);   // day 0 of next month = last day of this month
  }

  constructor() {

  }
  ngOnInit(): void {

    this.global.setHeaderTitle("Work Book")
    this.getVehileList();
    this.getWorkbookList();
    this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;
  }


  ////////////////// Pagination Configurations ///////////////////


  page: number = 1;
  count: number = 0;

  tableSize: number = 0;
  tableSizes: any = [];
  jumpPage: any = 0;
  tmpPage: number = 0;

  onTableDataChange(event: any) {

    this.page = event;
    this.getWorkbookList();
    setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getWorkbookList();
    setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  goToPage(): void {
    var count = this.workBookList.length / this.tableSize;
    if (parseFloat(this.jumpPage) > count) {
      this.msg.WarnNotify('Invalid Value')
      return;
    }

    if (this.jumpPage >= 1) {
      this.page = this.jumpPage;
      this.getWorkbookList();
      setTimeout(() => {
        this.applyFilters();
      }, 500);
    }
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



  //////////////////// Pagination Configuration End ////////////////////////





  get isEditing(): boolean {
    return this.model.VehicleWorkBookID > 0;
  }

  get hasFilters(): boolean {
    return this.search.trim() !== '' || this.FilterVehicleID !== 0 ;
  }



  // ================= Form =================

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.snackBar.open('Fix the highlighted fields to save this entry.', 'Dismiss', { duration: 4000 });
      return;
    }



    var data: any = this.model;

    if (!data.vehicleID) {
      this.msg.WarnNotify('Select Vehicle');
      return;
    }

    const workingHour = Number(data.workingHour);
    if (data.workingHour === '' || data.workingHour == null || isNaN(workingHour) || workingHour <= 0) {
      this.msg.WarnNotify('Enter valid working hours');
      return;
    }

    if (!data.workDate) {
      this.msg.WarnNotify('Select work date');
      return;
    }


    var payLoad = {
      VehicleWorkBookID: data.vehicleWorkBookID ?? 0,
      VehicleID: data.vehicleID,
      WorkingHour: workingHour,
      Description: (data.description ?? '').trim(),
      PinCode: '',
      workDate: this.global.dateFormater(data.workDate, ''),
      userID: this.global.getUserID()
    };

    if (data.vehicleWorkBookID > 0) {
      this.global.openPinCode().subscribe(pin => {
        if (pin != '') {
          payLoad.PinCode = pin;
          this.saveWorkBook('update', payLoad);
        }
      })
    } else {
      this.saveWorkBook('insert', payLoad)
    }


    // this.snackBar.open(this.isEditing ? 'Entry updated.' : 'Entry saved.', undefined, { duration: 3000 });

  }



  saveWorkBook(type: any, payload: any) {
    this.app.startLoaderDark();
    const insertType = {
      insert: 'InsertVehicleWorkBook',
      update: 'UpdateVehicleWorkBook',
      delete: 'DeleteVehicleWorkBook',
    }[type];


    var url = `${environment.mainApi + this.global.miningLink}${insertType}`;

    console.log(url, payload);

    this.http.post(url, payload).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully'
            || Response.msg == 'Data Updated Successfully'
            || Response.msg == 'Data Deleted Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.getWorkbookList();
            this.selectedTab = 1; // show the saved list

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


  onCancel(form: NgForm): void {
    const wasEditing = this.isEditing;
    // this.leaveForm(form);
    this.model =  this.blankModel();
    
    // if (wasEditing) {
    //   this.selectedTab = 1;
    // }
  }

  onEdit(item: any): void {
    this.model.vehicleWorkBookID = item.vehicleWorkBookID;
    this.model.vehicleID = item.vehicleID;
    this.model.workDate = new Date(item.workDate);
    this.model.workingHour = item.workingHour;
    this.model.description = item.description;
    this.selectedTab = 0;

    console.log(this.model);

  }

  private leaveForm(form: NgForm): void {

    this.model = this.blankModel();
    form.resetForm();
  }

  private blankModel(): any {
    return { vehicleWorkBookID: 0, vehicleID: 0, workingHour: '', description: '', workDate: new Date() };
  }



  // ================= Saved records =================


  getVehileList() {

    var url = `${environment.mainApi + this.global.miningLink}GetVehicle?VehicleID=0`

    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.vehicles = Response.filter((e: any) => e.vehicleActiveStatus);
          this.vehicleFilterOptions = this.vehicles;
        },
        error: (error: any) => {
          console.log('error occured while loading vehicle list' + error);
        }
      }
    )

  }

  workBookList: any = [];
  tmpWorkBookList: any = [];

  getWorkbookList() {
    // var url = `${environment.mainApi + this.global.miningLink}GetVehicleWorkBook?VehicleWorkBookID=0`;

    var fromDate = this.global.dateFormater(this.fromDate,'')
    var toDate = this.global.dateFormater(this.toDate,'')

    var url = `${environment.mainApi + this.global.miningLink}GetWorkBookReport?VehicleID=0
    &ReportType=Detail&FromDate=${fromDate}&ToDate=${toDate}&FromTime=00:00&ToTime=23:59:59`;


    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          console.log(Response);
          this.tmpWorkBookList = Response;
          this.workBookList = Response;
        }
      }
    )

  }
  applyFilters(): void {

    const from = this.toDate_(this.fromDate);
    const to = this.toDate_(this.toDate);
    if (from) from.setHours(0, 0, 0, 0);
    if (to) to.setHours(23, 59, 59, 999);

    this.workBookList = this.tmpWorkBookList.filter((e: any) => {
      const vehicleMatch = !this.FilterVehicleID || e.vehicleID === this.FilterVehicleID;

      const workDate = this.toDate_(e.workDate);
      const dateMatch =
        (!from || (!!workDate && workDate >= from)) &&
        (!to || (!!workDate && workDate <= to));

      return vehicleMatch && dateMatch;
    });
  }

  private toDate_(value: any): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }


  clearFilters(): void {
    this.search = '';
    this.FilterVehicleID = 0;
    this.fromDate =  this.setDates('start');
    this.toDate =this.setDates('end');
    this.applyFilters();
  }

  confirmDelete(item: any): void {

    var payload = {
      VehicleWorkBookID: item.vehicleWorkBookID,
      PinCode: "",
      UserID: this.global.getUserID()
    }

    this.global.openPinCode().subscribe(pin => {
      if (pin != '') {
        payload.PinCode = pin;
        this.saveWorkBook('delete', payload);
      }
    })

  }
}