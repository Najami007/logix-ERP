import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

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



  

  categoryID:any = 0;
  orderType = 'di';
  paymentType = '';
  cash = 0;
  creditCard = 0;

  tableID = 0;
  tempTableID = 0;
  tempOrderType = '';
  tableTitle:any = '';
  

  tempProdRow:any = [];
  tempQty:any;
  tempIndex:any;

  tableData:any = [];
  subTotal:number = 0;
  tempRecipeList:any = [];
  RecipeList:any = [];


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
    this.tableID = this.tempTableID;
    this.tableTitle = this.tableList.find((e:any)=>e.tableID == this.tableID).tableTitle;
    this.orderType = this.tempOrderType;

    
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
        console.log(Response)
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
      this.subTotal += e.recipeSalePrice * e.quantity;
    });
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
       
          this.tableData.push({recipeID:item.recipeID,recipeTitle:item.recipeTitle,quantity:qty,recipeSalePrice:item.recipeSalePrice});
      
     // }
      this.getTotal();
    }
    this.tempProdRow = [];
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
    this.tempIndex ='';
    this.tempProductList = [];
    this.tempQty = '';
    this.tableID = 0;
    this.cash = 0;
    this.creditCard = 0;
    this.subTotal = 0;
  }



  save(){
    console.log(this.tableData);
  }
}
