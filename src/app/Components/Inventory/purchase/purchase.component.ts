import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { retry } from 'rxjs';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit{

  crudList:any = [];
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

  }

  
  ngOnInit(): void {
    this.global.setHeaderTitle('Purchase');
    this.getProducts();
    this.getLocation();
    this.getSuppliers();
  }

  holdBtnType:any ='Hold';
  tabIndex:any;
  Date:Date = new Date()
  productImage:any;

  PBarcode:string = '';   /// for Search barcode field
  productsData:any;   //// for showing the products
  tableDataList: any = [];          //////will hold data temporarily
  suppliersList:any;      //////  will shows the supplier list
  supplierDetail:any = [];

  myTotalQty:any;
  mySubtotal= 0;
  myTotal:any;
  myDue:any;
  holdBillList:any =[];

  refInvNo:any;
  invRemarks:any;
  locationID:any;
  overheadAmount:any;
  discount:any= 0;
  holdInvNo:any = 0;


  change(){
    console.log(this.tableDataList);
  }


 
  currentPartyAddress:any;  /////////// will shows the current party address on page
  currentPartyCity:any;      /////////// will shows the current party City on page
  currentPartyMobile:any;   /////////// will shows the current party Mobile on page
  currentPartyCNIC:any;     /////////// will shows the current party CNIC on page


  partyID:any;               /////// will get the party id for Api
  invoiceDate = new Date;    //////////// invoice date for api



  productList:any = [];
  locationList:any = [];


   /////// to change the tab on edit

   changeTab(tabNum: any) {
    this.tabIndex = tabNum;

  }

  
  getLocation(){
    this.http.get(environment.mainApi+'inv/getlocation').subscribe(
      (Response:any)=>{
        this.locationList = Response;
      }
    )
  }


  getProducts(){
    this.http.get(environment.mainApi+'inv/GetActiveProduct').subscribe(
      (Response)=>{
        this.productList = Response;
       // console.log(Response);
 
      }
    )
  }


  getSuppliers(){
    this.http.get(environment.mainApi+'cmp/getsupplier').subscribe(
      {
        next:value =>{
          this.suppliersList = value;
        },
        error: error=>{
          this.msg.WarnNotify('Error Occured While Loading Data')  
        }         
      }
      )
  }


  holdDataFunction(data:any){

   

    var condition = this.tableDataList.find(
      (x: any) => x.ProductID == data.productID
    );

    var index = this.tableDataList.indexOf(condition);

    if (condition == undefined) {

    //console.log(data);
    this.tableDataList.push({
      ProductID:data.productID,
      ProductTitle:data.productTitle,
      barcode:data.barcode,
      productImage:data.productImage,
      Quantity:1,
      wohCP:data.costPrice,
      CostPrice:data.costPrice,
      SalePrice:data.salePrice,
      ExpiryDate:this.global.dateFormater(new Date(),'-'),
      BatchNo:'-',
      BatchStatus:'-',
      UomID:data.uomID,
      Packing:1,
      discPercent:data.discPercentage,
      disRupee:data.discRupees,
     

    })

    this.productImage = data.productImage;
    this.getTotal();
    this.PBarcode = '';
    $('#searchProduct').trigger('focus');
  }else {
    this.tableDataList[index].Quantity += 1;
    this.productImage = this.tableDataList[index].productImage;
    this.getTotal();
    this.PBarcode = '';
    $('#searchProduct').trigger('focus');
  }
  

    this.PBarcode = '';
  }


  getTotal() {
    this.mySubtotal = 0;
    this.myTotalQty = 0;
    for (var i = 0; i < this.tableDataList.length; i++) {
      this.mySubtotal +=
        this.tableDataList[i].Quantity * this.tableDataList[i].CostPrice;
      this.myTotalQty += parseFloat(this.tableDataList[i].Quantity);
      // this.myTotal = this.mySubtoatal - this.myDiscount;
      // this.myDue = this.myPaid - this.myTotal;
    }
  }


  delRow(item: any) {
    var index = this.tableDataList.findIndex((e:any)=> e.productID == item.productID);
    this.tableDataList.splice(index, 1);
    this.getTotal();
    
  }


  onRowClick(item:any){
    var index = this.tableDataList.findIndex((e:any)=> e.ProductID == item.ProductID);
    this.productImage = this.tableDataList[index].productImage;
  }

   rowFocused = 0;

   focusToQty(e:any){
    if(e.keyCode == 40){
      
      if(this.tableDataList.length > 1 ){  
         $('.qty0').trigger('focus');

      }
     }
   }

  handleNumKeys(item:any ,e:any){

    var indexN0 = this.tableDataList.indexOf(item);

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
        var clsName = ".qty" + this.rowFocused;
        
        $(clsName).trigger('focus');
       
    }
      
     }
    }


     //Move up
     if (e.keyCode == 38) {

      if (this.rowFocused == 0) {
          $(".searchProduct").trigger('focus');
          this.rowFocused = 0;
 
      }

      if (this.tableDataList.length > 1) {

          this.rowFocused -= 1;

          var clsName = ".qty" + this.rowFocused;
          $(clsName).focus();
          

      }

  }

    ////removeing row
    if (e.keyCode == 46) {

      this.delRow(item);
      this.rowFocused = 0;
  }

  }


  onPartySelected(){
    this.supplierDetail = this.suppliersList.find((e:any)=>e.partyID == this.partyID);
 
  }





  SaveBill(type:any){
    if(this.tableDataList == ''){
      this.msg.WarnNotify('Atleast One Product Must Be Selected')
    }else if(this.locationID == '' || this.locationID == undefined || this.locationID == 0){
      this.msg.WarnNotify('Select Warehouse Location')
    }else if(this.refInvNo == '' || this.refInvNo == undefined){
      this.msg.WarnNotify('Enter Reference Invoice No')
    }else if(this.partyID == '' || this.partyID == 0 || this.partyID == undefined){
      this.msg.WarnNotify('Select Supplier Party')
    }else {

      if(this.discount == '' || this.discount == undefined){
        this.discount = 0;
      }
      if(this.overheadAmount == '' || this.overheadAmount != undefined){
        this.overheadAmount = 0;
      }
      if(this.invRemarks == '' || this.invRemarks == undefined){
        this.invRemarks = '-';
      }
    
        if(type == 'hold'){
         if(this.holdBtnType == 'hold'){
          this.app.startLoaderDark();
          this.http.post(environment.mainApi+'inv/InsertPurchase',{
          InvType: "HP",
          InvDate: this.global.dateFormater(this.invoiceDate,'-'),
          RefInvoiceNo: this.refInvNo,
          PartyID: this.partyID,
          LocationID: this.locationID,
          ProjectID: 1,
          BookerID: 0,
          BillTotal: this.mySubtotal,
          BillDiscount: this.discount,
          OverHeadAmount: this.overheadAmount,
          NetTotal: this.mySubtotal - this.discount,
          Remarks: this.invRemarks,
          InvoiceDocument: "-",
      
          InvDetail: JSON.stringify(this.tableDataList),
      
          UserID: this.global.getUserID()
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Saved Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.reset(); 
                this.app.stopLoaderDark();
               
              }else{
                this.msg.WarnNotify(Response.msg);
              }
            }
          )
         }else if(this.holdBtnType == 'rehold'){
          this.dialogue.open(PincodeComponent,{
            width:"30%"
          }).afterClosed().subscribe(pin=>{
            if(pin != ''){
              this.app.startLoaderDark();
          this.http.post(environment.mainApi+'inv/UpdateHoldInvoice',{
          InvBillNo: this.holdInvNo,
          InvDate: this.global.dateFormater(this.invoiceDate,'-'),
          RefInvoiceNo: this.refInvNo,
          PartyID: this.partyID,
          LocationID: this.locationID,
          ProjectID: 1,
          BookerID: 0,
          BillTotal: this.mySubtotal,
          BillDiscount: this.discount,
          OverHeadAmount: this.overheadAmount,
          NetTotal: this.mySubtotal - this.discount,
          Remarks: this.invRemarks,
          InvoiceDocument: "-",
          PinCode:pin,
          InvDetail: JSON.stringify(this.tableDataList),
      
          UserID: this.global.getUserID()
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Saved Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.reset(); 
                this.app.stopLoaderDark();
               
              }else{
                this.msg.WarnNotify(Response.msg);
              }
            }
          )
            }
          })
         }
    
        }else if(type == 'purchase'){
          this.app.startLoaderDark();
          this.http.post(environment.mainApi+'inv/InsertPurchase',{
          InvType: "P",
          InvDate: this.global.dateFormater(this.invoiceDate,'-'),
          RefInvoiceNo: this.refInvNo,
          PartyID: this.partyID,
          LocationID: this.locationID,
          ProjectID: 1,
          BookerID: 0,
          BillTotal: this.mySubtotal,
          BillDiscount: this.discount,
          OverHeadAmount: this.overheadAmount,
          NetTotal: this.mySubtotal - this.discount,
          Remarks: this.invRemarks,
          InvoiceDocument: "-",
          HoldInvNo:this.holdInvNo,
      
          InvDetail: JSON.stringify(this.tableDataList),
      
          UserID: this.global.getUserID()
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Saved Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.reset(); 
                this.app.stopLoaderDark();
               
              }else{
                this.msg.WarnNotify(Response.msg);
              }
            }
          )
        }
    }
   
  }


  reset(){
    this.PBarcode = '';
    this.invoiceDate = new Date();
    this.tableDataList = [];
    this.locationID = 0;
    this.refInvNo = '';
    this.discount = 0;
    this.overheadAmount = '';
    this.invRemarks = '';
    this.mySubtotal = 0;
    this.productImage = '';
    this.partyID = '';


  }


  distributeOverHead(e:any){
    
   if(e.keyCode == 13){
    var amount = this.overheadAmount / this.myTotalQty;
    for(var i=0; i<this.tableDataList.length;i++){this.tableDataList[i].CostPrice = this.tableDataList[i].wohCP + amount}    
    this.getTotal();

   }

  }




  findHoldBills(){
    this.http.get(environment.mainApi+'inv/GetInventoryBillSingleDate?Type=hp&creationdate='+this.global.dateFormater(this.Date,'-')).subscribe(
      (Response:any)=>{
        this.holdBillList = Response;
        console.log(this.holdBillList);
      }
    )
  }

}
