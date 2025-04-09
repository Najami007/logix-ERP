import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { SaleBillDetailComponent } from '../../sale1/sale-bill-detail/sale-bill-detail.component';
import { RestSaleBillPrintComponent } from '../rest-sale-bill-print/rest-sale-bill-print.component';
import { Sale1Component } from '../../sale1/sale1.component';

@Component({
  selector: 'app-sale-saved-bill',
  templateUrl: './sale-saved-bill.component.html',
  styleUrls: ['./sale-saved-bill.component.scss']
})
export class SaleSavedBillComponent implements OnInit {
  @ViewChild(RestSaleBillPrintComponent) billPrint: any;
  @ViewChild(Sale1Component) sale: any;


  showCmpNameFeature: any = this.global.showCmpNameFeature;
  waiterFeature = this.global.waiterFeature;
  FBRFeature = this.global.FBRFeature;
  serviceChargesFeature = this.global.serviceChargeFeature;
  RestSimpleSaleFeature = this.global.RestSimpleSaleFeature;
  BankShortCutsFeature = this.global.BankShortCutsFeature;

  constructor(
 
    
    public global: GlobalDataModule,
    private dialog: MatDialog,
    public http: HttpClient,
    private msg: NotificationService
  ) { }
  ngOnInit(): void {
    this.getSavedBill();
  }


  savedbillList: any = [];
  /////////////////////////////////////////////////////////////////////////////

  getSavedBill() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetOpenDaySale').subscribe(
      (Response: any) => {

        this.savedbillList = Response;
      }
    )


  }


  printDuplicateBill(item: any) {

    this.sale.printDuplicateBill(item);
    // $('#SavedBillModal').hide();
    // this.global.openPassword('Password').subscribe(pin => {
    //   if (pin !== '') {
    //     this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
    //       RestrictionCodeID: 5,
    //       Password: pin,
    //       UserID: this.global.getUserID()

    //     }).subscribe(
    //       (Response: any) => {
    //         if (Response.msg == 'Password Matched Successfully') {
    //           $('#SavedBillModal').show();

    //           this.billPrint.printBill(item.invBillNo);
    //           this.billPrint.myDuplicateFlag = true;

    //           // setTimeout(() => {
    //           //   this.global.printData('#print-bill');
    //           // }, 500);

    //         } else {
    //           this.msg.WarnNotify(Response.msg);
    //           $('#SavedBillModal').show();
    //         }
    //       }
    //     )
    //   }
    // })

  }

  billDetails(item: any) {
    this.sale.billDetails(item);
    // $('#SavedBillModal').hide();
    // this.global.openPassword('Password').subscribe(pin => {
    //   if (pin !== '') {
    //     this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
    //       RestrictionCodeID: 5,
    //       Password: pin,
    //       UserID: this.global.getUserID()

    //     }).subscribe(
    //       (Response: any) => {
    //         if (Response.msg == 'Password Matched Successfully') {
    //           $('#SavedBillModal').show();

    //           this.dialog.open(SaleBillDetailComponent, {
    //             width: '50%',
    //             data: item,
    //             disableClose: true,
    //           }).afterClosed().subscribe(value => {

    //           })
    //         } else {
    //           this.msg.WarnNotify(Response.msg);
    //         }
    //       }
    //     )
    //   }
    // })


  }



  sendToFbr(item: any) {
    this.http.post(environment.mainApi + this.global.restaurentLink + 'ResSendToPra', {
      InvBillNo: item.invBillNo,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getSavedBill();
        } else {
          this.msg.WarnNotify(Response.msg);
        }
      }
    )
  }


  close(){
    // this.dialogRef.close();
  }


}
