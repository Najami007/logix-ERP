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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-adjustment',
  templateUrl: './stock-adjustment.component.html',
  styleUrls: ['./stock-adjustment.component.scss']
})
export class StockAdjustmentComponent implements OnInit {

  crudList:any = {c:true,r:true,u:true,d:true};
  companyProfile:any = [];

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    public global:GlobalDataModule,
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
   this.global.setHeaderTitle('Stock Adjustment');
   this.getLocation();
   $('.searchProduct').trigger('focus');
   this.global.getProducts().subscribe(
    (data:any)=>{this.productList = data;})
  }

  projectID = this.global.InvProjectID;
  Date:Date = new Date();
  holdInvNo = '-';
  holdBtnType = 'Hold';
  invoiceDate:Date = new Date();
  locationID  = 0;
  locationList:any = [];
  invRemarks:any;
  PBarcode:any;
  productList:any = [];
  tableDataList:any = [];

  productImage:any;
  subTotal:number = 0;
  totalQty:number = 0;
  adjustmentType:any;
  IssueBillList:any = [];
  avgCostTotal = 0;
  CostTotal = 0;


  getLocation(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'getlocation').subscribe(
      (Response:any)=>{
        this.locationList = Response;
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

            this.global.getProdDetail(0,this.PBarcode).subscribe(
              (Response:any)=>{
  
                  this.tableDataList.push({
                    productID:Response[0].productID,
                    productTitle:Response[0].productTitle,
                    barcode:Response[0].barcode,
                    productImage:Response[0].productImage,
                    quantity:1,
                    costPrice:Response[0].costPrice,
                    avgCostPrice:Response[0].avgCostPrice,
                    salePrice:Response[0].salePrice,
                    expiryDate:this.global.dateFormater(new Date(),'-'),
                    batchNo:'-',
                    batchStatus:'-',
                    uomID:Response[0].uomID,
                    packing:1,
                    discInP:0,
                    discInR:0,
                    aq:Response[0].aq,
              
                  })
                  this.getTotal();
                 
                
               this.productImage = Response[0].productImage;
              }
            )

          
          this.PBarcode = '';
          $('#searchProduct').trigger('focus');
        }else {
          this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + 1;
          this.productImage = this.tableDataList[index].productImage;
    
          this.PBarcode = '';
          $('#searchProduct').trigger('focus');
        }
        }else{
          this.msg.WarnNotify('Product Not Found')
        }
     
       
       this.PBarcode = '';
       this.getTotal();
   
       }
    }

   
  }

  holdDataFunction(data:any){
  var condition = this.tableDataList.find(
      (x: any) => x.productID == data.productID
    );

    var index = this.tableDataList.indexOf(condition);

    if (condition == undefined) {

      this.global.getProdDetail(data.productID,'').subscribe(
        (Response:any)=>{
          //  console.log(Response);

          
            this.tableDataList.push({
              productID:Response[0].productID,
              productTitle:Response[0].productTitle,
              barcode:Response[0].barcode,
              productImage:Response[0].productImage,
              quantity:1,
              costPrice:Response[0].costPrice,
              avgCostPrice:Response[0].avgCostPrice,
              salePrice:Response[0].salePrice,
              expiryDate:this.global.dateFormater(new Date(),'-'),
              batchNo:'-',
              batchStatus:'-',
              uomID:Response[0].uomID,
              packing:1,
              discInP:0,
              discInR:0,
              aq:Response[0].aq,
        
            })
            this.getTotal();
           
          
         this.productImage = Response[0].productImage;
        }
      )

    this.PBarcode = '';
    $('#searchProduct').trigger('focus');
  }else {
    this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + 1;
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
    this.CostTotal = 0;
    this.avgCostTotal = 0;
    for (var i = 0; i < this.tableDataList.length; i++) {
   
      this.subTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].costPrice));
      this.totalQty += parseFloat(this.tableDataList[i].quantity);
      this.CostTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].costPrice));
      this.avgCostTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].avgCostPrice))
      // this.myTotal = this.mySubtoatal - this.myDiscount;
      // this.myDue = this.myPaid - this.myTotal;\
    

     // console.log(this.tableDataList)
    }
  }

  rowFocused = 0;
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
         e.which = 9;   
         $(clsName).trigger(e)       
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
  handleNumKeys(item:any ,e:any,cls:string,index:any){

   if(e.keyCode == 9){
    this.rowFocused = index + 1;
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

 
  delRow(item: any) {
    this.global.confirmAlert().subscribe(
      (Response:any)=>{
        if(Response == true){
   
        var index = this.tableDataList.indexOf(item);
        this.tableDataList.splice(index, 1);
        this.getTotal();
        this.rowFocused = index - 1;
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
    this.tableDataList.forEach((p:any) => { 

      p.quantity = parseFloat(p.quantity);
      p.salePrice = parseFloat(p.salePrice);
      p.costPrice = parseFloat(p.costPrice);
      // console.log(p)      
        if(p.quantity == 0 || p.quantity == '0' || p.quantity == '' || p.quantity == undefined || p.quantity == null){
          this.msg.WarnNotify('('+p.productTitle+') Quantity is not Valid');
           isValidFlag = false;
          //  console.log(p)
          //  console.log(this.tableDataList)
           return;
        }
      });
       
       
    if(this.tableDataList == ''){
      this.msg.WarnNotify('Atleast One Product Must Be Selected')
    }else if( this.locationID == undefined || this.locationID == 0){
      this.msg.WarnNotify('Select Warehouse Location')
    }else if(this.adjustmentType == '' || this.adjustmentType == undefined){
      this.msg.WarnNotify('Select Adjustment Type')
    }
    else {

    
    
      if(this.invRemarks == '' || this.invRemarks == undefined){
        this.invRemarks = '-';
      }

      if(isValidFlag == true){

        this.global.confirmAlert().subscribe(
          (Response:any)=>{
            if(Response == true){
            this.app.startLoaderDark();
            this.http.post(environment.mainApi+this.global.inventoryLink+'InsertStockAdjustment',{
             InvType: this.adjustmentType,
             InvDate: this.global.dateFormater(this.invoiceDate,'-'),
             LocationID: this.locationID,
             ProjectID: this.projectID,
             BillTotal: this.subTotal,
             NetTotal: this.subTotal ,
             Remarks: this.invRemarks,
             InvoiceDocument: "-",
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
       )
        
          
         
     
      }
    
     

    }
   
  
   
  }


  reset(){
    this.invoiceDate = new Date();
    this.locationID = 0;
    this.invRemarks = '';
    this.tableDataList = [];
    this.totalQty = 0;
    this.subTotal = 0;
    this.holdBtnType = 'Hold';
    this.productImage = '';
    this.holdInvNo = '-';
    this.IssueBillList = [];
    this.adjustmentType = '';
    this.CostTotal= 0;
    this.avgCostTotal = 0;

  }


  
  FindSavedBills(type:any){
    // if(type == 'HIR'){
    //   $('#edit').show();
    // }

    // if(type == 'IR'){
    //   $('#edit').hide()
    // }

    this.http.get(environment.mainApi+this.global.inventoryLink+'GetStockAdjustmentInvBillSingleDate?creationdate='+this.global.dateFormater(this.Date,'-')).subscribe(
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
  myAvgCPTotal = 0;
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
        this.myAvgCPTotal = 0;
        this.myBillTotalQty = 0;
        this.myCPTotal = 0;
        this.mySPTotal = 0;
       
        this.productImage = Response[Response.length - 1].productImage;


          Response.forEach((e:any) => {
            this.myBillTotalQty += e.quantity;
            this.myCPTotal += e.costPrice * e.quantity;
            this.myAvgCPTotal += e.avgCostPrice * e.quantity;
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
              aq:e.aq,
            })
          });
          // this.getTotal();
        
      }
    )

    // console.log(this.locationTitle,this.locationTwoTitle)

  }


  public getBillDetail(billNo:any):Observable<any>{
    return this.http.get(environment.mainApi+this.global.inventoryLink+'GetIssueSingleBillDetail?reqInvBillNo='+billNo).pipe(retry(3));
   }
 




}
