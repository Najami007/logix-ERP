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
    private global:GlobalDataModule,
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
    this.getAllRecipe();
    
    // this.RecipeList =  this.RecipeList.filter((e:any)=>e.recipeCatID == this.categoryID);
   
    
  }

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

  TablesList:any = [
    {id:1,name:'Dewan-e-Khas'},
    {id:2,name:'Main Hal'},
    {id:3,name:'Metting Room'},
  ]

  orderTypes = [
    {id:1, title:'Dine In'},
    {id:2, title:'Take Away'},
    {id:3, title:'Home Delivery'},
    
  ]






  tempQty:any;
  tempIndex:any;

  tableData:any = [];
  ProductList:any = [];
  orderTypeID:any = 1;
  categoryID:any = 0;
  subTotal:number = 0;
  netTotal:number = 0;
  RecipeList:any = []


  getAllRecipe(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetAllRecipes').subscribe(
      (Response:any)=>{
        this.RecipeList = Response;
        //console.log(Response);
      }
    )
  }



  getCategories(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetRecipeCategories').subscribe(
      (Response:any)=>{
        this.categoriesList = Response;
        this.categoryID = this.categoriesList[0].recipeCatID;
    
      }
    )
  }





 ///////////////////////////////////////////////////////////////
  getTotal(){
    this.subTotal = 0;
     this.tableData.forEach((e:any) => {
      this.subTotal += e.recipeSalePrice * e.quantity;
    });
  }


  ///////////////////////////////////////////////////////////////

  productSelected(item:any){

    var index = this.tableData.findIndex((e:any)=> e.recipeID == item.recipeID); 
    // console.log(index);
    // alert( index)
    if(index !== -1){
      this.tableData[index].quantity = parseFloat( this.tableData[index].quantity +1 ); 
    }else{
      this.tableData.push({recipeID:item.recipeID,recipeTitle:item.recipeTitle,quantity:1,recipeSalePrice:item.recipeSalePrice});

    }
    this.getTotal();
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
    this.ProductList = [];
  }



  save(){
    console.log(this.tableData);
  }
}
