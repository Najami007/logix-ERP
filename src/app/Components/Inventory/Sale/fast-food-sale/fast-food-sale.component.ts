import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { KOTPrintComponent } from '../SaleComFiles/kotprint/kotprint.component';
import { SaleBillDetailComponent } from 'src/app/Components/Restaurant-Core/Sales/sale1/sale-bill-detail/sale-bill-detail.component';

@Component({
  selector: 'app-fast-food-sale',
  templateUrl: './fast-food-sale.component.html',
  styleUrls: ['./fast-food-sale.component.scss']
})
export class FastFoodSaleComponent {
  

  
  discFeature = this.global.getFeature('Discount');
  BookerFeature = this.global.getFeature('Booker');
  gstFeature = this.global.getFeature('GST');
  customerFeature = this.global.getFeature('Customer');
  tillOpenFeature = this.global.getFeature('TillOpen');
  editSpFeature = this.global.getFeature('EditSp');
  editDiscFeature = this.global.getFeature('EditDisc');
  prodDetailFeature = this.global.getFeature('ProdDetail');

 @ViewChild(KOTPrintComponent) kotPrint:any;

  crudList:any = [];
  companyProfile:any = [];
  companyLogo: any = '';
  logoHeight: any = 0;
  logoWidth: any = 0;
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    public global:GlobalDataModule,
    private dialogue:MatDialog,
    private route:Router,
   
  ){
    // this.global.getCompany().subscribe((data)=>{
    //   this.companyProfile = data;
    // });

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    });

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
      this.companyLogo = data[0].companyLogo1;
      this.CompanyMobile = data[0].companyMobile;
      this.companyAddress = data[0].companyAddress;
      this.companyName = data[0].companyName;
      this.logoHeight = data[0].logo1Height;
      this.logoWidth = data[0].logo1Width;
    });
  }

  
  ngOnInit(): void {
    this.global.setHeaderTitle('Fast Food Sale'); 
    this.getProducts();
    this.getSavedBill();

    
  }


  //////////////////////////////////////

  tempProdData: any = [];


  sortType = 'desc';
  invoiceDate = new Date();
  partyID = 0;
  productList: any = [];
  projectID = this.global.InvProjectID;

  tableDataList: any = [];
  tempTableDataList: any = [];
  InvDate = new Date();
  PBarcode: any = '';
  productImage = '';
  productName: any = '';
  discount: any = 0;
  offerDiscount: any = 0;
  cash: any = 0;
  change = 0;
  paymentType = 'Cash';
  bankCash: any = 0;
  bankCoaID = 0;
  billRemarks = '';
  otherCharges = 0;
  customerName = '';
  customerMobileno = '';
  bookerID = 0;
  AdvTaxValue = 0;
  AdvTaxAmount = 0;

  qtyTotal = 0;
  subTotal: any = 0;
  netTotal = 0;

  bankCoaList: any = [];
  partyList: any = [];
  bookerList:any = [];


  ////////////////////////////////////




  ///////////////////////////////////////////////////////////////
  getProducts(){
    
    this.global.getFastFoodProducts().subscribe(
      (data: any) => { this.productList = data; 
      });
  }



  changeValue(item:any){
    var myIndex = this.tableDataList.indexOf(item);
   // console.log(this.tableDataList[myIndex]);
    var myQty = this.tableDataList[myIndex].TicketQuantity;
     if(myQty == null || myQty == '' || myQty == undefined){
      this.tableDataList[myIndex].TicketQuantity = 0;
    }
   }




  ///////////////////////////////////////////////////////////////


  
  holdDataFunction(data: any) {


    var condition = this.tableDataList.find(
      (x: any) => x.productID == data.productID
    );

    var index = this.tableDataList.indexOf(condition);

    if (condition == undefined) {

      this.app.startLoaderDark();

      this.global.getProdDetail(data.productID, '').subscribe(
        (Response: any) => {
           
          this.tableDataList.push({
            
            rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
              : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
                : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
            productID: Response[0].productID,
            productTitle: Response[0].productTitle,
            barcode: Response[0].barcode,
            productImage: Response[0].productImage,
            quantity: 1,
            wohCP: Response[0].costPrice,
            costPrice: Response[0].costPrice,
            avgCostPrice: Response[0].avgCostPrice,
            salePrice: Response[0].salePrice,
            ovhPercent: 0,
            ovhAmount: 0,
            expiryDate: this.global.dateFormater(new Date(), '-'),
            batchNo: '-',
            batchStatus: '-',
            uomID: Response[0].uomID,
            gst: this.gstFeature ? Response[0].gst : 0,
            et:Response[0].et,
            packing: 1,
            discInP: this.discFeature ?  Response[0].discPercentage : 0,
            discInR: this.discFeature ?  Response[0].discRupees  : 0,
            aq: Response[0].aq,
            total:(Response[0].salePrice * 1) - (Response[0].discRupees),

          });
          // this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex);
          this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
          this.getTotal();


          this.productImage = Response[0].productImage;
        }
      )
    } else {
      this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + 1;
      this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
      this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
      this.productImage = this.tableDataList[index].productImage;

    }

    this.app.stopLoaderDark();
    this.productName = '';
    this.getTotal();
    setTimeout(() => {
      $('#psearchProduct').trigger('focus');
    }, 500);

  }

  rowFocused = -1;
  prodFocusedRow = 0;

  handleUpdown(item: any, e: any, cls: string, index: any) {

    if (e.keyCode == 9) {
      this.rowFocused = index + 1;
    }

    if (e.shiftKey && e.keyCode == 9) {

      this.rowFocused = index - 1;
    }
    if (e.keyCode == 13) {
      e.preventDefault();
      $('#psearchProduct').trigger('select');
      $('#psearchProduct').trigger('focus');
    }

    if ((e.keyCode == 13 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 16 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 110 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 48 || e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51 || e.keyCode == 52 || e.keyCode == 53 || e.keyCode == 54 || e.keyCode == 55 || e.keyCode == 56 || e.keyCode == 57 || e.keyCode == 96 || e.keyCode == 97 || e.keyCode == 98 || e.keyCode == 99 || e.keyCode == 100 || e.keyCode == 101 || e.keyCode == 102 || e.keyCode == 103 || e.keyCode == 104 || e.keyCode == 105)) {
      // 13 Enter ///////// 8 Back/remve ////////9 tab ////////////16 shift ///////////46 del  /////////37 left //////////////110 dot
    }
    else {
      e.preventDefault();
    }

    /////move down
    if (e.keyCode == 40) {
      if (this.tableDataList.length > 1) {
        this.rowFocused += 1;
        if (this.rowFocused >= this.tableDataList.length) {
          this.rowFocused -= 1
        } else {
          var clsName = cls + this.rowFocused;
          e.preventDefault();
            $(clsName).trigger('select');   
            $(clsName).trigger('focus');    
        }
      }
    }
    //Move up
    if (e.keyCode == 38) {
      if (this.rowFocused == 0) {
        e.preventDefault();
        $(".searchProduct").trigger('select');  
          $(".searchProduct").trigger('focus');
        this.rowFocused = 0;
      }

      if (this.tableDataList.length > 1) {
        this.rowFocused -= 1;
        var clsName = cls + this.rowFocused;
        e.preventDefault();
        $(clsName).trigger('select'); 
        $(clsName).trigger('focus');
      }
    }
    ////removeing row
    if (e.keyCode == 46) {

      this.delRow(item);
      this.rowFocused = 0;
    }
  }

  ///////////////////////////////////////////////////////////////

  changeQty(type:any,index:any,list:any){
  
    if(type == 'add'){

      list[index].quantity += 1;

    }
    if(type == 'minus'){
      if( list[index].quantity > 1){
        list[index].quantity -= 1;
      }
    }
  
    this.getTotal();
  }

