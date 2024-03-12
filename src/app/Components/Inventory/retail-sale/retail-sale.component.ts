import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

import * as $ from 'jquery';
import { EnterQtyComponent } from './enter-qty/enter-qty.component';
import { Observable, retry } from 'rxjs';
import { RtlSavedBillComponent } from './rtl-saved-bill/rtl-saved-bill.component';




@Component({
  selector: 'app-retail-sale',
  templateUrl: './retail-sale.component.html',
  styleUrls: ['./retail-sale.component.scss']
})
export class RetailSaleComponent implements OnInit {

  companyProfile: any = [];
  companyLogo: any = '';
  logoHeight:any = 0;
  logoWidth:any = 0;
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';
   crudList:any = {c:true,r:true,u:true,d:true};
 
 
   mobileMask = this.global.mobileMask;

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    public global:GlobalDataModule,
    private dialogue:MatDialog,
    private app:AppComponent,
    private route:Router
  ){
    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
  
    })

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
      this.companyLogo = data[0].companyLogo1;
      this.CompanyMobile = data[0].companyMobile;
      this.companyAddress = data[0].companyAddress;
      this.companyName = data[0].companyName;
      this.logoHeight = data[0].logo1Height;
      this.logoWidth = data[0].logo1Width;
    });

    
        ///////////// will Check day is opened or not

  
        this.global.getCurrentOpenDay().subscribe(
          (Response:any)=>{
            // alert(Response)
            if(Response == null || Response == ''){
              Swal.fire({
                title: 'Alert!',
                text: 'Day Is Currently Closed',
                position: 'center',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK',
              })
            }
          }
        )

  }
  ngOnInit(): void {
   this.global.setHeaderTitle('Sale');
   this.getBankList();
 
   setTimeout(() => {
    $('#psearchProduct').trigger('focus');
   }, 200);
   
   this.global.getProducts().subscribe(
    (data:any)=>{this.productList = data;})
  }
  

  sortType = 'desc';

  productList:any = [];
  projectID = this.global.InvProjectID;

  tableDataList:any = [];
  tempTableDataList:any = [];
  InvDate = new Date();
  PBarcode:any = '';
  productImage = '';
  productName:any = '';
  discount:any = 0;
  cash:any = 0;
  change = 0;
  paymentType = 'Cash';
  bankCash:any = 0;
  bankCoaID = 0;
  billRemarks = '';
  otherCharges = 0;

  qtyTotal = 0;
  subTotal:any = 0;
  netTotal = 0;

  bankCoaList:any = [];


  changeOrder(){
    this.sortType = this.sortType == 'desc' ? 'asc' :'desc';
    this.sortType == 'desc' ? this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex) : this.tableDataList.sort((a:any,b:any)=> a.rowIndex - b.rowIndex);

  }

  ////////////////////////////////////////////

  getBankList() {
    this.http.get(environment.mainApi + 'acc/GetVoucherCBCOA?type=BRV').subscribe(
      (Response: any) => {
        this.bankCoaList = Response;
        setTimeout(() => {
          this.bankCoaID = Response[0].coaID;
        }, 200);
      },
      (Error) => {
      
      }
    )
  }


  
  searchByCode(e:any){

    if(this.PBarcode !== ''){
      if(e.keyCode == 13){
        ///// check the product in product list by barcode
        var row =  this.productList.find((p:any)=> p.barcode == this.PBarcode);
   
        /////// check already present in the table or not
        if(row !== undefined){
          var condition = this.tableDataList.find(
            (x: any) => x.productID == row.productID
          );
      
          var index = this.tableDataList.indexOf(condition);
      
          //// push the data using index
          if (condition == undefined) {

         
            // this.app.startLoaderDark();
            this.global.getProdDetail(0,this.PBarcode).subscribe(
              (Response:any)=>{
              
                  this.tableDataList.push({
                    rowIndex:this.tableDataList.length == 0 ? this.tableDataList.length + 1 
                    : this.sortType == 'desc' ?  this.tableDataList[0].rowIndex + 1 
                    : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
                    productID:Response[0].productID,
                    productTitle:Response[0].productTitle,
                    barcode:Response[0].barcode,
                    productImage:Response[0].productImage,
                    quantity:1,
                    wohCP:Response[0].costPrice,
                    avgCostPrice:Response[0].avgCostPrice,
                    costPrice:Response[0].costPrice,
                    salePrice:Response[0].salePrice,
                    ovhPercent:0,
                    ovhAmount:0,
                    expiryDate:this.global.dateFormater(new Date(),'-'),
                    batchNo:'-',
                    batchStatus:'-',
                    uomID:Response[0].uomID,
                    packing:1,
                    discInP:0,
                    discInR:0,
                    aq:Response[0].aq,
              
                  });

                  //this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex);
                  this.sortType == 'desc' ? this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex) : this.tableDataList.sort((a:any,b:any)=> a.rowIndex - b.rowIndex);
                  this.getTotal();
            

                this.productImage = Response[0].productImage;
              }
            )
            

         
        }else {
          this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + 1;
          this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length -1].rowIndex + 1 ;
          this.sortType == 'desc' ? this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex) : this.tableDataList.sort((a:any,b:any)=> a.rowIndex - b.rowIndex);
          this.productImage = this.tableDataList[index].productImage;
        }
        }else{
          this.msg.WarnNotify('Product Not Found')
        }
     

       this.PBarcode = '';
       this.getTotal();
       $('#psearchProduct').trigger('focus');
   
       }
    }

   
  }

  holdDataFunction(data:any){
 

    var condition = this.tableDataList.find(
      (x: any) => x.productID == data.productID
    );

    var index = this.tableDataList.indexOf(condition);

    if (condition == undefined) {

      this.app.startLoaderDark();

      this.global.getProdDetail(data.productID,'').subscribe(
        (Response:any)=>{
       
            this.tableDataList.push({
              
              rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1 
              : this.sortType == 'desc' ?  this.tableDataList[0].rowIndex + 1 
              : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
              productID:Response[0].productID,
              productTitle:Response[0].productTitle,
              barcode:Response[0].barcode,
              productImage:Response[0].productImage,
              quantity:1,
              wohCP:Response[0].costPrice,
              costPrice:Response[0].costPrice,
              avgCostPrice:Response[0].avgCostPrice,
              salePrice:Response[0].salePrice,
              ovhPercent:0,
              ovhAmount:0,
              expiryDate:this.global.dateFormater(new Date(),'-'),
              batchNo:'-',
              batchStatus:'-',
              uomID:Response[0].uomID,
              packing:1,
              discInP:0,
              discInR:0,
              aq:Response[0].aq,
        
            });
            // this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex);
           this.sortType == 'desc' ? this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex) : this.tableDataList.sort((a:any,b:any)=> a.rowIndex - b.rowIndex);
            this.getTotal();
           
          
         this.productImage = Response[0].productImage;
        }
      )
  }else {
    this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + 1;
    this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length -1].rowIndex + 1 ;
    this.sortType == 'desc' ? this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex) : this.tableDataList.sort((a:any,b:any)=> a.rowIndex - b.rowIndex);
    this.productImage = this.tableDataList[index].productImage;
  
  }
  this.app.stopLoaderDark();
    this.productName = '';
    this.getTotal();
   setTimeout(() => {
    $('#psearchProduct').trigger('focus');
   }, 500);

  }

  focusto(cls:any,e:any){ 

    // setTimeout(() => {
    //  $(cls).trigger('focus');
    // }, 500);

    if(cls == '#prodName'){
       setTimeout(() => {
          $(cls).trigger('focus');
        }, 500);
    }
 
    if(cls == '#disc' && e.keyCode == 13 && e.target.value == ''){
      $(cls).trigger('focus');
    }
    if(cls == '#charges' && e.keyCode == 13 ){
      $(cls).trigger('focus');
    }
    if(cls == '#cash' && e.keyCode == 13 ){
      $(cls).trigger('focus');
      
    }
    
    if(cls == '#save' && e.keyCode == 13 ){
      $(cls).trigger('focus');
    
    }

    if(cls == '#vsrtnsearchProduct' && e.keyCode == 13 ){
      $(cls).trigger('focus');
    }
 
  
 
   }
 

  getTotal() {
    this.qtyTotal = 0;
    this.subTotal = 0;
    this.netTotal = 0;

    this.tableDataList.forEach((e:any) => {
        this.qtyTotal += parseFloat(e.quantity);
        this.subTotal += parseFloat(e.quantity) * parseFloat(e.salePrice);

    });

    if(this.discount == ''){
      this.discount = 0;
    }

    if(this.cash == ''){
      this.cash = 0;
    }

    
    
    this.netTotal = this.subTotal - parseFloat(this.discount);
    this.change = parseFloat(this.cash) -  this.netTotal ;

    if(this.paymentType == 'Split'){
            
      this.bankCash = this.netTotal - parseFloat(this.cash);
    }
    if(this.paymentType == 'Bank'){
      this.bankCash = this.netTotal;
    }

  }



  rowFocused = -1;
  prodFocusedRow= 0;
   changeFocus(e:any, cls:any){

  if(e.target.value == ''){
    if(e.keyCode == 40){
      
      if(this.tableDataList.length >= 1 ){ 
        this.rowFocused = 0; 
         $('.qty0').trigger('focus');

      }
     }
  }else{
    this.prodFocusedRow = 0;
      /////move down
      if(e.keyCode == 40){
        if(this.productList.length >= 1 ){  
          $('.prodRow0').trigger('focus');
       }  
     }}
   }

   handleProdFocus(item:any,e:any,cls:any,endFocus:any, prodList:[]){
    
   
   /////// increment in prodfocus on tab click
   if(e.keyCode == 9 && !e.shiftKey){
    this.prodFocusedRow += 1;

  }
  /////// decrement in prodfocus on shift tab click
  if(e.shiftKey && e.keyCode == 9){
    this.prodFocusedRow -= 1;

  }
    /////move down
    if(e.keyCode == 40){

 
      if(prodList.length > 1 ){
       this.prodFocusedRow += 1;
       if (this.prodFocusedRow >= prodList.length) {      
         this.prodFocusedRow -= 1  
     } else {
         var clsName = cls + this.prodFocusedRow;    
        //  alert(clsName);
         $(clsName).trigger('focus');
        //  e.which = 9;   
        //  $(clsName).trigger(e)       
     }}
   }
 
 
      //Move up
      if (e.keyCode == 38) {
 
       if (this.prodFocusedRow == 0) {
           $(endFocus).trigger('focus');
           this.prodFocusedRow = 0;
  
       }
 
       if (prodList.length > 1) {
 
           this.prodFocusedRow -= 1;
 
           var clsName = cls + this.prodFocusedRow;
          //  alert(clsName);
           $(clsName).trigger('focus');
           
 
       }
 
   }

  }

  handleUpdown(item:any ,e:any,cls:string,index:any){

   if(e.keyCode == 9){
    this.rowFocused = index +1;
   }

   if(e.shiftKey && e.keyCode == 9 ){
  
    this.rowFocused = index - 1;
   }
   if(e.keyCode == 13){
    $('#psearchProduct').trigger('focus');
   }

    if ((e.keyCode == 13 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 16 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 110 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 48 || e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51 || e.keyCode == 52 || e.keyCode == 53 || e.keyCode == 54 || e.keyCode == 55 || e.keyCode == 56 || e.keyCode == 57 || e.keyCode == 96 || e.keyCode == 97 || e.keyCode == 98 || e.keyCode == 99 || e.keyCode == 100 || e.keyCode == 101 || e.keyCode == 102 || e.keyCode == 103 || e.keyCode == 104 || e.keyCode == 105)) {
      // 13 Enter ///////// 8 Back/remve ////////9 tab ////////////16 shift ///////////46 del  /////////37 left //////////////110 dot
  }
  else {
      e.preventDefault();
  }

  /////move down
    if(e.keyCode == 40){
     
     if(this.tableDataList.length > 1 ){
      this.rowFocused += 1;
      if (this.rowFocused >= this.tableDataList.length) {      
        this.rowFocused -= 1  
    } else {
        var clsName = cls + this.rowFocused;    
        $(clsName).trigger('focus');    
    }}
  }


     //Move up
     if (e.keyCode == 38) {

      if (this.rowFocused == 0) {
          $(".searchProduct").trigger('focus');
          this.rowFocused = 0;
 
      }

      if (this.tableDataList.length > 1) {

          this.rowFocused -= 1;

          var clsName = cls + this.rowFocused;
          $(clsName).trigger('focus');
          

      }

  }

    ////removeing row
    if (e.keyCode == 46) {

      this.delRow(item);
      this.rowFocused = 0;
  }

  }

  delRow(item: any) {
    this.global.confirmAlert().subscribe(
      (Response:any)=>{
        if(Response == true){
   
        var index = this.tableDataList.indexOf(item);
        this.tableDataList.splice(index, 1);
        this.getTotal();
      
        if(index == 0){
          $('#psearchProduct').trigger('focus');
        }else{
          this.rowFocused = index - 1;
          $('.qty'+this.rowFocused).trigger('focus');
        }
    }
   }
   )
    
  
    
  }



  changeValue(item:any){
    var myIndex = this.tableDataList.indexOf(item);
   
    var myQty = this.tableDataList[myIndex].quantity;
    var myCP = this.tableDataList[myIndex].costPrice;
    var mySP = this.tableDataList[myIndex].salePrice;
    if(myCP == null || myCP == '' || myCP == undefined){
     
      this.tableDataList[myIndex].costPrice = 0;
    }else if(myQty == null || myQty == '' || myQty == undefined){
      this.tableDataList[myIndex].quantity = 0;
    }else if(mySP == null || mySP == '' || mySP == undefined){
      this.tableDataList[myIndex].salePrice = 0;
    }
    this.getTotal();
   }

  
  showImg(item:any){
    
    var index = this.tableDataList.findIndex((e:any)=> e.productID == item.productID);
    this.productImage = this.tableDataList[index].productImage;
  
  }



  save(paymentType:any){

    var isValidFlag = true;
    this.tableDataList.forEach((p:any) => {

      p.quantity = parseFloat(p.quantity);
      p.salePrice = parseFloat(p.salePrice);
      p.costPrice = parseFloat(p.costPrice);
          
        if(p.costPrice > p.salePrice || p.costPrice == 0 || p.costPrice == '0' || p.costPrice == '' || p.costPrice == undefined || p.costPrice == null ){
          this.msg.WarnNotify('('+p.productTitle+') Cost Price is not Valid');
           isValidFlag = false;
  
           return;
        }
  
        if( p.salePrice == 0 || p.salePrice == '0' || p.salePrice == '' || p.salePrice == undefined || p.salePrice == null ){
          this.msg.WarnNotify('('+p.productTitle+') Sale Price is not Valid');
           isValidFlag = false;
    
           return;
        }
  
        if(p.quantity == 0 || p.quantity == '0' || p.quantity == null || p.quantity == undefined || p.quantity == ''){
          this.msg.WarnNotify('('+p.productTitle+') Quantity is not Valid');
           isValidFlag = false;
           return;
        }
        
       
     
      });
    

   if(isValidFlag == true){
    if(this.tableDataList == ''){
      this.msg.WarnNotify('No Product Seleted')
    }else if(paymentType == 'Cash' && (this.cash == 0 || this.cash == undefined || this.cash == null)){
      this.msg.WarnNotify('Enter Cash')
    }else if(paymentType == 'Cash' && this.cash < this.netTotal){
      this.msg.WarnNotify('Entered Cash is not Valid')
    }else if ( paymentType == 'Split' && ((this.cash + this.bankCash) > this.netTotal || (this.cash + this.bankCash) < this.netTotal)) {
      this.msg.WarnNotify('Sum Of Both Amount must be Equal to Net Total')
    }else if(this.paymentType == 'Split' && this.cash <= 0 ){
        this.msg.WarnNotify('Cash Amount is Not Valid')
    }else if(this.paymentType == 'Split' && this.bankCash <= 0 ){
      this.msg.WarnNotify('Bank Amount is Not Valid')
  }
     else if ( paymentType == 'Bank' && (this.bankCash < this.netTotal) || (this.bankCash > this.netTotal)) {
      this.msg.WarnNotify('Enter Valid Amount')
    }else {
      this.app.startLoaderDark();
        this.http.post(environment.mainApi+this.global.inventoryLink+'InsertCashAndCarrySale',{
        InvDate: this.global.dateFormater(this.InvDate,'-'),
        PartyID: 0,
        InvType: "S",
        ProjectID: this.projectID,
        BookerID: 0,
        PaymentType: paymentType,
        Remarks: this.billRemarks,
        OrderType: "Take Away",
        BillTotal:this.subTotal,
        BillDiscount: this.discount,
        OtherCharges: this.otherCharges,
        NetTotal:this.netTotal,
        CashRec:this.cash,
        Change:this.change,
        BankCoaID: this.bankCoaID,
        BankCash: this.bankCash,     
        SaleDetail: JSON.stringify(this.tableDataList),
        UserID:this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.reset();
            this.PrintAfterSave(Response.invNo);
            
            if(paymentType != 'Cash'){
            $('#searchProduct').trigger('focus');
            $('#paymentMehtod').hide();
            $('.modal-backdrop').remove();
          }
           
          }else{
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
        },
        (Error:any)=>{
          this.msg.WarnNotify(Error);
          this.app.stopLoaderDark();
         }
      )
    }

   }
  
  }


  reset(){
    this.PBarcode = '';
    this.productName = '';
    this.productImage = '';
    this.tableDataList = [];
    this.cash = 0;
    this.discount = 0;
    this.netTotal = 0;
    this.subTotal = 0;
    this.change = 0;
    this.bankCash = 0;
    this.qtyTotal = 0;
    this.paymentType = 'Cash';
    this.InvDate = new Date();
    this.billRemarks = '';
    this.otherCharges = 0;
    
  }


  emptyBill(){
   if(this.tableDataList != ''){
    this.global.confirmAlert().subscribe(
      (Response:any)=>{
        if(Response == true){
   
        this.reset();
        $('#psearchProduct').trigger('focus');
    }
   }
   )
   }
    
  }


  openSavedBill(){
    this.dialogue.open(RtlSavedBillComponent,{
      width:'70%',
    }).afterClosed().subscribe()
  }




  savedbillList:any = [];
  
  
  
  myPrintTableData: any = [];
  myInvoiceNo = '';
  mytableNo = '';
  myCounterName = '';
  myInvDate: any = new Date();
  myOrderType = '';
  mySubTotal = 0;
  myNetTotal = 0;
  myOtherCharges = 0;
  myRemarks = '';
  myDiscount = 0;
  myCash = 0;
  myChange = 0;
  myBank = 0;
  myPaymentType = '';
  myDuplicateFlag = false;
  myTime:any;

  PrintAfterSave(InvNo:any){
    

    this.http.get(environment.mainApi+this.global.inventoryLink+'PrintBill?BillNo='+InvNo).subscribe(
      (Response:any)=>{
       
        this.myPrintTableData = Response;
        this.myInvoiceNo = InvNo;
        this.myInvDate = Response[0].createdOn ;
        this.myCounterName = Response[0].entryUser;
        this.mySubTotal = Response[0].billTotal;
        this.myNetTotal = Response[0].netTotal;
        this.myOtherCharges = Response[0].otherCharges;
        this.myRemarks = Response[0].remarks;
        this.myCash = Response[0].cashRec;
        this.myBank = Response[0].netTotal - Response[0].cashRec;
        this.myDiscount = Response[0].billDiscount;
        this.myChange = Response[0].change;
        this.myPaymentType = Response[0].paymentType;

        setTimeout(() => {
          this.global.printData('#cncBillPrint');
        }, 2000);
     
      }
    )


  
  }



}