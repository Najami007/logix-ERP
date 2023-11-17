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
    {id:4,catID:2,pName:'Pasta',pSale:750,img:'../../../../assets/Images/pasta.jfif'},
    {id:6,catID:1,pName:'Vegetable Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:7,catID:2,pName:'Cheese Burger',pSale:500,img:'../../../../assets/Images/Burger.jpg'},
    {id:8,catID:2,pName:'Fruid Salad',pSale:750,img:'../../../../assets/Images/FruitSalad.jfif'},
    {id:9,catID:1,pName:'Crust Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:10,catID:5,pName:'Prawns',pSale:500,img:'../../../../assets/Images/Prawns.jfif'},
    {id:11,catID:6,pName:'Pasta',pSale:750,img:'../../../../assets/Images/pasta.jfif'},
    {id:3,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:3,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:3,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:3,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:3,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:3,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:3,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:3,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
    {id:3,catID:1,pName:'BBQ Pizza',pSale:1050,img:'../../../../assets/Images/pizza.jfif'},
  
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

  searchCat:any;
  tableData:any = [];
  ProductList:any = [];
  orderTypeID:any = 1;
  categoryID:any = 0;

  onCatSelected(id:any){
   this.ProductList =  this.tempProductList.filter((e:any)=>e.catID == id);

  }


 


  productSelected(item:any){


    // var row = this.tableData.find((e:any)=>e.name = item.name);
    // console.log(row);
    

    
      this.tableData.push({name:item.pName,qty:1,price:item.pSale});
   
    // else {
    //   alert()
    //   this.tableData[this.tableData.find((obj:any)=>obj.name == item.name).indexOf()].qty += 1;
    // }

    

  }

  deleteRow(index:any){
    this.tableData.splice(index,1);
  }

  changeQty(type:any,index:any){
    if(type == 'add'){
      this.tableData[index].qty += 1;

    }
    if(type == 'minus'){
      if( this.tableData[index].qty > 1){
        this.tableData[index].qty -= 1;
      }
      

    }

    

  }

}
