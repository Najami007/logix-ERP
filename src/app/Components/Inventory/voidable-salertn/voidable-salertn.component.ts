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

import { Observable, retry } from 'rxjs';
import { VrtnenterqtyComponent } from './vrtnenterqty/vrtnenterqty.component';
import { VrtnsavedbillComponent } from './vrtnsavedbill/vrtnsavedbill.component';

@Component({
  selector: 'app-voidable-salertn',
  templateUrl: './voidable-salertn.component.html',
  styleUrls: ['./voidable-salertn.component.scss']
})
export class VoidableSalertnComponent implements OnInit {

  ////////////////// will give the current tab visible status
    
  @HostListener('document:visibilitychange', ['$event'])

  appVisibility() {
    if (document.hidden) { 

     } 
     else {
       this.getCurrentBill();
     }
 }
 companyProfile: any = [];
 companyLogo: any = '';
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
      // console.log(this.crudList);
    })

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
      this.companyLogo = data[0].companyLogo1;
      this.CompanyMobile = data[0].companyMobile;
      this.companyAddress = data[0].companyAddress;
      this.companyName = data[0].companyName;
    });


    this.global.getProducts().subscribe(
      (data:any)=>{this.productList = data;})

  }
  ngOnInit(): void {
   this.global.setHeaderTitle('Sale Return');
   this.getBankList();
   this.getCurrentBill();
   $('#vsrtnsearchProduct').trigger('focus');
   
  }

 
  billRemarks = '';

  productList:any = [];
  bankCoaList:any =[];
  projectID = 1;
  InvDate = new Date();
  PBarcode:any = '';
  tableDataList:any = [];
  productImage:any;
  discount:any = 0;
  otherCharges:any = 0;
  change = 0;
  paymentType = 'Cash';
  cash:any = 0;
  bankCash:any = 0;
  bankCoaID = 0;

  subTotal = 0;
  netTotal = 0;
  totalQty = 0;
 
  customerName = '' ;
  customerMobileno = '';

  savedBillList:any = [];
  curDate = new Date();

  tempQty = 1;
  tempProdRow:any;


  invBillNo = '';
  

  //////////////////////////////////////////////////////////////////////////////////
  getCurrentBill(){
    
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetSaleExistingBill?reqUserID='+this.global.getUserID()).subscribe(
      (Response:any)=>{
        this.tableDataList = [];
       if(Response != ''){
        this.invBillNo = Response[0].invBillNo;
       }
         //console.log(Response);
        // this.tableDataList = Response;
        
        Response.forEach((e:any) => {
          this.tableDataList.push({
            productID:e.productID,
            productTitle:e.productTitle,
            barcode:e.barcode,
            productImage:e.productImage,
            quantity:e.quantity,
            wohCP:e.costPrice,
            costPrice:e.costPrice,
            avgCostPrice:e.avgCostPrice,
            salePrice:e.salePrice,
            ovhPercent:0,
            ovhAmount:0,
            expiryDate:this.global.dateFormater(new Date(),'-'),
            batchNo:'-',
            batchStatus:'-',
            uomID:e.uomID,
            packing:1,
            discInP:0,
            discInR:0,
            aq:e.aq,
            autoInvDetID:e.autoInvDetID,
      
          })
        });

        if(Response != ''){
          this.productImage = Response[0].productImage;
        }
        this.getTotal();
    
        
      }
    )
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
        //console.log(Error);
      }
    )
  }

//////////////////////////////////////////////////////////////////////////////////

  holdDataFunction(data:any){

  
        this.http.post(environment.mainApi+this.global.inventoryLink+'AddSaleRtnProduct',{
          PartyID: 0,
          ProductID: data.productID,
          Barcode: "",
      
          UserID: this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Saved Successfully'){
              this.getCurrentBill();
            }else{
              this.msg.WarnNotify(Response.msg);
            }
          }
        )
        $('.rtnBillArea').scrollTop(0);
      this.PBarcode = '';
      $('#vsrtnsearchProduct').trigger('focus');
       this.getTotal();
    }

//////////////////////////////////////////////////////////////////////////////////
  searchByCode(e:any){

    if(this.PBarcode !== ''){

      if(e.keyCode == 13){
        this.http.post(environment.mainApi+this.global.inventoryLink+'AddSaleRtnProduct',{
          PartyID: 0,
          ProductID: 0,
          Barcode: this.PBarcode,
      
          UserID: this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Saved Successfully'){
              this.getCurrentBill();
            }else{
              this.msg.WarnNotify(Response.msg);
            }
          }
        )
        $('.rtnBillArea').scrollTop(0);
       this.PBarcode = '';
       this.getTotal();
   
       }
    }

   
  }

