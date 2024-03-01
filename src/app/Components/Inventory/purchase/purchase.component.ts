import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';

import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { AddpartyComponent } from '../../Company/party/addparty/addparty.component';
import { MatSelect } from '@angular/material/select';


@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit{
  companyProfile:any = [];
  crudList:any = {c:true,r:true,u:true,d:true};
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

    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });


    this.global.getProducts().subscribe(
      (data:any)=>{this.productList = data;})

  }

  
  ngOnInit(): void {
    this.global.setHeaderTitle('Purchase');
    // this.getProducts();
    this.getBooker();
    this.getLocation();
    this.getSuppliers();  
      $('.searchProduct').trigger('focus');

    
  }


  hideTotalFlag = true;

  projectID = this.global.InvProjectID;
  holdBtnType:any ='Hold';
  tabIndex:any;
  Date:Date = new Date()
  productImage:any;
  productName = '';
  PBarcode:string = '';   /// for Search barcode field
  productsData:any;   //// for showing the products
  tableDataList: any = [];          //////will hold data temporarily
  suppliersList:any;      //////  will shows the supplier list
  supplierDetail:any = [];

  myTotalQty:any = 0;
  subTotal= 0;

  myDue:any;
  holdBillList:any =[];

  refInvNo:any;
  invRemarks:any;
  locationID:any;
  overHead:any = 0;
  discount:any= 0;
  holdInvNo:any = '-';
  bookerID:any = 0;


  change(){
    //console.log(this.tableDataList);
  }


 
  currentPartyAddress:any;  /////////// will shows the current party address on page
  currentPartyCity:any;      /////////// will shows the current party City on page
  currentPartyMobile:any;   /////////// will shows the current party Mobile on page
  currentPartyCNIC:any;     /////////// will shows the current party CNIC on page


  partyID:any;               /////// will get the party id for Api
  invoiceDate = new Date;    //////////// invoice date for api



  productList:any = [];
  locationList:any = [];
  BookerList:any = [];



  dragFunc(e:any){
    
  }
   /////// to change the tab on edit

   changeTab(tabNum: any) {
    this.tabIndex = tabNum;

  }

  getBooker(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetBooker').subscribe(
      (Response:any)=>{
        this.BookerList = Response;
      }
    )
  }
  
  getLocation(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'getlocation').subscribe(
      (Response:any)=>{
        this.locationList = Response;
      }
    )
  }




  getSuppliers(){
    this.http.get(environment.mainApi+this.global.companyLink+'getsupplier').subscribe(
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


  focusto(cls:any,e:any){ 

   setTimeout(() => {
    $(cls).trigger('focus');
   }, 500);

   if(cls == 'ovhd' && e.keyCode == 13 ){
    if(e.target.value == ''){
      $('#ovhd').trigger('focus');
     
    }
   }

   if(cls == 'disc' && e.keyCode == 13){
    $('#disc').trigger('focus');
    
   }

   if(cls == 'savebtn' && e.keyCode == 13  ){
    $('#savebtn').trigger('focus');

   }

   

  }

  searchByCode(e:any){

    if(this.PBarcode !== ''){
      if(e.keyCode == 13){
        ///// check the product in product list by barcode
        var row =  this.productList.find((p:any)=> p.barcode == this.PBarcode);
   
        /////// check already present in the table or not
        if(row !== undefined){
          var condition = this.tableDataList.find(
            (x: any) => x.ProductID == row.productID
          );
      
          var index = this.tableDataList.indexOf(condition);
      
          //// push the data using index
          if (condition == undefined) {

         
            // this.app.startLoaderDark();
            this.global.getProdDetail(0,this.PBarcode).subscribe(
              (Response:any)=>{
                //console.log(Response)
                  this.tableDataList.push({
                    ProductID:Response[0].productID,
                    ProductTitle:Response[0].productTitle,
                    barcode:Response[0].barcode,
                    productImage:Response[0].productImage,
                    Quantity:1,
                    wohCP:Response[0].costPrice,
                    CostPrice:Response[0].costPrice,
                    SalePrice:Response[0].salePrice,
                    ovhPercent:0,
                    ovhAmount:0,
                    ExpiryDate:this.global.dateFormater(new Date(),'-'),
                    BatchNo:'-',
                    BatchStatus:'-',
                    UomID:Response[0].uomID,
                    Packing:1,
                    discInP:0,
                    discInR:0,
                    AQ:Response[0].aq,
              
                  });
                  this.getTotal();
            

                this.productImage = Response[0].productImage;
              }
            )
            

         
        }else {
          this.tableDataList[index].Quantity += 1;
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
      (x: any) => x.ProductID == data.productID
    );

    var index = this.tableDataList.indexOf(condition);



    if (condition == undefined) {

      this.app.startLoaderDark();

      this.global.getProdDetail(data.productID,'').subscribe(
        (Response:any)=>{
          //  console.log(Response);

          
            this.tableDataList.push({
              ProductID:Response[0].productID,
              ProductTitle:Response[0].productTitle,
              barcode:Response[0].barcode,
              productImage:Response[0].productImage,
              Quantity:1,
              wohCP:Response[0].costPrice,
              CostPrice:Response[0].costPrice,
              SalePrice:Response[0].salePrice,
              ovhPercent:0,
              ovhAmount:0,
              ExpiryDate:this.global.dateFormater(new Date(),'-'),
              BatchNo:'-',
              BatchStatus:'-',
              UomID:Response[0].uomID,
              Packing:1,
              discInP:0,
              discInR:0,
              AQ:Response[0].aq,
        
            })
            this.getTotal();
           
          
         this.productImage = Response[0].productImage;
        }
      )
  }else {
    this.tableDataList[index].Quantity += 1;
    this.productImage = this.tableDataList[index].productImage;
  }
  this.app.stopLoaderDark();
    this.productName = '';
    this.getTotal();
   setTimeout(() => {
    $('#psearchProduct').trigger('focus');
   }, 500);

  }


 

  delRow(item: any) {
    this.global.confirmAlert().subscribe(
      (Response:any)=>{
        if(Response == true){
   
    var index = this.tableDataList.indexOf(item);
    this.tableDataList.splice(index, 1);
    this.getTotal();
    this.rowFocused -= 1;
    $('.qty'+this.rowFocused).trigger('focus');
    
  

    }
   }
   )
    
  
    
  }

  EmptyData(){
    this.global.confirmAlert().subscribe(
      (Response:any)=>{
        if(Response == true){
          this.reset();

        }})
  }


  showImg(item:any){

    // this.global.getProdImage(item.productID).subscribe((data:any)=>{
    //   this.productImage = data[0].productImage;
      
    // });

    var index = this.tableDataList.findIndex((e:any)=> e.ProductID == item.ProductID);
    this.productImage = this.tableDataList[index].productImage;

  }

 

   rowFocused = -1;
  prodFocusedRow= 0;
   changeFocus(e:any, cls:any){

  if(e.target.value == ''){
    if(e.keyCode == 40){  
      if(this.tableDataList.length >= 1 ){ 
        this.rowFocused = 0; 
         $('.qty0').focus();
      }
     }
  }else{
    this.prodFocusedRow = 0;
      /////move down
      if(e.keyCode == 40){
        if(this.productList.length >= 1 ){  
          $('.prodRow0').focus();
          // e.which = 9;   
          // $('.prodRow0').trigger(e)  ;
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
         this.prodFocusedRow -= 1  ;
     } else {
         var clsName = cls + this.prodFocusedRow;    
        //  alert(clsName);
         $(clsName).trigger('focus');
        //  e.keyCode = 9;    
      
     }}
    //  alert(this.prodFocusedRow);
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

 
   changeValue(item:any){
    var myIndex = this.tableDataList.indexOf(item);
   // console.log(this.tableDataList[myIndex]);
    var myQty = this.tableDataList[myIndex].Quantity;
    var myCP = this.tableDataList[myIndex].CostPrice;
    var mySP = this.tableDataList[myIndex].SalePrice;
    if(myCP == null || myCP == '' || myCP == undefined){
     
      this.tableDataList[myIndex].CostPrice = 0;
    }else if(myQty == null || myQty == '' || myQty == undefined){
      this.tableDataList[myIndex].Quantity = 0;
    }else if(mySP == null || mySP == '' || mySP == undefined){
      this.tableDataList[myIndex].SalePrice = 0;
    }
    
   }

  handleNumKeys(item:any ,e:any,cls:string,index:any){

  //   if(e.keyCode == 9){
  //     if(cls == '.sp'){
  //       this.rowFocused = index + 1;
  //     }else{
  //       this.rowFocused = index ;
  //     }
      
  //   }

    
  //  if(e.shiftKey && e.keyCode == 9 ){
  
  //   if(cls == '.qty'){
  //     this.rowFocused = index - 1;
  //   }else{
  //     this.rowFocused = index ;
  //   }
  //  }

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
        // alert(clsName);   
        // e.which = e.ctrlKey + 97;
        $(clsName).trigger('focus');  
        // $(clsName).trigger(e);  
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
          // alert(clsName);
          $(clsName).trigger('focus');
          

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

  @ViewChild('supplier') myParty:any;

  addParty(){
    setTimeout(() => {
      this.myParty.close()
    }, 200);
    this.dialogue.open(AddpartyComponent,{
      width:"50%"
    }).afterClosed().subscribe(value=>{
      if(value == 'Update'){
        this.getSuppliers();
      }
    });
  }




  SaveBill(type:any){
    var isValidFlag = true;
  this.tableDataList.forEach((p:any) => {
    p.Quantity = parseFloat(p.Quantity);
    p.SalePrice = parseFloat(p.SalePrice);
    p.CostPrice = parseFloat(p.CostPrice);
        
      if(p.CostPrice > p.SalePrice || p.CostPrice == 0 || p.CostPrice == '0' || p.CostPrice == '' || p.CostPrice == undefined || p.CostPrice == null ){
        this.msg.WarnNotify('('+p.ProductTitle+') Cost Price is not Valid');
         isValidFlag = false;
        //  console.log(p)
         return;
      }

      if( p.SalePrice == 0 || p.SalePrice == '0' || p.SalePrice == '' || p.SalePrice == undefined || p.SalePrice == null ){
        this.msg.WarnNotify('('+p.ProductTitle+') Sale Price is not Valid');
         isValidFlag = false;
        //  console.log(p)
         return;
      }

      if(p.Quanity == 0 || p.Quantity == '0' || p.Quantity == null || p.Quantity == undefined || p.Quantity == ''){
        this.msg.WarnNotify('('+p.ProductTitle+') Quantity is not Valid');
         isValidFlag = false;
        //  console.log(p)
        //  console.log(this.tableDataList)
         return;
      }
      
     
   
    });



       
    if(this.tableDataList == ''){
      this.msg.WarnNotify('Atleast One Product Must Be Selected')
    }else if(this.locationID == '' || this.locationID == undefined || this.locationID == 0){
      this.msg.WarnNotify('Select Warehouse Location')
    }else if(this.refInvNo == '' || this.refInvNo == undefined){
      this.msg.WarnNotify('Enter Reference Invoice No')
    }else if(this.partyID == '' || this.partyID == 0 || this.partyID == undefined){
      this.msg.WarnNotify('Select Supplier Party')
    }else if(this.bookerID == 0 || this.bookerID == undefined){
      this.msg.WarnNotify("Select Booker")
    }else {

    
      if(this.discount == '' || this.discount == undefined){
        this.discount = 0;
      }
      if(this.overHead == '' || this.overHead == undefined){
        this.overHead = 0;
      }
      if(this.invRemarks == '' || this.invRemarks == undefined){
        this.invRemarks = '-';
      }

      if(isValidFlag == true){
        if(type == 'hold'){
          if(this.holdBtnType == 'Hold'){
           this.app.startLoaderDark();
           this.http.post(environment.mainApi+this.global.inventoryLink+'InsertPurchase',{
           InvType: "HP",
           InvDate: this.global.dateFormater(this.invoiceDate,'-'),
           RefInvoiceNo: this.refInvNo,
           PartyID: this.partyID,
           LocationID: this.locationID,
           ProjectID: this.projectID,
           BookerID: this.bookerID,
           BillTotal: this.subTotal,
           BillDiscount: this.discount,
           OverHeadAmount: this.overHead,
           NetTotal: this.subTotal - this.discount,
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
                 this.app.stopLoaderDark();
               }
             },
             (Error:any)=>{
              this.app.stopLoaderDark();
             }
           )
          }else if(this.holdBtnType == 'ReHold'){
            this.global.openPinCode().subscribe(pin=>{
             if(pin != ''){
               this.app.startLoaderDark();
          
           this.http.post(environment.mainApi+this.global.inventoryLink+'UpdateHoldInvoice',{
           InvBillNo: this.holdInvNo,
           InvDate: this.global.dateFormater(this.invoiceDate,'-'),
           RefInvoiceNo: this.refInvNo,
           PartyID: this.partyID,
           LocationID: this.locationID,
           ProjectID: this.projectID,
           BookerID: this.bookerID,
           BillTotal: this.subTotal,
           BillDiscount: this.discount,
           OverHeadAmount: this.overHead,
           NetTotal: this.subTotal - this.discount,
           Remarks: this.invRemarks,
           InvoiceDocument: "-",
           PinCode:pin,
           InvDetail: JSON.stringify(this.tableDataList),
       
           UserID: this.global.getUserID()
           }).subscribe(
             (Response:any)=>{
               if(Response.msg == 'Data Updated Successfully'){
                 this.msg.SuccessNotify(Response.msg);
                 this.reset(); 
                 this.app.stopLoaderDark();
                
               }else{
                 this.msg.WarnNotify(Response.msg);
                 this.app.stopLoaderDark();
               }
             },
             (Error:any)=>{
              this.app.stopLoaderDark();
             }
           )
             }
           })
          }
     
         }else if(type == 'purchase'){

          this.global.confirmAlert().subscribe(
            (Response:any)=>{
              if(Response == true){
   
              this.app.startLoaderDark();
              this.http.post(environment.mainApi+this.global.inventoryLink+'InsertPurchase',{
              InvType: "P",
              InvDate: this.global.dateFormater(this.invoiceDate,'-'),
              RefInvoiceNo: this.refInvNo,
              PartyID: this.partyID,
              LocationID: this.locationID,
              ProjectID: this.projectID,
              BookerID: this.bookerID,
              BillTotal: this.subTotal,
              BillDiscount: this.discount,
              OverHeadAmount: this.overHead,
              NetTotal: this.subTotal - this.discount,
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
                    this.app.stopLoaderDark();
                  }
                },
                (Error:any)=>{
                  this.app.stopLoaderDark();
                }
              )
      
          }
         }
         )
          

          
        
         }
     
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
    this.overHead = 0;
    this.invRemarks = '';
    this.subTotal = 0;
    this.productImage = '';
    this.partyID = 0;
    this.myTotalQty = 0;
    this.holdInvNo = '-';
    this.bookerID = 0;
    this.invRemarks = '';
    this.holdBtnType = 'Hold';
    this.holdBillList = [];
    this.netTotal = 0;
    


  }


  netTotal = 0;

  getTotal() {
   
    // alert(this.overHead);
    // alert(this.discount);
    this.subTotal = 0;
    this.myTotalQty = 0;
    this.netTotal = 0;
  
    if(this.discount == '' ){
      this.discount = 0;
    }
    if(this.overHead == ''){
      this.overHead = 0;
    }

    for (var i = 0; i < this.tableDataList.length; i++) {
   
      this.subTotal += (parseFloat(this.tableDataList[i].Quantity) * parseFloat(this.tableDataList[i].CostPrice));
      this.myTotalQty += parseFloat(this.tableDataList[i].Quantity);
    
     
    }
    this.netTotal =( this.subTotal + parseFloat(this.overHead)) - parseFloat(this.discount)
  
   
  }


  myInvoiceNo:any;
  myInvoiceDate:any;
  myLocation:any;
  myRefInvNo:any;
  mydiscount:any;
  myOverHeadAmount:any;
  myInvRemarks:any;
  myBookerName:any;
  myPartyName:any;
  mySubTotal:any;
  myTableDataList:any = [];
  myBillTotalQty = 0;
  mywohCPTotal = 0;
  myCPTotal = 0;
  mySPTotal = 0;
  myBillStatus = false;


  printBill(item:any){
    this.myTableDataList = [];
    this.myInvoiceNo = item.invBillNo;
    this.myInvoiceDate = new Date(item.invDate);
    this.myLocation = item.locationTitle;
    this.myRefInvNo = item.refInvoiceNo;
    this.mydiscount = item.billDiscount;
    this.myOverHeadAmount = item.overHeadAmount;
    this.myInvRemarks = item.remarks;
    this.myBookerName = item.bookerName;
    this.myPartyName = item.partyName;
    this.mySubTotal = item.billTotal;
    this.myBillStatus = item.approvedStatus;

    this.getBillDetail(item.invBillNo).subscribe(
      (Response:any)=>{
        var totalQty = 0 ;
        var overhead = 0
        this.myBillTotalQty = 0;
        this.mywohCPTotal = 0;
        this.myCPTotal = 0;
        this.mySPTotal = 0;
       
        this.productImage = Response[Response.length - 1].productImage;

       if(item.overHeadAmount > 0){
        Response.forEach((j:any) => {
          totalQty += j.quantity;
        });
     
         overhead = item.overHeadAmount / totalQty;
        // console.log(item.overHeadAmount,totalQty,overhead);
 
       }

          Response.forEach((e:any) => {
            this.myBillTotalQty += e.quantity;
            this.mywohCPTotal += (e.costPrice - overhead)* e.quantity;
            this.myCPTotal += e.costPrice * e.quantity;
            this.mySPTotal += e.salePrice * e.quantity;

            this.myTableDataList.push({
              ProductID:e.productID,
              ProductTitle:e.productTitle,
              barcode:e.barcode,
              productImage:e.productImage,
              Quantity:e.quantity,
              wohCP:(e.costPrice - overhead) ,
              CostPrice:e.costPrice,
              SalePrice:e.salePrice,
              ExpiryDate:this.global.dateFormater(new Date(e.expiryDate),'-'),
              BatchNo:e.batchNo,
              BatchStatus:e.batchStatus,
              UomID:e.uomID,
              Packing:e.packing,
              discInP:e.discInP,
              discInR:e.discInR,
            })
          });

          // console.log(this.tableDataList);
          setTimeout(() => {
            this.global.printData('#printDiv')
          }, 200);
        
      }
    )



  }

  cpTotal = 0;
  wohCPTotal = 0;
  retriveBill(item:any){

    //console.log(item);
    this.tableDataList = [];
    this.holdBtnType = 'ReHold'
    this.invoiceDate = new Date(item.invDate);
    this.locationID = item.locationID;
    this.refInvNo = item.refInvoiceNo;
    this.discount = item.billDiscount;
    this.overHead = item.overHeadAmount;
    this.invRemarks = item.remarks;
    this.holdInvNo = item.invBillNo;
    this.bookerID = item.bookerID;
    this.partyID = item.partyID;
    this.onPartySelected();

    this.getBillDetail(item.invBillNo).subscribe(
      (Response:any)=>{
       
        this.myTotalQty = 0;
        this.productImage = Response[Response.length - 1].productImage;

          Response.forEach((e:any) => {
            this.myTotalQty += e.quantity;
            this.tableDataList.push({
              ProductID:e.productID,
              ProductTitle:e.productTitle,
              barcode:e.barcode,
              productImage:e.productImage,
              Quantity:e.quantity,
              wohCP:e.costPrice  ,
              CostPrice:e.costPrice,
              SalePrice:e.salePrice,
              ExpiryDate:this.global.dateFormater(new Date(e.expiryDate),'-'),
              BatchNo:e.batchNo,
              BatchStatus:e.batchStatus,
              UomID:e.uomID,
              Packing:e.packing,
              discInP:e.discInP,
              discInR:e.discInR,
              AQ:e.aq,
            })
          });
          this.getTotal();

        
      }
    )

  }


  public getBillDetail(billNo:any):Observable<any>{
   return this.http.get(environment.mainApi+this.global.inventoryLink+'GetSingleBillDetail?reqInvBillNo='+billNo).pipe(retry(3));
  }



  findHoldBills(type:any){
    if(type == 'hp'){
      $('#edit').show();
    }

    if(type == 'p'){
      $('#edit').hide()
    }

    this.http.get(environment.mainApi+this.global.inventoryLink+'GetInventoryBillSingleDate?Type='+type+'&creationdate='+this.global.dateFormater(this.Date,'-')).subscribe(
      (Response:any)=>{
      
         this.holdBillList = [];
         if(type == 'hp'){
           Response.forEach((e:any) => {
             if(e.approvedStatus == false){
               this.holdBillList.push(e);
             }
           });
         }
         if(type == 'p'){
           this.holdBillList = Response;
         }
      }
    )
  }



}
