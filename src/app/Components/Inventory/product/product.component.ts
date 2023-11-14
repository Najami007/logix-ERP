import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  crudList:any = [];

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private global:GlobalDataModule,
    private dialogue:MatDialog,
    private app:AppComponent,
    private route:Router
  ){}



  ngOnInit(): void {
    this.global.setHeaderTitle('Product');
   this.getCategory();
  }


  tabIndex:any ;
  Validation =true;
  btnType = 'Save';
  ProductsData:any;
  CategoriesList:any;
  SubCategoriesList:any;
  ProductID:any;
  CategoryID:any;
  SubCategoryID:any;
  ProductName:any;
  BarcodeType= 'auto';
  Barcode:any;
  Barcode1:any;
  CostPrice:any;
  SalePrice:any;
  
  
  getCrud(){
    this.http.get(environment.mainApi+'user/getusermenu?userid='+this.global.getUserID()+'&moduleid='+this.global.getModuleID()).subscribe(
      (Response:any)=>{
        this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      }
    )
  }



  
  getSubCategory(){
    this.http.get(environment.mainApi+'inv/GetSubCategory').subscribe(
      (Response:any)=>{
        this.SubCategoriesList = Response.filter((e:any)=>e.categoryID == this.CategoryID);
       
      }
    )
  }



  
  getCategory(){
    this.http.get(environment.mainApi+'inv/GetCategory').subscribe(
      (Response:any)=>{
        this.CategoriesList = Response;
      }
    )
  }


  save(){}

  reset(){}


  edit(row:any){}


  delete(row:any){}



  changeTab(tabNum:any){
    this.tabIndex = tabNum;

  }

}
