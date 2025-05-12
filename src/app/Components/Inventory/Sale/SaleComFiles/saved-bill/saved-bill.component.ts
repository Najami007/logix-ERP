import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';

@Component({
  selector: 'app-saved-bill',
  templateUrl: './saved-bill.component.html',
  styleUrls: ['./saved-bill.component.scss']
})
export class SavedBillComponent {



    constructor(

      public global: GlobalDataModule,
      private route: Router

    ) {

      this.global.getMenuList().subscribe((data) => {
        this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
  
      })
  
  
    }


  discFeature = this.global.discFeature;
  BookerFeature = this.global.BookerFeature;
  gstFeature = this.global.gstFeature;
  customerFeature = this.global.customerFeature;
  tillOpenFeature = this.global.tillOpenFeature;
  editSpFeature = this.global.editSpFeature;
  editDiscFeature = this.global.editDiscFeature;
  prodDetailFeature = this.global.prodDetailFeature;
  BankShortCutsFeature = this.global.BankShortCutsFeature;
  FBRFeature = this.global.FBRFeature;
  LessToCostFeature = this.global.LessToCostFeature;
  changePaymentMehtodFeature = this.global.changePaymentMehtodFeature;
  onlySaveBillFeature = this.global.onlySaveBillFeature;
  disableDate = this.global.DisableDateSale;
   postBillFeature = this.global.postSale;



  @Output() changePaymentEmitter = new EventEmitter();
  @Output() sendToFbrEmitter = new EventEmitter();
  @Output() printDuplicateEmitter = new EventEmitter();
  @Output() billDetailEmitter = new EventEmitter();
  @Output() postBillEmitter = new EventEmitter();
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

}
