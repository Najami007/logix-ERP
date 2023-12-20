import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-park-sale',
  templateUrl: './park-sale.component.html',
  styleUrls: ['./park-sale.component.scss']
})
export class ParkSaleComponent {
  



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
    // this.global.getCompany().subscribe((data)=>{
    //   this.companyProfile = data;
    // });

    // this.global.getMenuList().subscribe((data)=>{
    //   this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    // })
  }

  
  ngOnInit(): void {
    this.global.setHeaderTitle('Sale'); 
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
    {id:1,catID:6, pName:'Swing',pSale:200,img:'../../../../assets/Images/swing.jpg'},
    {id:2,catID:6,pName:'Jhoolay Lal',pSale:120,img:'../../../../assets/Images/swing2.jpg'},
    {id:3,catID:1,pName:'Adult swing',pSale:1050,img:'../../../../assets/Images/adultSwing.jpg'},
    {id:4,catID:2,pName:'Chair',pSale:500,img:'../../../../assets/Images/electricChair.jpg'},
   
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