//////////////////////////////////////////////////////////////////////////////////

    getTotal() {
      // alert();
      this.subTotal = 0;
      this.totalQty = 0;
      this.netTotal = 0;
      for (var i = 0; i < this.tableDataList.length; i++) {
     
        this.subTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].salePrice));
        this.totalQty += parseFloat(this.tableDataList[i].quantity);

      }
      
      if(this.discount == ''){
        this.discount = 0;
      }
      if(this.otherCharges == 0){
        this.otherCharges = 0;
      }
      if(this.cash == ''){
        this.cash = 0;
      }


      this.netTotal = (this.subTotal + parseFloat(this.otherCharges) ) - parseFloat(this.discount);
      this.change =  (parseFloat(this.cash) + parseFloat(this.bankCash)) - this.netTotal;
    }

//////////////////////////////////////////////////////////////////////////////////
  
    rowFocused = -1;
    prodFocusedRow = 0;

    handleProdFocus(item:any,e:any,cls:any,endFocus:any, prodList:[]){
       
      if(e.keyCode == 9 && !e.shiftKey){
        this.prodFocusedRow += 1;

      }
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

       

    focusTo(e:any,cls:string){
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
      //  var elem = document.getElementById('save');
      //  elem?.focus();
      }

      if(cls == '#vsrtnsearchProduct' && e.keyCode == 13 ){
        $(cls).trigger('focus');
      }
    
    }
  
    handleNumKeys(item:any ,e:any,cls:string,index:any){
  
     if(e.keyCode == 9){
      this.rowFocused = index +1;
     }
  
     if(e.shiftKey && e.keyCode == 9 ){
    
      this.rowFocused = index - 1;
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
  

//////////////////////////////////////////////////////////////////////////////////


    delRow(item: any) {


      if (this.invBillNo != '') {
        Swal.fire({
          title: 'Alert!',
          text: 'Confirm to Void Product',
          position: 'center',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
        }).then((result) => {
  
          if (result.isConfirmed) {
            this.global.openPassword('Password').subscribe(pin => {
              if (pin !== '') {
                this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
                  RestrictionCodeID: 1,
                  Password: pin,
                  UserID: this.global.getUserID()
  
                }).subscribe(
                  (Response: any) => {
                    if (Response.msg == 'Password Matched Successfully') {
  
                        this.voidProduct(item);
  
                    } else {
                      this.msg.WarnNotify(Response.msg);
                    }
                  }
                )
  
  
  
              }
            })
          }
  
  
        })
      }
  

  
    
      
    }


 //////////////////////////////////////////////////////////////////////////////////

   