focusto(cls: any, e: any) {

  // setTimeout(() => {
  //  $(cls).trigger('focus');
  // }, 500);

  if (cls == '#prodName') {
    setTimeout(() => {
      $(cls).trigger('focus');
    }, 500);
  }

  if (cls == '#disc' && e.keyCode == 13 && e.target.value == '') {
    e.preventDefault();
    $(cls).trigger('select');
    $(cls).trigger('focus');
  }
  if (cls == '#charges' && e.keyCode == 13) {
    e.preventDefault();
      $(cls).trigger('select');
      $(cls).trigger('focus');
  }
  if (cls == '#cash' && e.keyCode == 13 && e.target.value == '') {
    e.preventDefault();
      $(cls).trigger('select');
      $(cls).trigger('focus');

  }

  if (cls == '#save' && e.keyCode == 13) {
    e.preventDefault();
      // $(cls).trigger('select');
      $(cls).trigger('focus');

  }

  if (cls == '#vsrtnsearchProduct' && e.keyCode == 13) {
    e.preventDefault();
    $(cls).trigger('select');
    $(cls).trigger('focus');
  }



}

getTotal() {
  this.qtyTotal = 0;
  this.subTotal = 0;
  this.netTotal = 0;
  this.offerDiscount = 0;

  this.tableDataList.forEach((e: any) => {
 
    e.total = ((parseFloat(e.salePrice) - parseFloat(e.discInR)) * parseFloat(e.quantity));
    this.qtyTotal += parseFloat(e.quantity);
    this.subTotal += parseFloat(e.quantity) * parseFloat(e.salePrice);
    this.offerDiscount += parseFloat(e.discInR) * parseFloat(e.quantity);

  });

  if (this.discount == '') {
    this.discount = 0;
  }

  if (this.cash == '') {
    this.cash = 0;
  }



  this.netTotal = this.subTotal - parseFloat(this.discount) - parseFloat(this.offerDiscount);
  this.change = parseFloat(this.cash) - this.netTotal;

  if (this.paymentType == 'Split') {

    this.bankCash = this.netTotal - parseFloat(this.cash);
  }
  if (this.paymentType == 'Bank') {
    this.bankCash = this.netTotal;
  }

  if(this.paymentType == 'Credit'){
    this.cash = 0;
    this.bankCoaID = 0;
    this.bankCash = 0;
  }

  if(this.paymentType !== 'Credit'){
    this.partyID = 0;
  }

}


