import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';

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
    this.categoryID = this.categoriesList[0].id;
    this.ProductList =  this.tempProductList.filter((e:any)=>e.catID == this.categoryID);
   
    
  }

  categoriesList:any = [
    {id:1,name:'Pizza'},
    {id:2,name:'Burger'},
    {id:3,name:'Cold Drinks'},
    {id:4,name:'Desi Food'},
    {id:5,name:'Continental Food'},
    {id:6,name:'Beverages'},
    // {id:5,name:'Continental Food'},
    // {id:6,name:'Beverages'},
    // {id:5,name:'Continental Food'},
    // {id:6,name:'Beverages'},
    // {id:5,name:'Continental Food'},
    // {id:6,name:'Beverages'},
    // {id:5,name:'Continental Food'},
    // {id:6,name:'Beverages'},
    // {id:5,name:'Continental Food'},
    // {id:6,name:'Beverages'}
  ]



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

  searchCat:any;
  tableData:any = [];
  ProductList:any = [];
  orderTypeID:any = 1;
  categoryID:any = 0;
  subTotal:number = 0;
  netTotal:number = 0;


  ///////////////////////////////////////////////////////////////
  onCatSelected(id:any){
    this.categoryID = id;
   this.ProductList =  this.tempProductList.filter((e:any)=>e.catID == id);

  }


 ///////////////////////////////////////////////////////////////
  getTotal(){
    this.subTotal = 0;
     this.tableData.forEach((e:any) => {
      this.subTotal += e.price * e.qty;
    });
  }


  ///////////////////////////////////////////////////////////////

  productSelected(item:any){

    var index = this.tableData.findIndex((e:any)=>e.id == item.id); 
    // console.log(index);
    if(index != -1){
      this.tableData[index].qty += 1; 
    }else{
      this.tableData.push({id:item.id,name:item.pName,qty:1,price:item.pSale});

    }
    this.getTotal();
  }

  ///////////////////////////////////////////////////////////////

  deleteRow(index:any){
    this.tableData.splice(index,1);
    this.getTotal();
  }


  ///////////////////////////////////////////////////////////////

  changeQty(type:any,index:any){
    this.tempIndex = index;
  
    if(type == 'add'){

      this.tableData[index].qty += 1;

    }
    if(type == 'minus'){
      if( this.tableData[index].qty > 1){
        this.tableData[index].qty -= 1;
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
