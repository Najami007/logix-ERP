import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-retail-sale',
  templateUrl: './retail-sale.component.html',
  styleUrls: ['./retail-sale.component.scss']
})
export class RetailSaleComponent implements OnInit {

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
   this.global.setHeaderTitle('Sale');
   this.getBankList();
  }



  productList:any = [];
  bankCoaList:any =[];


  PBarcode:any;
  tableDataList:any = [];
  productImage:any;
  discount = 0;
  change = 0;
  paymentType = '';
  cash = 0;
  bankCash = 0;
  bankCoaID = 0;

  subTotal = 0;
  netTotal = 0;
  totalQty = 0;
 





  
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



  holdDataFunction(data:any){
    var condition = this.tableDataList.find((x: any) => x.productID == data.productID);
  
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
          
              })
              
             
            
           this.productImage = Response[0].productImage;
          }
        )
  
      //console.log(data);
    
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
                //console.log(Response)
                  this.tableDataList.push({
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
                  this.getTotal();
            

                this.productImage = Response[0].productImage;
              }
            )
      

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
       this.getTotal();
   
       }
    }

   
  }


    getTotal() {
      this.subTotal = 0;
      this.totalQty = 0;
      for (var i = 0; i < this.tableDataList.length; i++) {
     
        this.subTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].salePrice));
        this.totalQty += parseFloat(this.tableDataList[i].quantity);

      }
      

      this.netTotal = this.subTotal - this.discount;
    }


  
    rowFocused = 0;
    prodFocusedRow = 0;

    handleProdFocus(item:any,e:any,cls:any,endFocus:any, prodList:[]){
    

      /////move down
      if(e.keyCode == 40|| e.keyCode == 9){
  
   
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
  
    delRow(item: any) {
      Swal.fire({
        title:'Alert!',
        text:'Confirm to Delete Product',
        position:'center',
        icon:'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
      }).then((result)=>{
  
        if(result.isConfirmed){
     
          var index = this.tableDataList.indexOf(item);
          this.tableDataList.splice(index, 1);
          this.getTotal();
  
      }
     }
     )
      
    
      
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

     
     showImg(item:any){
    
      var index = this.tableDataList.findIndex((e:any)=> e.productID == item.productID);
      this.productImage = this.tableDataList[index].productImage;
    
    }


    save(type:any){}
  



    reset(){
      this.PBarcode = '';
      this.tableDataList = [];
      this.subTotal = 0;
      this.discount = 0;
      this.netTotal = 0;
      this.totalQty = 0;
      this.rowFocused = 0;
      this.prodFocusedRow = 0;
      this.paymentType = '';
      this.change = 0;
      this.cash = 0;
      this.bankCash = 0;
      

    }



}
