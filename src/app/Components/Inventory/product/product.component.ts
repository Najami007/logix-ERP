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
  ){

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })

  }



  ngOnInit(): void {
    this.global.setHeaderTitle('Product');
   this.getCategory();
   this.getBrandList();
   this.getRacksList();
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
  productType:any;

  BrandID:any;
  rackID:any;

  productNameOthLanguage:any;
  productCode:any;
  BrandList:any = [];
  RacksList:any = [];
 



  
  getRacksList(){
    this.http.get(environment.mainApi+'inv/getrack').subscribe(
      (Response:any)=>{
        this.RacksList = Response;
      }
    )
  }


    
  getBrandList(){
    this.http.get(environment.mainApi+'inv/GetBrand').subscribe(
      (Response:any)=>{
        this.BrandList = Response;
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


  insert(){
    this.http.post(environment.mainApi+'inv/InsertProduct',{
      CategoryID: this.CategoryID,
      SubCategoryID: this.SubCategoryID,
      BrandID: 3,
      RackID: 4,
      ProductTitle: this.ProductName,
      ProductCode: this.productCode,
      ProductTitleOtherLang: this.productNameOthLanguage,
      ProductDescription: "Product Desc Insert",
      MinRol: 5,
      MaxRol: 9.5,
      GST: 17,
      ET: 1,
      PCTCode: "-",
      AllowMinus: false,
      CostPrice: 55,
      SalePrice: 62,
      DiscPercentage: 0,
      DiscRupees: 0,
      UomID: 1,
      Barcode: "12345",
      BarcodeType: "Basic",
  
  
      UserID: 1
    })
  }

  reset(){}


  edit(row:any){}


  delete(row:any){}



  changeTab(tabNum:any){
    this.tabIndex = tabNum;

  }

}