//////////////////////////////////////////////////////////////////////////////////

    changeValue(item:any){
      var myIndex = this.tableDataList.indexOf(item);
     // console.log(this.tableDataList[myIndex]);
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
     }

 //////////////////////////////////////////////////////////////////////////////////
     
     showImg(item:any){
    
      var index = this.tableDataList.findIndex((e:any)=> e.productID == item.productID);
      this.productImage = this.tableDataList[index].productImage;
    
    }

  //////////////////////////////////////////////////////////////////////////////////

    save(){

      if(this.paymentType == 'Cash' && (this.cash == 0 || this.cash == undefined || this.cash == null)){
        this.msg.WarnNotify('Enter Cash')
      }else if(this.paymentType == 'Cash' && this.cash < this.netTotal){
        this.msg.WarnNotify('Entered Cash is not Valid')
      }else if ( this.paymentType == 'Split' && ((this.cash + this.bankCash) > this.netTotal || (this.cash + this.bankCash) < this.netTotal)) {
        this.msg.WarnNotify('Amount in Not Valid')
      } else if ( this.paymentType == 'Bank' && (this.bankCash < this.netTotal) || (this.bankCash > this.netTotal)) {
        this.msg.WarnNotify('Enter Valid Amount')
      }else if(this.customerName =='' && this.customerMobileno != ''){
        this.msg.WarnNotify('Enter Customer Name')
      }else if(this.customerName !='' && this.customerMobileno == ''){
        this.msg.WarnNotify('Enter Customer Mobile')
      }else {
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+this.global.inventoryLink+'InsertVoidableSaleRtn',{
          HoldInvNo: this.invBillNo,
          InvDate: this.global.dateFormater(this.InvDate,'-'),
          PartyID: 0,
          InvType: "SR",
          ProjectID: this.projectID,
          BookerID: 0,
          PaymentType: this.paymentType,
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
          CusContactNo: this.customerMobileno,
          CusName: this.customerName,
          SaleDetail: JSON.stringify(this.tableDataList),
          UserID:this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Saved Successfully'){
              this.msg.SuccessNotify(Response.msg);
              console.log(Response);
              this.PrintAfterSave(Response.invNo);
              this.getCurrentBill();
              this.reset();
              $('#vssearchProduct').trigger('focus');
            }else{
              this.msg.WarnNotify(Response.msg);
            }
            this.app.stopLoaderDark();
          }
        )
      }

    

    }
  
  //////////////////////////////////////////////////////////////////////////////////


    reset(){
      this.PBarcode = '';
      this.tableDataList = [];
      this.subTotal = 0;
      this.discount = 0;
      this.netTotal = 0;
      this.totalQty = 0;
      this.rowFocused = 0;
      this.prodFocusedRow = 0;
      this.otherCharges = 0;  
      this.paymentType = 'Cash';
      this.change = 0;
      this.cash = 0;
      this.bankCash = 0;
      this.customerMobileno = '';
      this.customerName = '';
      

    }
    

  //////////////////////////////////////////////////////////////////////////////////
    


  openQtyModal(e:any,item:any){
       if(e.keyCode == 13 || e.button == 0){
      //  $('#qtyModal').show();
      this.dialogue.open(VrtnenterqtyComponent,{
        width:'20%',
        data:item.quantity,
      disableClose:true,
      hasBackdrop:true,
      }).afterClosed().subscribe(qty=>{
          setTimeout(() => {
            $('.qty'+this.rowFocused.toString()).trigger('focus');
          }, 500);
        if(qty != ''){
          /////////////////////////// checking whether quantity increase and trigger api
          if(qty > item.quantity){
            this.http.post(environment.mainApi+this.global.inventoryLink+'AddSaleQuantity',{
              InvBillNo: this.invBillNo,
              ProductID: item.productID,
              Quantity: qty - item.quantity,
          
              UserID: this.global.getUserID(),
            }).subscribe(
              (Response:any)=>{
                if(Response.msg == 'Data Updated Successfully'){
                  this.getCurrentBill();
                }else{
                  this.msg.WarnNotify(Response.msg);
                }
              }
            )
          }

           /////////////////////////// checking whether quantity decrease and trigger void
          if(qty < item.quantity){
            this.http.post(environment.mainApi+this.global.inventoryLink+'VoidProduct',{
              InvBillNo: this.invBillNo,
              ProductID: item.productID, 
              ProductTitle: item.productTitle,
              Quantity:item.quantity - qty, 
              CostPrice: item.costPrice,
              AvgCostPrice: item.avgCostPrice,
              SalePrice: item.salePrice,
              ReqRefNo: item.autoInvDetID,
          
              UserID: this.global.getUserID(),
            }).subscribe(
              (Response:any)=>{
                if(Response.msg == 'Data Saved Successfully'){
                  this.getCurrentBill();
                }else{
                  this.msg.WarnNotify(Response.msg);
                }
              }
            )
            
          }
        }
      })

      } 
  }
  

  //////////////////////////////////////////////////////////////////////////////////


  voidBill(){

    if (this.tableDataList.length > 0) {
      Swal.fire({
        title: 'Alert!',
        text: 'Confirm to Void Full Bill',
        position: 'center',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
      }).then((result) => {

        if (result.isConfirmed) {
          this.global.openPassword('Password').subscribe(pin => {
            if (pin !== '') {
              this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
                RestrictionCodeID: 1,
                Password: pin,
                UserID: this.global.getUserID()

              }).subscribe(
                (Response: any) => {
                  if (Response.msg == 'Password Matched Successfully') {
                    this.app.startLoaderDark();
                    this.http.post(environment.mainApi+this.global.inventoryLink+'VoidAllProducts',{
                      InvBillNo: this.invBillNo,
                      SaleDetail: JSON.stringify(this.tableDataList),  
                      UserID: this.global.getUserID(),
                    }).subscribe(
                      (Response:any)=>{
                        if(Response.msg == 'Data Saved Successfully'){
                          this.getCurrentBill();
                          $(".searchProduct").trigger('focus');
                        }else{
                          this.msg.WarnNotify(Response.msg);
                        }
                        this.app.stopLoaderDark();
                      }
                    )

                  } else {
                    this.msg.WarnNotify(Response.msg);
                  }
                }
              )



            }
          })
        }


      })
    }

  
  }

  ///////////////////////////////////////////////////////////////////////////////

  voidProduct(item:any){
    // console.log(item);
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+this.global.inventoryLink+'VoidProduct',{
      InvBillNo: this.invBillNo,
      ProductID: item.productID, 
      ProductTitle: item.productTitle,
      Quantity:item.quantity, 
      CostPrice: item.costPrice,
      AvgCostPrice: item.avgCostPrice,
      SalePrice: item.salePrice,
      ReqRefNo: item.autoInvDetID,
  
      UserID: this.global.getUserID(),
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.getCurrentBill();
          $(".searchProduct").trigger('focus');
          $('.rtnBillArea').scrollTop(0);
        }else{
          this.msg.WarnNotify(Response.msg);
        }
        this.app.stopLoaderDark();
      }
    )
  }


  openSavedBill(){
    this.dialogue.open(VrtnsavedbillComponent,{
      width:'60%',
    }).afterClosed().subscribe(
      
    )
  }




  savedbillList:any = [];
  
  
  
  myPrintData: any = [];
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
    //console.log(item)
    

    this.http.get(environment.mainApi+this.global.restaurentLink+'PrintBill?BillNo='+InvNo).subscribe(
      (Response:any)=>{
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
        //console.log(Response);
        this.myPrintData = Response;
      }
    )


    setTimeout(() => {
      this.global.printData('#printBill');
    }, 500);
  }


}
