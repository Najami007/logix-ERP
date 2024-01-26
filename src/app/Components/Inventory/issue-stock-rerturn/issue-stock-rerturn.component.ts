import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';

@Component({
  selector: 'app-issue-stock-rerturn',
  templateUrl: './issue-stock-rerturn.component.html',
  styleUrls: ['./issue-stock-rerturn.component.scss']
})
export class IssueStockRerturnComponent implements OnInit {

  crudList:any =[];
  companyProfile:any = [];

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private global:GlobalDataModule,
    private dialog:MatDialog,
    private route:Router
  ){

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      // console.log(this.crudList);
    })

    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });
  }



  ngOnInit(): void {
   this.global.setHeaderTitle('Issuance');
   this.getLocation();
   this.getProducts();

  }

  Date:Date = new Date();
  holdInvNo = '-';
  holdBtnType = 'Hold';
  invoiceDate:Date = new Date();
  locationID  = 0;
  locationTitle = '';
  locationList:any = [];
  locationTwoID = 0;
  locationTwoTitle= '';
  invRemarks:any;
  PBarcode:any;
  productList:any = [];
  tableDataList:any = [];

  productImage:any;
  subTotal:number = 0;
  totalQty:number = 0;
  IssueType:any;
  IssueBillList:any = [];
  
  onLocationSelected(type:any){
 
    if(type == 'l1'){
      var row =   this.locationList.find((e:any)=>e.locationID == this.locationID);
      this.locationTitle = row.locationTitle;
    
    }
    if(type == 'l2'){
      var lRow =   this.locationList.find((e:any)=>e.locationID == this.locationTwoID);
      this.locationTwoTitle = lRow.locationTitle;

    }
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
      
          //console.log(data);
          this.tableDataList.push({
            productID:row.productID,
            productTitle:row.productTitle,
            barcode:row.barcode,
            productImage:row.productImage,
            quantity:1,
            avgCostPrice:row.avgCostPrice,
            costPrice:row.costPrice,
            salePrice:row.salePrice,
            expiryDate:this.global.dateFormater(new Date(),'-'),
            batchNo:'-',
            batchStatus:'-',
            uomID:row.uomID,
            packing:1,
            discInP:0,
            discInR:0,
      
          })
      
          this.productImage = row.productImage;
        
          this.PBarcode = '';
          $('#searchProduct').trigger('focus');
        }else {
          this.tableDataList[index].quantity += 1;
          this.productImage = this.tableDataList[index].productImage;
       
          this.PBarcode = '';
          $('#searchProduct').trigger('focus');
        }
        }else{
          this.msg.WarnNotify('Product Not Found')
        }
     
       
       this.PBarcode = '';
   
       }
    }

   
  }

  holdDataFunction(data:any){
  var condition = this.tableDataList.find(
      (x: any) => x.productID == data.productID
    );

    var index = this.tableDataList.indexOf(condition);

    if (condition == undefined) {

    //console.log(data);
    this.tableDataList.push({
      productID:data.productID,
      productTitle:data.productTitle,
      barcode:data.barcode,
      productImage:data.productImage,
      quantity:1,
      avgCostPrice:data.avgCostPrice,
      costPrice:data.costPrice,
      salePrice:data.salePrice,
      expiryDate:this.global.dateFormater(new Date(),'-'),
      batchNo:'-',
      batchStatus:'-',
      uomID:data.uomID,
      packing:1,
      discInP:0,
      discInR:0,
     

    })

    // console.log(this.tableDataList);

    this.productImage = data.productImage;
    
    this.PBarcode = '';
    $('#searchProduct').trigger('focus');
  }else {
    this.tableDataList[index].quantity += 1;
    this.productImage = this.tableDataList[index].productImage;
    
    this.PBarcode = '';
    $('#searchProduct').trigger('focus');
  }

  this.getTotal();
    this.PBarcode = '';
    return false;
  }


  showImg(item:any){
    
    var index = this.tableDataList.findIndex((e:any)=> e.productID == item.productID);
    this.productImage = this.tableDataList[index].productImage;
  
  }

  getTotal() {
    this.subTotal = 0;
    this.totalQty = 0;
    for (var i = 0; i < this.tableDataList.length; i++) {
   
      this.subTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].costPrice));
      this.totalQty += parseFloat(this.tableDataList[i].quantity);
      // this.myTotal = this.mySubtoatal - this.myDiscount;
      // this.myDue = this.myPaid - this.myTotal;\
    

     // console.log(this.tableDataList)
    }
  }

  rowFocused = 0;
  handleNumKeys(item:any ,e:any,cls:string){

   

    // if (e.target.value < '0') {
    //   e.target.value = 0;
    // }else if(e.target.value == ''){
    //   e.target.value = 0
    // }



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

  focusToQty(e:any){
    if(e.keyCode == 40){
      
      if(this.tableDataList.length >= 1 ){  
         $('.qty0').trigger('focus');

      }
     }
   }

  delRow(item: any) {
    var index = this.tableDataList.findIndex((e:any)=> e.productID == item.productID);
    this.tableDataList.splice(index, 1);
    this.getTotal();
    
  }

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

   
  SaveBill(type:any){
    var isValidFlag = true;
       
    if(this.tableDataList == ''){
      this.msg.WarnNotify('Atleast One Product Must Be Selected')
    }else if( this.locationID == undefined || this.locationID == 0){
      this.msg.WarnNotify('Select Warehouse Location')
    }else if(this.locationTwoID == 0 || this.locationTwoID == undefined){
      this.msg.WarnNotify('Select Department')
    }else if(this.IssueType == '' || this.IssueType == undefined){
      this.msg.WarnNotify('Select Issuance Type')
    }
    else {

    
    
      if(this.invRemarks == '' || this.invRemarks == undefined){
        this.invRemarks = '-';
      }

      if(isValidFlag == true){
        if(type == 'hold'){
          if(this.holdBtnType == 'Hold'){
           this.app.startLoaderDark();
           this.http.post(environment.mainApi+'inv/InsertIssueStock',{
           InvType: "HIR",
           InvDate: this.global.dateFormater(this.invoiceDate,'-'),
           LocationID: this.locationID,
           LocationTitle:this.locationTitle,
           ProjectID: 1,
           IssueType:this.IssueType,
           IssueStatus:'A',
           BillTotal: this.subTotal,
           NetTotal: this.subTotal ,
           Remarks: this.invRemarks,
           InvoiceDocument: "-",
           LocationTwoID:this.locationTwoID,
           LocationTwoTitle:this.locationTwoTitle,
       
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
             }
           )
          }else if(this.holdBtnType == 'ReHold'){
           this.dialog.open(PincodeComponent,{
             width:"30%"
           }).afterClosed().subscribe(pin=>{
             if(pin != ''){
               this.app.startLoaderDark();
          
           this.http.post(environment.mainApi+'inv/UpdateHoldedIssueInvoice',{
           InvBillNo: this.holdInvNo,
           InvDate: this.global.dateFormater(this.invoiceDate,'-'),
           LocationID: this.locationID,
           LocationTitle:this.locationTitle,
           ProjectID: 1,
           IssueType:this.IssueType,
           IssueStatus:'A',
           BillTotal: this.subTotal,
           NetTotal: this.subTotal ,
           Remarks: this.invRemarks,
           InvoiceDocument: "-",
           LocationTwoID:this.locationTwoID,
           LocationTwoTitle:this.locationTwoTitle,
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
             }
           )
             }
           })
          }
     
         }else if(type == 'issue'){
           this.app.startLoaderDark();
           this.http.post(environment.mainApi+'inv/InsertIssueStock',{
            InvType: "IR",
            InvDate: this.global.dateFormater(this.invoiceDate,'-'),
            LocationID: this.locationID,
            LocationTitle:this.locationTitle,
            ProjectID: 1,
            IssueType:this.IssueType,
            IssueStatus:'A',
            BillTotal: this.subTotal,
            NetTotal: this.subTotal ,
            Remarks: this.invRemarks,
            InvoiceDocument: "-",
            LocationTwoID:this.locationTwoID,
            LocationTwoTitle:this.locationTwoTitle,
        
            InvDetail: JSON.stringify(this.tableDataList),
        
            UserID: this.global.getUserID(),
            HoldInvNo:this.holdInvNo,
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
             }
           )
         }
     
      }
    
     

    }
   
  
   
  }


  reset(){
    this.invoiceDate = new Date();
    this.locationID = 0;
    this.locationTitle = '';
    this.locationTwoID = 0;
    this.locationTwoTitle = '';
    this.invRemarks = '';
    this.tableDataList = [];
    this.totalQty = 0;
    this.subTotal = 0;
    this.holdBtnType = 'Hold';
    this.productImage = '';
    this.holdInvNo = '-';
    this.IssueBillList = [];
    this.IssueType = '';

  }


  
  findHoldBills(type:any){
    if(type == 'HIR'){
      $('#edit').show();
    }

    if(type == 'IR'){
      $('#edit').hide()
    }

    this.http.get(environment.mainApi+'inv/GetIssueInventoryBillSingleDate?Type='+type+'&creationdate='+this.global.dateFormater(this.Date,'-')).subscribe(
      (Response:any)=>{
        this.IssueBillList = Response;
         console.log(this.IssueBillList);
      }
    )
  }



  
  myInvoiceNo:any;
  myInvoiceDate:any;
  myLocation:any;
  myLocationTitle:any;
  myLocationTwoTitle:any;
  myInvRemarks:any;
  myIssueType:any;
  mySubTotal:any;
  myTableDataList:any = [];
  myBillTotalQty = 0;
  myCPTotal = 0;
  mySPTotal = 0;
  myBillStatus = false;


  printBill(item:any){
    this.myTableDataList = [];
    this.myInvoiceNo = item.invBillNo;
    this.myInvoiceDate = new Date(item.invDate);
    this.myLocation = item.locationID;
    this.myLocationTitle = item.locationTitle;
    this.myLocationTwoTitle = item.locationTwoTitle;
    this.myIssueType = item.issueType;
    this.myInvRemarks = item.remarks;
    this.mySubTotal = item.billTotal;
    this.myBillStatus = item.approvedStatus;


    this.getBillDetail(item.invBillNo).subscribe(
      (Response:any)=>{

        this.myBillTotalQty = 0;
        this.myCPTotal = 0;
        this.mySPTotal = 0;
       
        this.productImage = Response[Response.length - 1].productImage;


          Response.forEach((e:any) => {
            this.myBillTotalQty += e.quantity;
            this.myCPTotal += e.costPrice * e.quantity;
            this.mySPTotal += e.salePrice * e.quantity;

            this.myTableDataList.push({
              ProductID:e.productID,
              ProductTitle:e.productTitle,
              barcode:e.barcode,
              productImage:e.productImage,
              Quantity:e.quantity,
              avgCostPrice:e.avgCostPrice,
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

  retriveBill(item:any){
    
    //console.log(item);
    this.tableDataList = [];
    this.holdBtnType = 'ReHold'
    this.invoiceDate = new Date(item.invDate);
    this.locationID = item.locationID;
    this.locationTitle = item.locationTitle;
    this.locationTwoTitle = item.locationTwoTitle;
    this.locationTwoID = item.locationTwoID;
    this.IssueType = item.issueType;
    this.invRemarks = item.remarks;
    this.holdInvNo = item.invBillNo;
    this.subTotal = item.billTotal;

    this.getBillDetail(item.invBillNo).subscribe(
      (Response:any)=>{
        console.log(Response);
        this.totalQty = 0;
        this.productImage = Response[Response.length - 1].productImage;


          Response.forEach((e:any) => {
            this.totalQty += e.quantity;
            this.tableDataList.push({
              productID:e.productID,
              productTitle:e.productTitle,
              barcode:e.barcode,
              productImage:e.productImage,
              quantity:e.quantity,
              avgCostPrice:e.avgCostPrice,
              costPrice:e.costPrice,
              salePrice:e.salePrice,
              expiryDate:this.global.dateFormater(new Date(e.expiryDate),'-'),
              batchNo:e.batchNo,
              batchStatus:e.batchStatus,
              uomID:e.uomID,
              packing:e.packing,
              discInP:e.discInP,
              discInR:e.discInR,
            })
          });
          // this.getTotal();
        
      }
    )

    // console.log(this.locationTitle,this.locationTwoTitle)

  }


  public getBillDetail(billNo:any):Observable<any>{
    return this.http.get(environment.mainApi+'inv/GetIssueSingleBillDetail?reqInvBillNo='+billNo).pipe(retry(3));
   }
 




}
