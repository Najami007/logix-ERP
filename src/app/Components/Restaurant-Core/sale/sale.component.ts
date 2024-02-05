import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {




  crudList:any = [];
  companyProfile:any = [];

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    public global:GlobalDataModule,
    private dialogue:MatDialog,
    private route:Router
  ){
    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })
  }

  
  ngOnInit(): void {
    this.global.setHeaderTitle('Sale'); 
    this.getCategories();
    // setTimeout(() => {
    //   console.log(this.categoriesList[0]);
    // }, 500);
    setTimeout(() => {
      this.onCatSelected(this.categoriesList[0]);
    }, 200);
    // this.getAllRecipe();
    this.getTable();
    this.findHoldBills('HS');
    
    // this.RecipeList =  this.RecipeList.filter((e:any)=>e.recipeCatID == this.categoryID);
   
    
  }



  orderTypeList:any = [
    {val:'di' , title:'Dine In'},
    {val:'ta' , title:'Take away'},
    {val:'hd' , title:'Home Delivery'},
  ]

  categoriesList:any = [];



  tempProductList = [
    {id:1,catID:6, pName:'Coke',pSale:150,img:'../../../../assets/Images/pepsi.jfif'},
    {id:2,catID:6,pName:'Pepsi',pSale:120,img:'../../../../assets/Images/pepsi.jfif'},
    {id:3,catID:1,pName:'Chicken Fajiat Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:4,catID:2,pName:'Burger',pSale:500,img:'../../../../assets/Images/Burger.jpg'},
    {id:5,catID:2,pName:'Pasta',pSale:750,img:'../../../../assets/Images/pasta.jfif'},
    {id:6,catID:1,pName:'Vegetable Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:7,catID:2,pName:'Cheese Burger',pSale:500,img:'../../../../assets/Images/Burger.jpg'},
    {id:8,catID:2,pName:'Fruid Salad',pSale:750,img:'../../../../assets/Images/FruitSalad.jfif'},
    {id:9,catID:1,pName:'Crust Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:10,catID:5,pName:'Prawns',pSale:500,img:'../../../../assets/Images/Prawns.jfif'},
    {id:11,catID:6,pName:'Pasta',pSale:750,img:'../../../../assets/Images/pasta.jfif'},
    {id:12,catID:1,pName:' Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:13,catID:1,pName:' Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:14,catID:1,pName:' Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:15,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:16,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:17,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:18,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:19,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:20,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
  
  ]



  bankCoaID = 0;
  OtherCharges:any = 0;
  billDiscount:any = 0;
  invBillNo = '';
  prevTableID= 0;
  orderNo = 0;
  coverOf:any;
  billRemarks = '';
  BookerID = 0;
  ProjectID = this.global.InvProjectID;
  PartyID = 0;
  invoiceDate:Date = new Date();
  categoryID:any = 0;
  orderType = 'di';
  paymentType = '';
  cash = 0;
  bankCash = 0;

  tableID = 0;
  tempTableID = 0;
  tempOrderType = '';
  tableTitle:any = '';
  

  tempProdRow:any = [];
  tempQty:any;
  tempIndex:any;

  tableData:any = [];
  subTotal:number = 0;
  netTotal = 0 ;
  tempRecipeList:any = [];
  RecipeList:any = [];
  holdBillList:any = [];

  tableList:any = [];

  getTable(){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetTable').subscribe(
      (Response:any)=>{
        this.tableList = Response;
        //console.log(Response);
      }
    )
  }


  selectT(){

    if(this.tempTableID == 0 || this.tempTableID == undefined){
      this.msg.WarnNotify('Select Table')
    }else if(this.orderType == '' || this.orderType == undefined || this.orderType == null){
      this.msg.WarnNotify('Select Order Type')
    }else if(this.coverOf == '' || this.coverOf == 0 || this.coverOf == undefined){
      this.msg.WarnNotify('Enter Cover oF')
    }else{

      this.tableID = this.tempTableID;
      this.tableTitle = this.tableList.find((e:any)=>e.tableID == this.tableID).tableTitle;
      this.orderType = this.tempOrderType;

      $('#NewBill').hide();
      $('.modal').remove();
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();


    }
    
    
  }

  


  // getAllRecipe(){
  //   this.http.get(environment.mainApi+this.global.restaurentLink+'GetAllRecipes').subscribe(
  //     (Response:any)=>{
  //      this.tempRecipeList = Response;
  //       this.RecipeList = this.tempRecipeList.filter((e:any)=>e.recipeCatID == this.categoryID);
  //       //console.log(Response);
  //     }
  //   )
  // }

  onCatSelected(item:any){
    this.categoryID = item.recipeCatID;
    // alert(item.recipeCatID)
    // alert(item.prodFlag)
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetAllRecipesCatWise?CatID='+item.recipeCatID +'&reqFlag='+item.prodFlag).subscribe(
      (Response:any)=>{
        //console.log(Response)
        this.RecipeList = Response;
      }
    )
    // this.RecipeList = this.tempRecipeList.filter((e:any)=>e.recipeCatID == catID);
  }



  getCategories(){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetRecipeCategories').subscribe(
      (Response:any)=>{
        this.categoriesList = Response;
        console.log(Response);
        this.categoryID = this.categoriesList[0].recipeCatID;
    
      }
    )
  }


  rowFocused = 0;
  handleFocus(item:any ,e:any,cls:string){

    if(item.quantity < 0 || item.quantity == ''){
      item.quantity = 0;
    }

  /////move down
    if(e.keyCode == 40){
     
     if(this.tableData.length > 1 ){
      this.rowFocused += 1;
      if (this.rowFocused >= this.tableData.length) {      
        this.rowFocused -= 1  
    } else {
        var clsName = cls + this.rowFocused; 
        // alert(clsName);   
        $(clsName).trigger('focus');    
    }}
  }


     //Move up
     if (e.keyCode == 38) {

       if (this.tableData.length > 1) {

          this.rowFocused -= 1;

          var clsName = cls + this.rowFocused;
          // alert(clsName);
          $(clsName).trigger('focus');
          

      }

  }

    ////removeing row
    if (e.keyCode == 46) {
      this.deleteRow(item);
    //  $(cls+'0').trigger('focus');   
  }

  }




 ///////////////////////////////////////////////////////////////
  getTotal(){
    this.subTotal = 0;
     this.tableData.forEach((e:any) => {
      this.subTotal += e.salePrice * e.quantity;
    });
    if(this.OtherCharges == '' || this.OtherCharges == undefined){
      this.OtherCharges = 0;
    }
    if(this.billDiscount == '' || this.billDiscount == undefined){
      this.billDiscount = 0;
    }
    this.netTotal = (this.subTotal + parseFloat(this.OtherCharges)) - parseFloat(this.billDiscount);
  }


  ///////////////////////////////////////////////////////////////

  productSelected(item:any,qty:any){
    // alert(this.tempIndex);
    if(this.tableID == 0 && this.orderType == 'di'){
      this.msg.WarnNotify('Table Number Must be Selected');
    }else if(qty <= 0){
      this.msg.WarnNotify('Enter Valid Quantity')
    }else{
      var index = this.tableData.findIndex((e:any)=> e.recipeID == item.recipeID); 
      // console.log(index);
      // alert( index)
      //if(index !== -1){
     //   this.tableData[index].quantity = parseFloat( this.tableData[index].quantity +1 ); 
     // }else{
       
     this.tableData.push({productID:item.productID,productTitle:item.recipeTitle,quantity:qty,costPrice:item.recipeCostPrice,avgCostPrice:item.avgCostPrice,
    salePrice:item.recipeSalePrice,recipeID:item.recipeID,cookingAriaID:item.cookingAreaID,cookingTime:item.cookingTime,requestType:'Order',entryType:'New'});
          // this.tableData.push({recipeID:item.recipeID,recipeTitle:item.recipeTitle,quantity:qty,recipeSalePrice:item.recipeSalePrice});
      
     // }
      this.getTotal();
    }
    this.tempProdRow = [];
  }



  save(type:any){

    if(this.tableID == 0 || this.tableID == undefined){
      this.msg.WarnNotify('Select Table')
    }else if(this.orderType == '' || this.orderType == undefined){
      this.msg.WarnNotify('Select Order Type')
    }else if(this.tableData == '' || this.tableData == undefined){
      this.msg.WarnNotify('One Product must be Entered')
    }else{

      if(this.billDiscount == '' || this.billDiscount == undefined || this.billDiscount == null){
        this.billDiscount = 0;
      }

      if(this.OtherCharges == '' || this.OtherCharges == undefined || this.OtherCharges == null){
        this.OtherCharges = 0;
      }


      
      if(type == 'hold'){
        this.app.startLoaderDark()
        this.http.post(environment.mainApi+this.global.restaurentLink+'InsertHold',{
          InvDate: this.global.dateFormater(this.invoiceDate,'-'),
          TableID: this.tableID,
          PartyID: this.PartyID,
          InvType: "HS",
          ProjectID: this.ProjectID,
          BookerID: this.BookerID,
          PaymentType: this.paymentType,
          Remarks: this.billRemarks,
          OrderType: this.orderType,
          CoverOf: this.coverOf,
      
          SaleDetail: JSON.stringify(this.tableData) ,
      
          UserID: this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Saved Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getTable()
              this.reset();
              
            }else{
              this.msg.WarnNotify(Response.msg);
            }
            this.app.stopLoaderDark();
          }
        )
      }

      if(type == 'rehold'){
        this.dialogue.open(PincodeComponent,{
          width:'30%',
        }).afterClosed().subscribe(pin=>{
          if(pin != ''){
            this.app.startLoaderDark()
            this.http.post(environment.mainApi+this.global.restaurentLink+'UpdateHold',{
              InvBillNo:this.invBillNo,
              OrderNo:this.orderNo,
              InvDate: this.global.dateFormater(this.invoiceDate,'-'),
              TableID: this.tableID,
              TmpTableID:this.prevTableID,
              PartyID: this.PartyID,
              InvType: "HS",
              ProjectID: this.ProjectID,
              BookerID: this.BookerID,
              PaymentType: this.paymentType,
              Remarks: this.billRemarks,
              OrderType: this.orderType,
              CoverOf: this.coverOf,
              PinCode:pin,
          
              SaleDetail: JSON.stringify(this.tableData) ,
          
              UserID: this.global.getUserID()
            }).subscribe(
              (Response:any)=>{
                if(Response.msg == 'Data Updated Successfully'){
                  this.msg.SuccessNotify(Response.msg);
                  this.getTable()
                  this.reset();
                  
                }else{
                  this.msg.WarnNotify(Response.msg);
                }
                this.app.stopLoaderDark();
              }
            )
          }
        })
        
      }

      if(type == 'sale'){
        this.dialogue.open(PincodeComponent,{
          width:'30%',
        }).afterClosed().subscribe(pin=>{
          if(pin != ''){
            this.app.startLoaderDark()
            this.http.post(environment.mainApi+this.global.restaurentLink+'InsertSale',{
              HoldInvNo:this.invBillNo,
              OrderNo:this.orderNo,
              InvDate: this.global.dateFormater(this.invoiceDate,'-'),
              TableID: this.tableID,
              TmpTableID:this.prevTableID,
              PartyID: this.PartyID,
              InvType: "S",
              ProjectID: this.ProjectID,
              BookerID: this.BookerID,
              PaymentType: this.paymentType,
              Remarks: this.billRemarks,
              OrderType: this.orderType,
              CoverOf: this.coverOf,

              BillTotal:this.subTotal,
              BillDiscount:this.billDiscount,
              OtherCharges:this.OtherCharges,
              NetTotal:this.netTotal,
              CashRec:this.cash,
              Change:(this.cash - this.netTotal),
              BankCoaID:this.bankCoaID,
              BankCash:this.bankCash,
              
          
              SaleDetail: JSON.stringify(this.tableData) ,
              PinCode:pin,
              UserID: this.global.getUserID()
            }).subscribe(
              (Response:any)=>{
                if(Response.msg == 'Data Saved Successfully'){
                  this.msg.SuccessNotify(Response.msg);
                  this.getTable()
                  this.reset();
                  
                }else{
                  this.msg.WarnNotify(Response.msg);
                }
                this.app.stopLoaderDark();
              }
            )
          }
        })
        
      }

    }


  }



  findHoldBills(type:any){


    this.http.get(environment.mainApi+this.global.inventoryLink+'GetInventoryBillSingleDate?Type='+type+'&creationdate='+this.global.dateFormater(new Date(),'-')).subscribe(
      (Response:any)=>{
        this.holdBillList = Response;
         console.log(this.holdBillList);
      }
    )
  }

  ///////////////////////////////////////////////////////////////

  deleteRow(item:any){
    var index = this.tableData.indexOf(item);
    this.tableData.splice(index,1);
    this.getTotal();
  }


  ///////////////////////////////////////////////////////////////

  changeQty(type:any,index:any){
    this.tempIndex = index;
  
    if(type == 'add'){

      this.tableData[index].quantity = (parseFloat(this.tableData[index].quantity) + 1) ;

    }
    if(type == 'minus'){
      if( this.tableData[index].quantity > 1){
        this.tableData[index].quantity = (parseFloat(this.tableData[index].quantity)- 1 );
      }
      

    }

    this.getTotal();
  }








///////////////////////////////////////////////////////////////

  reset(){
  this.bankCoaID = 0;
  this.OtherCharges = 0;
  this.billDiscount = 0;
  this.invBillNo = '';
  this.prevTableID= 0;
  this.orderNo = 0;
  this.coverOf = '';
  this.billRemarks = '';
  this.BookerID = 0;
  this.ProjectID = this.global.InvProjectID;
  this.PartyID = 0;
  this.invoiceDate = new Date();
  this.orderType = 'di';
  this.paymentType = '';
  this.cash = 0;
  this.bankCash = 0;

  this.tableID = 0;
  this.tempTableID = 0;
  this.tempOrderType = '';
  this.tableTitle = '';
  this.tempProdRow = [];
  this.tempQty = 0;
  this.tempIndex = 0;
  this.tableData = [];
  this.subTotal = 0;
  this.netTotal = 0 ;
  this.tempRecipeList = [];

  }


}
