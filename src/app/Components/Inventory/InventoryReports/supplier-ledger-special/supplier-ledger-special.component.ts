import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Time } from 'highcharts';
import { SaleBillDetailComponent } from 'src/app/Components/Restaurant-Core/Sales/sale1/sale-bill-detail/sale-bill-detail.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { SaleBillPrintComponent } from '../../Sale/SaleComFiles/sale-bill-print/sale-bill-print.component';

@Component({
  selector: 'app-supplier-ledger-special',
  templateUrl: './supplier-ledger-special.component.html',
  styleUrls: ['./supplier-ledger-special.component.scss']
})
export class SupplierLedgerSpecialComponent implements OnInit {



  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe

  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })
  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Purchase History Supplier wise');
    this.getUsers();
    this.getSupplier();
  

  }




  supplierList: any = [];
  partyID = 0;
  partyName = '';

  userList: any = [];
  userID = 0;
  userName = '';

  fromDate: Date = new Date();
  fromTime: any = '00:00';
  toDate: Date = new Date();
  toTime: any = '23:59';

  DetailList: any = [];
  reportType: any;

formateType = 3;



  getUsers() {
    this.global.getUserList().subscribe((data: any) => { this.userList = data; });
  }

  getSupplier() {
    this.global.getSupplierList().subscribe((data: any) => {
      if (data.length > 0) {
        this.supplierList = data.map((e: any, index: any) => {
          (e.indexNo = index + 1);
          return e;
        });
        this.supplierList.sort((a: any, b: any) => b.indexNo - a.indexNo);
      }
    });

  }

  onSupplierSelected() {
    this.partyName = this.supplierList.find((e: any) => e.partyID == this.partyID).partyName;
    var index = this.supplierList.findIndex((e: any) => e.partyID == this.partyID);
    this.supplierList[index].indexNo = this.supplierList[0].indexNo + 1;
    this.supplierList.sort((a: any, b: any) => b.indexNo - a.indexNo);

  }



  onUserSelected() {
    var curUser = this.userList.find((e: any) => e.userID == this.userID);
    this.userName = curUser.userName;
  }


  grandTotal = 0;

  ledgerDetailList:any =[];
  getReport(type: any) {

    // alert(this.recipeCatID);

    if (this.partyID == 0 || this.partyID == undefined) {
      this.msg.WarnNotify('Select Supplier')
    } else {
      this.partyName = this.supplierList.find((e: any) => e.partyID == this.partyID).partyName;

      this.app.startLoaderDark();

      


        this.reportType = ' Ledger';
        this.http.get(environment.mainApi + this.global.inventoryLink + 'GetLedgerRpt_11?FromDate=' +
          this.global.dateFormater(this.fromDate, '-') + '&todate=' + this.global.dateFormater(this.toDate, '-') + '&fromtime=' + this.fromTime + '&totime=' + this.toTime + '&PartyID=' + this.partyID).subscribe(
            (Response: any) => {
              this.ledgerDetailList = [];
              if (Response.length == 0 || Response == null) {
                this.global.popupAlert('Data Not Found!');
                this.app.stopLoaderDark();
                return;

              }
              this.ledgerDetailList = Response.map((e: any) => {
                if (e.billDetail != '-') {
                  (e.billDetailList = JSON.parse(e.billDetail));

                }
                (e.invoiceDate = new Date(e.invoiceDate))
                return e;
              })
              this.app.stopLoaderDark();
            }
          )
      


    }



    



  }


  reset(){
    this.DetailList = [];
    this.grandTotal = 0;
  }


  print() {
    this.global.printData('#PrintDiv')
  }

  billDetails(item: any) {
    this.dialog.open(SaleBillDetailComponent, {
      width: '50%',
      data: item,
      disableClose: true,
    }).afterClosed().subscribe(value => {

    })
  }


  
  export() {
    if (this.DetailList.length == 0) return;
    var partyName = this.supplierList.filter((e:any)=> e.partyID === this.partyID)[0].partyName;
    var startDate = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
    var endDate = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
    this.global.ExportHTMLTabletoExcel(`${this.formateType == 1 ? 'summaryTable' : 'detailTable'}`,
       `Purchase History Supplier(${partyName}) (${startDate} - ${endDate})`)
  }



  
  sortTable() {
    this.ledgerDetailList.sort((a: any, b: any) => a.invoiceDate - b.invoiceDate)
  }

}