delRow(index:any){
this.tableDataList.splice(index,1);
this.getTotal();
}



ticketArray:any = [];


  save(){
    var isValidFlag = true;
    this.tableDataList.forEach((p: any) => {

      p.quantity = parseFloat(p.quantity);
      p.salePrice = parseFloat(p.salePrice);
      p.costPrice = parseFloat(p.costPrice);

      if (p.costPrice > p.salePrice || p.costPrice == 0 || p.costPrice == '0' || p.costPrice == '' || p.costPrice == undefined || p.costPrice == null) {
        this.msg.WarnNotify('(' + p.productTitle + ') Cost Price is not Valid');
        isValidFlag = false;

        return;
      }

      if (p.salePrice == 0 || p.salePrice == '0' || p.salePrice == '' || p.salePrice == undefined || p.salePrice == null) {
        this.msg.WarnNotify('(' + p.productTitle + ') Sale Price is not Valid');
        isValidFlag = false;

        return;
      }

      if (p.quantity == 0 || p.quantity == '0' || p.quantity == null || p.quantity == undefined || p.quantity == '') {
        this.msg.WarnNotify('(' + p.productTitle + ') Quantity is not Valid');
        isValidFlag = false;
        return;
      }

      if (p.costPrice > (p.salePrice - p.discInR)) {
        this.msg.WarnNotify('(' + p.productTitle + ') Discount not valid');
        isValidFlag = false;

        return;
      }
    });

  
    if(isValidFlag == true){

      this.getTotal();
      this.app.startLoaderDark();
      this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertCashAndCarrySale', {
        InvDate: this.global.dateFormater(this.InvDate, '-'),
        PartyID: this.partyID,
        InvType: "S",
        ProjectID: this.projectID,
        BookerID: this.bookerID,
        PaymentType: this.paymentType,
        Remarks: this.billRemarks || '-',
        OrderType: "Take Away",
        BillTotal: this.subTotal,
        BillDiscount: parseFloat(this.discount) + parseFloat(this.offerDiscount),
        OtherCharges: this.otherCharges ,
        NetTotal: this.netTotal,
        CashRec: this.netTotal,
        Change: this.change,
        AdvTaxAmount : this.AdvTaxAmount,
        AdvTaxValue : this.AdvTaxValue,
        BankCoaID: this.bankCoaID,
        BankCash: this.bankCash,
        CusContactNo: this.customerMobileno || '-',
        CusName: this.customerName || '-',   
        SaleDetail: JSON.stringify(this.tableDataList),
        UserID: this.global.getUserID()
      }).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Saved Successfully') {
            this.kotPrint.printBill(Response.invNo);
            this.msg.SuccessNotify(Response.msg);
            this.reset();
           

            if (this.paymentType != 'Cash') {
              $('#searchProduct').trigger('focus');
              this.global.closeBootstrapModal('#paymentMehtod',true);

            }

          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
        },
        (Error: any) => {
          this.msg.WarnNotify(Error);
          
          this.app.stopLoaderDark();
        }
      )
    }
    
  
  }


  savedbillList: any = []

  
  printDuplicateBill(item:any){
    
    this.kotPrint.printBill(item.invBillNo);
  
  
  }

  billDetails(item:any){


    $('#SavedBillModal').hide();
    // $('#paymentMehtod').hide();
    // $('.modal-backdrop').remove();
    
    this.dialogue.open(SaleBillDetailComponent,{
      width:'50%',
      data:item,
      disableClose:true,
    }).afterClosed().subscribe(value=>{
      
    })

   
  }
  

  getSavedBill(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetOpenDaySale').subscribe(
      (Response:any)=>{
       
        this.savedbillList = [];
        Response.forEach((e:any) => {
          if(e.invType == 'S'){
            this.savedbillList.push(e);
          }  
        });   
      }
    )

  }

  reset() {
    this.partyID = 0;
    this.invoiceDate = new Date();
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
    this.offerDiscount = 0;
    this.bookerID = 0;
    this.customerMobileno = '';
    this.customerName = '';


  }

  increment(type: any, value: any) {
    if (type == 'add') {
      value.quantity += 1;
    
    }

    if (type == 'minus') {
      value.quantity -= 1;
    }
    value.total = (value.salePrice - value.discInR ) * value.quantity;
  }


  insertPorduct(data: any) {

    this.tableDataList = [];
      this.global.getProdDetail(data.productID, '').subscribe(
        (Response: any) => {
           
          this.tableDataList.push({
            
            rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
              : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
                : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
            productID: Response[0].productID,
            productTitle: Response[0].productTitle,
            barcode: Response[0].barcode,
            productImage: Response[0].productImage,
            quantity: 1,
            wohCP: Response[0].costPrice,
            costPrice: Response[0].costPrice,
            avgCostPrice: Response[0].avgCostPrice,
            salePrice: Response[0].salePrice,
            ovhPercent: 0,
            ovhAmount: 0,
            expiryDate: this.global.dateFormater(new Date(), '-'),
            batchNo: '-',
            batchStatus: '-',
            uomID: Response[0].uomID,
            gst: this.gstFeature ? Response[0].gst : 0,
            et:Response[0].et,
            packing: 1,
            discInP: this.discFeature ?  Response[0].discPercentage : 0,
            discInR: this.discFeature ?  Response[0].discRupees  : 0,
            aq: Response[0].aq,
            total:(Response[0].salePrice * 1) - (Response[0].discRupees),

          });

        this.getTotal();

        }
      )
    

    this.getTotal();

  }

  OnSpChange(item:any){
    
    item.quantity = item.total / item.salePrice;

  }
  OnQtyChange(item:any){
    
    item.total = (item.salePrice - item.discInR ) * item.quantity;

  }


 
}