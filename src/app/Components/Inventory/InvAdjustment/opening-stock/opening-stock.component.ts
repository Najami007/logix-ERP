import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';
import { AdjBillPrintComponent } from '../adj-bill-print/adj-bill-print.component';

@Component({
  selector: 'app-opening-stock',
  templateUrl: './opening-stock.component.html',
  styleUrls: ['./opening-stock.component.scss']
})
export class OpeningStockComponent implements OnInit {
  
  @ViewChild(AdjBillPrintComponent) billPrint:any;

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

    })

    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });

  }



  ngOnInit(): void {
   this.global.setHeaderTitle('Opening Stock');
   this.getLocation();
   $('.searchProduct').trigger('focus');
   
   this.global.getProducts().subscribe(
    (data:any)=>{this.productList = data;})
  }


  sortType = 'desc';

  btnType = 'Save';
  Date:Date = new Date();
  invBillNo = '-';
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
  adjustmentType = 'OS';
  IssueBillList:any = [];
  
  salePriceTotal = 0;
  CostTotal = 0;

  projectID = this.global.InvProjectID;
  bookerID = 1;


  changeOrder(){
    this.sortType = this.sortType == 'desc' ? 'asc' :'desc';
    this.sortType == 'desc' ? this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex) : this.tableDataList.sort((a:any,b:any)=> a.rowIndex - b.rowIndex);

  }


  getLocation(){
    this.global.getWarehouseLocationList().subscribe((data: any) => { this.locationList = data; });
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
                    rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1 
                    : this.sortType == 'desc' ?  this.tableDataList[0].rowIndex + 1 
                    : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
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
              
                  });
                  this.sortType == 'desc' ? this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex) : this.tableDataList.sort((a:any,b:any)=> a.rowIndex - b.rowIndex);

                  this.getTotal();
                 
                
               this.productImage = Response[0].productImage;
              }
            )

          
          this.PBarcode = '';
          $('#searchProduct').trigger('focus');
        }else {
          this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + 1;
          this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length -1].rowIndex + 1 ;
          this.sortType == 'desc' ? this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex) : this.tableDataList.sort((a:any,b:any)=> a.rowIndex - b.rowIndex);
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
         

          
            this.tableDataList.push({
              rowIndex:this.tableDataList.length == 0 ? this.tableDataList.length + 1 
              : this.sortType == 'desc' ?  this.tableDataList[0].rowIndex + 1 
              : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
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
        
            });
             //////////sorting data table base on sort type
             this.sortType == 'desc' ? this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex) : this.tableDataList.sort((a:any,b:any)=> a.rowIndex - b.rowIndex);
           
            this.getTotal();
           
          
         this.productImage = Response[0].productImage;
        }
      )

    this.PBarcode = '';
    $('#searchProduct').trigger('focus');
  }else {
    this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + 1;
    this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length -1].rowIndex + 1 ;
    this.sortType == 'desc' ? this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex) : this.tableDataList.sort((a:any,b:any)=> a.rowIndex - b.rowIndex);
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
    this.salePriceTotal = 0;
    for (var i = 0; i < this.tableDataList.length; i++) {
   
      this.subTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].costPrice));
      this.totalQty += parseFloat(this.tableDataList[i].quantity);
      this.CostTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].costPrice));
      this.salePriceTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].salePrice))
      // this.myTotal = this.mySubtoatal - this.myDiscount;
      // this.myDue = this.myPaid - this.myTotal;\
    


    }
  }
  rowFocused =-1;
  prodFocusedRow= 0;
   changeFocus(e:any, cls:any){

  if(e.target.value == ''){
    if(e.keyCode == 40){
      
      if(this.tableDataList.length >= 1 ){ 
        this.rowFocused = 0; 
        e.preventDefault();
        $('.qty0').trigger('select');
        $('.qty0').trigger('focus');

      }
     }
  }else{
    this.prodFocusedRow = 0;
      /////move down
      if(e.keyCode == 40){
        if(this.productList.length >= 1 ){  
          e.preventDefault();
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
        e.preventDefault();
        $(clsName).trigger('focus');
            
     }}
   }
 
 
      //Move up
      if (e.keyCode == 38) {
 
       if (this.prodFocusedRow == 0) {
        e.preventDefault();
        $(endFocus).trigger('focus');
           this.prodFocusedRow = 0;
  
       }
 
       if (prodList.length > 1) {
 
           this.prodFocusedRow -= 1;
 
           var clsName = cls + this.prodFocusedRow;
          //  alert(clsName);
          e.preventDefault();
          $(clsName).trigger('focus');
           
 
       }
 
   }

  }

  handleUpdown(item:any ,e:any,cls:string,index:any){
    const container = $(".table-logix");
      if(e.keyCode == 9){
        if(cls == '.sp'){
          this.rowFocused = index + 1;
        }else{
          this.rowFocused = index ;
        }
        
      }
  
      
     if(e.shiftKey && e.keyCode == 9 ){
    
      if(cls == '.qty'){
        this.rowFocused = index - 1;
      }else{
        this.rowFocused = index ;
      }
     }

      /////////// focusing product serach
     if(e.keyCode == 13){
      $('#searchProduct').trigger('focus');
     }
  
      if ((e.keyCode == 13 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 16 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 110 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 48 || e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51 || e.keyCode == 52 || e.keyCode == 53 || e.keyCode == 54 || e.keyCode == 55 || e.keyCode == 56 || e.keyCode == 57 || e.keyCode == 96 || e.keyCode == 97 || e.keyCode == 98 || e.keyCode == 99 || e.keyCode == 100 || e.keyCode == 101 || e.keyCode == 102 || e.keyCode == 103 || e.keyCode == 104 || e.keyCode == 105)) {
        // 13 Enter ///////// 8 Back/remve ////////9 tab ////////////16 shift ///////////46 del  /////////37 left //////////////110 dot
    }
    else {
        e.preventDefault();
    }

     /////move down
     if (e.keyCode === 40) {
      if (this.tableDataList.length > 1) {
          this.rowFocused = Math.min(this.rowFocused + 1, this.tableDataList.length - 1);
          const clsName = cls + this.rowFocused;
          this.global.scrollToRow(clsName, container);
          e.preventDefault();
            $(clsName).trigger('select');
            $(clsName).trigger('focus');
         
      }
  }
  
  
       //Move up
    if (e.keyCode === 38) {
      if (this.rowFocused > 0) {
        
          this.rowFocused -= 1;
          const clsName = cls + this.rowFocused;
          this.global.scrollToRow(clsName, container);
          e.preventDefault();
          $(clsName).trigger('select');
          $(clsName).trigger('focus');
  
      } else {
          e.preventDefault();
          $(".searchProduct").trigger('select');
          $(".searchProduct").trigger('focus');
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
          if (index == 0) {
            $('#searchProduct').trigger('select'); 
            $('#searchProduct').trigger('focus');
          } else {
            this.rowFocused = index - 1;
            $('.qty'+this.rowFocused).trigger('select');
            $('.qty'+this.rowFocused).trigger('focus');
          }
        }})
    
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
   }

   
  SaveBill(type:any){
    var isValidFlag = true;
    this.tableDataList.forEach((p:any) => {       

      p.quantity = parseFloat(p.quantity);
      p.salePrice = parseFloat(p.salePrice);
      p.costPrice = parseFloat(p.costPrice);

      
        if(p.quantity == 0 || p.quantity == '0' || p.quantity == '' || p.quantity == undefined || p.quantity == null){
          this.msg.WarnNotify('('+p.productTitle+') Quantity is not Valid');
           isValidFlag = false;
           return;
        }
        if(p.salePrice < p.costPrice || p.salePrice == 0 || p.salePrice == '0' || p.salePrice == '' || p.salePrice == undefined || p.salePrice == null){
          this.msg.WarnNotify('('+p.productTitle+') Sale Price is not Valid');
           isValidFlag = false;
           return;
        }
        if(  p.costPrice > p.salePrice  || p.costPrice == 0 || p.costPrice == '0' || p.costPrice == '' || p.costPrice == undefined || p.costPrice == null){
          this.msg.WarnNotify('('+p.productTitle+') Cost Price is not Valid');
           isValidFlag = false;
           return;
        }
      });
       
       
    if(this.tableDataList == ''){
      this.msg.WarnNotify('Atleast One Product Must Be Selected')
    }else if( this.locationID == undefined || this.locationID == 0){
      this.msg.WarnNotify('Select Warehouse Location')
    }else {

    
    
      if(this.invRemarks == '' || this.invRemarks == undefined){
        this.invRemarks = '-';
      }

      if(isValidFlag == true){
        
          
          if(this.btnType == 'Save'){
            this.app.startLoaderDark();
            this.http.post(environment.mainApi+this.global.inventoryLink+'InsertOpeningStock',{
              InvType: 'OS',
              InvDate: this.global.dateFormater(this.invoiceDate,'-'),
              LocationID: this.locationID,
              ProjectID: this.projectID,
              BookerID:this.bookerID,
              BillTotal: this.subTotal,
              NetTotal: this.subTotal ,
              Remarks: this.invRemarks,
              InvoiceDocument: "-",
              InvDetail: JSON.stringify(this.tableDataList),    
              UserID: this.global.getUserID(),
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
                 this.msg.WarnNotify(Error);
                 this.app.stopLoaderDark();
                }
             )
          }

          if(this.btnType == 'Update'){
          this.global.openPinCode().subscribe(pin=>{
            if(pin != ''){
              this.app.startLoaderDark();
              this.http.post(environment.mainApi+this.global.inventoryLink+'UpdateOpeningStock',{
                InvBillNo: this.invBillNo,
                InvDate: this.global.dateFormater(this.invoiceDate,'-'),
                LocationID: this.locationID,
                ProjectID: this.projectID,
                BookerID:this.bookerID,
                BillTotal: this.subTotal,
                NetTotal: this.subTotal ,
                Remarks: this.invRemarks,
                InvoiceDocument: "-",
                InvDetail: JSON.stringify(this.tableDataList), 
                PinCode:pin,   
                UserID: this.global.getUserID(),
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
                   this.msg.WarnNotify(Error);
                   this.app.stopLoaderDark();
                  }
               )
            }
          })
          }
         
     
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
    this.btnType = 'Save';
    this.productImage = '';
    this.invBillNo = '-';
    this.IssueBillList = [];
    this.adjustmentType = '';
    this.CostTotal = 0;
    this.salePriceTotal = 0;

  }


  
  FindSavedBills(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetOpeningStock?creationdate='+this.global.dateFormater(this.Date,'-')).subscribe(
      (Response:any)=>{
        this.IssueBillList = Response;
   
      },
      (Error:any)=>{
        this.msg.WarnNotify(Error);
        this.app.stopLoaderDark();
       }
    )
  }



  printBill(item:any){
    this.billPrint.printBill(item);

  }

  retriveBill(item:any){
    
    this.tableDataList = [];
    this.btnType = 'Update';
    this.invoiceDate = new Date(item.invDate);
    this.locationID = item.locationID;
    this.invRemarks = item.remarks;
    this.invBillNo = item.invBillNo;
    this.subTotal = item.billTotal;

    this.getBillDetail(item.invBillNo).subscribe(
      (Response:any)=>{
        this.totalQty = 0;
        this.productImage = Response[Response.length - 1].productImage;


          Response.forEach((e:any) => {
            this.totalQty += e.quantity;
            this.tableDataList.push({
              rowIndex:this.tableDataList.length + 1,
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

               //////////sorting data table base on sort type
               this.sortType == 'desc' ? this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex) 
               : this.tableDataList.sort((a:any,b:any)=> a.rowIndex - b.rowIndex);
     
          this.getTotal();
        
      }
    )


  }


  public getBillDetail(billNo:any):Observable<any>{
    return this.http.get(environment.mainApi+this.global.inventoryLink+'GetIssueSingleBillDetail?reqInvBillNo='+billNo).pipe(retry(3));
   }
 

   DeleteInv(row:any){
    $('#holdModal').hide();
    this.global.openPinCode().subscribe(pin=>{
      $('#holdModal').show();
      if(pin != ''){
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+this.global.inventoryLink+'DeleteBill',{
          InvBillNo: row.invBillNo,
          PinCode: pin,
          UserID: this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){

              this.msg.SuccessNotify(Response.msg);
              this.FindSavedBills();
              this.app.stopLoaderDark();

            }else{
              this.msg.WarnNotify(Response.msg)
            }
           

          }
        )
      }
    })
   }


   approveBill(row:any){
    // alert(row.invBillNo);
    $('#holdModal').hide();
    this.global.openPinCode().subscribe(pin=>{
      $('#holdModal').show();
      if(pin != ''){
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+this.global.inventoryLink+'PostOpeningStockBill',{
          InvBillNo: row.invBillNo,
          Remarks:'-',
          PinCode: pin,
          UserID: this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Posted Successfully'){

              this.msg.SuccessNotify(Response.msg);
              this.FindSavedBills();
         

            }else{
              this.msg.WarnNotify(Response.msg)
            }


            this.app.stopLoaderDark();
           

          },
          (Error:any)=>{
            this.msg.WarnNotify(Error);
            this.app.stopLoaderDark();
           }
        )
      }
    })
   }

   EmptyData(){
    this.global.confirmAlert().subscribe(
      (Response:any)=>{
        if(Response == true){
          this.reset();
        }})
   }


 


}
