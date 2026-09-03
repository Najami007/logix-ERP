import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AddAdjustmentComponent } from './add-adjustment/add-adjustment.component';
import { environment } from 'src/environments/environment.development';
import { VoucherDetailsComponent } from '../../CommonComponent/voucher-details/voucher-details.component';
import { VoucherPrintComponent } from '../../CommonComponent/voucher-print/voucher-print.component';

@Component({
  selector: 'app-account-adjustment',
  templateUrl: './account-adjustment.component.html',
  styleUrls: ['./account-adjustment.component.scss']
})
export class AccountAdjustmentComponent implements OnInit {


  @ViewChild(VoucherPrintComponent) printVoucher: any;

  @ViewChild(AddAdjustmentComponent) addAdjustment: any;


  page: number = 1;
  count: number = 0;

  tableSize: number = 0;
  tableSizes: any = [];

  onTableDataChange(event: any) {

    this.page = event;
    this.getSavedData();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getSavedData();


  }


  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    private global: GlobalDataModule,
    private app: AppComponent,
    private route: Router

  ) {


    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    });

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Adjustment');
    this.getSavedData();

    this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;
  }

  curDate = new Date();
  startDate: Date = new Date(this.curDate.getFullYear(), this.curDate.getMonth(), 1);
  endDate: Date = new Date(this.curDate.getFullYear(), this.curDate.getMonth() + 1, 0);
  savedDataList: any = [];

  getSavedData() {



    var fromDate = this.global.dateFormater(this.startDate, '-');
    var toDate = this.global.dateFormater(this.endDate, '-');

    this.http.get(environment.mainApi + this.global.accountLink + 'GetPayRec?reqType=adj').subscribe(
      (Response: any) => {
        this.savedDataList = Response;
      },
      (error: any) => {
        console.log(error)
        this.msg.WarnNotify('Error Occured While Retreiving Data');
      }
    )

  }


  add() {
    this.global.openBootstrapModal('#addAdjustmentModal', true)
  }

  closeModal(type: any) {
    this.global.closeBootstrapModal('#addAdjustmentModal', true);
    if (type == 'update') {
      this.getSavedData();
    }
  }


  edit(item: any) {


    this.addAdjustment.invoiceNo = item.invoiceNo;
    this.addAdjustment.invoiceDate = new Date(item.invoiceDate);
    this.addAdjustment.debitCoaID = item.coaid;
    this.addAdjustment.creditCoaID = item.refCOAID;
    this.addAdjustment.remarks = item.invoiceRemarks;
    this.addAdjustment.amount = item.amount;
    this.addAdjustment.btnType = 'Update';

    this.add();



  }

  printBill(item: any) {
    this.printVoucher.printBill(item);

  }


  approveBill(row: any) {

    this.global.openPinCode().subscribe(pin => {
      if (pin != '') {


        //////on confirm button pressed the api will run
        this.http.post(environment.mainApi + this.global.accountLink + 'ApproveVoucher', {
          InvoiceNo: row.invoiceNo,
          PinCode: pin,
          UserID: this.global.getUserID(),
        }).subscribe(
          (Response: any) => {

            if (Response.msg == 'Voucher Approved Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getSavedData();
            } else {
              this.msg.WarnNotify(Response.msg);
            }

          }
        )

      }
    })



  }


  delete(item: any) {


    this.global.openPinCode().subscribe(pin => {
      if (pin != '') {

        //////on confirm button pressed the api will run
        this.http.post(environment.mainApi + this.global.accountLink + 'DeleteVoucher', {
          InvoiceNo: item.invoiceNo,
          PinCode: pin,
          UserID: this.global.getUserID(),
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Deleted Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getSavedData();
            } else {
              this.msg.WarnNotify(Response.msg);
            }
          }
        )



      }
    })

  }


  VoucherDetails(row: any) {
    this.dialogue.open(VoucherDetailsComponent, {
      width: "40%",
      data: row,
    }).afterClosed().subscribe(val => {

    })
  }

}
