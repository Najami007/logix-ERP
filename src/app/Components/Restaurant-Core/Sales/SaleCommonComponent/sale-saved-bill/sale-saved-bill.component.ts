import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
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

   delRestSaleFeature = this.global.delRestSaleFeature;

  editRestSaleFeature = this.global.editRestSaleFeature;
  buzzerNoFeature = this.global.buzzerNoFeature;

  constructor(
 
    
    public global: GlobalDataModule,
    private dialog: MatDialog,
    public http: HttpClient,
    private msg: NotificationService
  ) { }
  ngOnInit(): void {
  }




    @Output() changePaymentEmitter = new EventEmitter();
    @Output() sendToFbrEmitter = new EventEmitter();
    @Output() printDuplicateEmitter = new EventEmitter();
    @Output() billDetailEmitter = new EventEmitter();
    @Output() postBillEmitter = new EventEmitter();
    @Output() editSaleBill = new EventEmitter();
    @Output() deleteSaleBill = new EventEmitter();
    @Input()  savedbillList:any = [];
    crudList: any = { c: true, r: true, u: true, d: true };
  
  
  
  
    changePayment(item:any){
      this.changePaymentEmitter.emit(item);
    }
    printDuplicateBill(item:any){
      this.printDuplicateEmitter.emit(item);
    }
  
    sendToFbr(item:any){
      this.sendToFbrEmitter.emit(item);
    }
  
    billDetails(item:any){
      this.billDetailEmitter.emit(item);
    }
    postSaleBill(item:any){
      this.postBillEmitter.emit(item);
    }

     editSale(item:any){
      this.editSaleBill.emit(item);
    }

    deleteSale(item:any){
      this.deleteSaleBill.emit(item);
    }
 

}
