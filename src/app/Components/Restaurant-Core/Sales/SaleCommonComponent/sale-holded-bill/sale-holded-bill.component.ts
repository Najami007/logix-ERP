import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-sale-holded-bill',
  templateUrl: './sale-holded-bill.component.html',
  styleUrls: ['./sale-holded-bill.component.scss']
})
export class SaleHoldedBillComponent {

    
  showCmpNameFeature: any = this.global.showCmpNameFeature;
  waiterFeature = this.global.waiterFeature;
  FBRFeature = this.global.FBRFeature;
  gstFeature = this.global.gstFeature;
  
  serviceChargesFeature = this.global.serviceChargeFeature;
  RestSimpleSaleFeature = this.global.RestSimpleSaleFeature;
  BankShortCutsFeature = this.global.BankShortCutsFeature;
  coverOfFeature = this.global.coverOfFeature;
  disableDate = this.global.disableSaleDate;
  customerFeature = this.global.customerFeature;
  defaultOrderTypeFeature = this.global.DefaultOrderType;
  disableDiscPwd = this.global.DisableDiscPwd;
  disablePrintPwd = this.global.DisablePrintPwd;
  autoTableSelectFeature = this.global.AutoTableSelect;
  postBillFeature = this.global.postSale;


    constructor(
   
      
      public global: GlobalDataModule,
      private dialog: MatDialog,
      public http: HttpClient,
      private msg: NotificationService
    ) { }
    ngOnInit(): void {
    }
  
  
  

      @Output() billDetailEmitter = new EventEmitter();
      @Input()  holdBillList:any = [];
      crudList: any = { c: true, r: true, u: true, d: true };


      getBillDetail(item:any){
          this.billDetailEmitter.emit(item);
      }

}
