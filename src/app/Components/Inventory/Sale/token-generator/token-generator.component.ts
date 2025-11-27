import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { TokenPrintComponent } from './token-print/token-print.component';
import { environment } from 'src/environments/environment.development';
import { Observable, retry } from 'rxjs';

@Component({
  selector: 'app-token-generator',
  templateUrl: './token-generator.component.html',
  styleUrls: ['./token-generator.component.scss']
})
export class TokenGeneratorComponent implements OnInit {




  @ViewChild(TokenPrintComponent) tokenPrint: any;


  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    private globaldata: GlobalDataModule,
    private app: AppComponent,
    private route: Router

  ) {


    this.globaldata.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    });

    this.globaldata.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

  }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Generate Token');
    this.getSavedToken();
  }


  billNoList: any = [{ id: 1, title: 'Bill#1' }, { id: 2, title: 'Bill#2' }, { id: 3, title: 'Bill#3' }]


  CusName: any = '';
  CusContactNo: any = '';
  CusCNIC: any = '';
  remarks: any = '';
  CusDocument: any = '';
  CusDetail: any = '';
  TotalInvoices: any = 0;




  InvBillNo: any = '';
  InvBillNoAmount: any = 0;
  InvBillNo2: any = '';
  InvBillNo2Amount: any = 0;
  InvBillNo3: any = '';
  InvBillNo3Amount: any = 0;

  OnBillNoChange(e: any, billNo: any) {

    if (billNo == 1) {
      this.InvBillNoAmount = 0;
      this.InvBillNo2 = '';
      this.InvBillNo2Amount = 0;
    }
    if (billNo == 2) {
      this.InvBillNo2Amount = 0;
      this.InvBillNo3Amount = 0;
      this.InvBillNo3 = '';
    }
    if (billNo == 3) {
      this.InvBillNo3Amount = 0;
    }

  }



  printDataRow = [{ invBillNo: 'S-11', tokenNo: '21', amount: 10000, customerName: 'Najam Ali', customerMobileNo: '0311-5948202', remarks: 'Testing Remarks' }]


  checkInvoice(invBillNo: any, billNo: any) {

    this.getBillDetail(invBillNo, 'Bill').subscribe(
      {
        next: (Response: any) => {

          if (Response.length == 0) {
            this.msg.WarnNotify('Bill No Not Valid');
          }

          if (billNo == 1) {
            this.InvBillNoAmount = Response.length > 0 ? Response[0].billTotal : 0;
          }
          if (billNo == 2) {
            this.InvBillNo2Amount = Response.length > 0 ? Response[0].billTotal : 0;
          }
          if (billNo == 3) {
            this.InvBillNo3Amount = Response.length > 0 ? Response[0].billTotal : 0;
          }

        }
      }
    )

  }


  public getTokenDetail(billNo: any, type: any): Observable<any> {
    return this.http.get(environment.mainApi + this.globaldata.inventoryLink + `gettoken?reqType=${type}&InvBillNo=${billNo}`).pipe(retry(3));
  }

  public getBillDetail(billNo: any, type: any): Observable<any> {
    return this.http.get(environment.mainApi + this.globaldata.inventoryLink + `PrintBill?BillNo=${billNo}`).pipe(retry(3));
  }




  generateToken() {

    this.globaldata.openBootstrapModal('#tokenModal', true);

  }


  savedTokenList: any = [];

  getSavedToken() {
    this.http.get(environment.mainApi + this.globaldata.inventoryLink + `gettoken?reqType=All`).subscribe(
      {
        next: (Response: any) => {
          this.savedTokenList = Response;
        },
        error: (Error: any) => {
          console.log(Error);
        }
      }
    )
  }


 getCount(amount: number): number {
  const tokenValue = 10000;

  if (!amount || amount <= 0) return 0;

  return Math.floor(amount / tokenValue);
}

  getTotalInvoice() {
    let count = 0;

    if (this.InvBillNoAmount > 0) count++;
    if (this.InvBillNo2Amount > 0) count++;
    if (this.InvBillNo3Amount > 0) count++;

    return count;
  };

  saveToken() {

    var billAmount = Number(this.InvBillNoAmount) + Number(this.InvBillNo2Amount) + Number(this.InvBillNo3Amount);


    if (this.InvBillNo != '' && this.InvBillNo2 != '' && this.InvBillNo == this.InvBillNo2) {
      this.msg.WarnNotify('Invoice Numbers 1 and 2 are same');
      return;
    }


    if (this.InvBillNo2 != '' && this.InvBillNo3 != '' && this.InvBillNo2 == this.InvBillNo3) {
      this.msg.WarnNotify('Invoice Numbers 2 and 3 are same');
      return;
    }


    if (this.InvBillNo3 != '' && this.InvBillNo != '' && this.InvBillNo == this.InvBillNo3) {
      this.msg.WarnNotify('Invoice Numbers 1 and 3 are same');
      return;
    }


    // if( (this.InvBillNo == this.InvBillNo2 &&   this.InvBillNo  !== '' && this.InvBillNo2 !== '')
    //     || (this.InvBillNo2 == this.InvBillNo3 &&   this.InvBillNo2  !== '' &&  this.InvBillNo3 !== '') 
    //   ||( this.InvBillNo == this.InvBillNo3 &&   this.InvBillNo2  !== '' &&  this.InvBillNo3 !== '') ){
    //   this.msg.WarnNotify('Invoice Numbers must be different');
    //   return;
    // }

    if (billAmount < 10000) {
      this.msg.WarnNotify(`Bill Total is less than 10,000`);
      return;
    }

    if (this.CusName == '' || this.CusName == undefined) {
      this.msg.WarnNotify('Enter Customer Name');
      return;
    }
    if (this.CusContactNo == '' || this.CusContactNo == undefined) {
      this.msg.WarnNotify('Enter Customer Contact No');
      return;
    }
    if (this.CusCNIC == '' || this.CusCNIC == undefined) {
      this.msg.WarnNotify('Enter Customer CNIC');
      return;
    }



    this.TotalInvoices = this.getTotalInvoice();
    var tokenQty = this.getCount(billAmount);




    var postData = {
      TokenNo: 0,
      InvBillNo: this.InvBillNoAmount <= 0 ? '-' : this.InvBillNo,
      InvBillNo2: this.InvBillNo2Amount <= 0 ? '-' : this.InvBillNo2,
      InvBillNo3: this.InvBillNo3Amount <= 0 ? '-' : this.InvBillNo3,
      CusName: this.CusName,
      CusContactNo: this.CusContactNo,
      CusCNIC: this.CusCNIC,
      CusDetail: this.CusDetail || '-',
      CusDocument: this.CusDocument || '-',
      TotalInvoices: this.TotalInvoices,
      tokenQty: tokenQty
    }

    this.http.post(environment.mainApi + this.globaldata.inventoryLink + 'InsertToken', postData).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully') {
            this.msg.SuccessNotify('Token Generated Successfully');
            this.reset();
            this.getSavedToken();
            this.globaldata.closeBootstrapModal('#tokenModal', true);
          } else {
            this.msg.WarnNotify(Response.msg);
          }
        }
      }
    )


  }



  printToken(item: any) {

    var curDate = new Date();
    var valid = this.isMoreThan30Minutes(curDate, new Date(item.createdOn));

    if (valid && this.globaldata.getRoleTypeID() > 2) {
      this.msg.WarnNotify('Not Allowed to Generate Print')
      return;
    }

    this.tokenPrint.printToken([item]);
  }


  isMoreThan30Minutes(curDate: Date, createdDate: Date): boolean {
    // Ensure both are valid Date objects
    const current = new Date(curDate).getTime();
    const created = new Date(createdDate).getTime();

    if (isNaN(current) || isNaN(created)) return false;

    // Check if current date is greater
    if (current <= created) return false;

    // Calculate difference in milliseconds
    const diffMs = current - created;

    // 30 minutes in milliseconds
    const thirtyMinutes = 10 * 60 * 1000;

    return diffMs >= thirtyMinutes;
  }


  reset() {
    this.InvBillNo = '';
    this.InvBillNoAmount = 0;
    this.InvBillNo2 = '';
    this.InvBillNo2Amount = 0;
    this.InvBillNo3 = '';
    this.InvBillNo3Amount = 0;
    this.CusName = '';
    this.CusContactNo = '';
    this.CusCNIC = '';
    this.CusDetail = '';
    this.CusDocument = '';
    this.TotalInvoices = 0;
  }

}
