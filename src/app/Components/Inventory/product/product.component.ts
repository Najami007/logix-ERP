import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import { error } from 'jquery';
import { AddBrandComponent } from '../brand/add-brand/add-brand.component';
import { AddRackComponent } from '../racks/add-rack/add-rack.component';
import { AddUOMComponent } from '../unit-of-measurement/add-uom/add-uom.component';
import { AddCategoryComponent } from '../product-category/add-category/add-category.component';
import { AddProdSubCategoryComponent } from '../product-sub-category/add-prod-sub-category/add-prod-sub-category.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  crudList: any = [];

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private global: GlobalDataModule,
    private dialogue: MatDialog,
    private app: AppComponent,
    private route: Router
  ) {

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

  }



  ngOnInit(): void {
    this.global.setHeaderTitle('Product');
    this.getCategory();
    this.getSubCategory();
    this.getBrandList();
    this.getRacksList();
    this.getUOMList();
    this.getProductList();
  }


  tabIndex: any;
  Validation = true;
  btnType = 'Save';
  
  CategoriesList: any;
  SubCategoriesList: any;
  ProductID: any;
  CategoryID: any;
  SubCategoryID: any;
  ProductName: any;
  BarcodeType = 'auto';
  Barcode: any;
  CostPrice: any;
  SalePrice: any;
  productType: any;


  BrandID: any;
  rackID: any;
  minRol: any;
  maxRol: any;
  DiscPercent: any;
  DiscRupee: any;
  gst: any;
  Et: any;
  allowMinus: any = false;
  barcodeType: any = 'Basic';
  Description: any;
  pctCode: any;
  UOMID: any;





  productNameOthLanguage: any;
  productCode: any;
  BrandList: any = [];
  RacksList: any = [];
  UOMList: any = [];
  productList:any = [];
  allowMinusList:any = [{value:true,title:'True'},{value:false,title:'false'},]



  getUOMList() {
    this.http.get(environment.mainApi + 'inv/GetUOM').subscribe(
      (Response: any) => {
        this.UOMList = Response;
     
      }
    )
  }



  getRacksList() {
    this.http.get(environment.mainApi + 'inv/getrack').subscribe(
      (Response: any) => {
        this.RacksList = Response;
      }
    )
  }



  getBrandList() {
    this.http.get(environment.mainApi + 'inv/GetBrand').subscribe(
      (Response: any) => {
        this.BrandList = Response;
      }
    )
  }


  getSubCategory() {
    this.http.get(environment.mainApi + 'inv/GetSubCategory').subscribe(
      (Response: any) => {
        this.SubCategoriesList = Response.filter((e: any) => e.categoryID == this.CategoryID);

      }
    )
  }




  getCategory() {
    this.http.get(environment.mainApi + 'inv/GetCategory').subscribe(
      (Response: any) => {
        this.CategoriesList = Response;
      }
    )
  }


  getProductList(){
    this.http.get(environment.mainApi+'inv/GetProduct').subscribe(
      (Response)=>{
        this.productList = Response;
        console.log(Response);
      }
    )
  }


  save() {

    if(this.CategoryID == '' || this.CategoryID == undefined){
      this.msg.WarnNotify('Select Category')
    }else if(this.SubCategoryID == '' ||this.SubCategoryID == undefined){
      this.msg.WarnNotify('Select SubCategory')
    }else if(this.ProductName == '' || this.ProductName == undefined){
      this.msg.WarnNotify('Enter Product Name')
    }else if(this.productNameOthLanguage == '' || this.productNameOthLanguage == undefined){
      this.msg.WarnNotify('Enter Product Name In Other Language')
    }else if(this.productCode == '' || this.productCode == undefined){
      this.msg.WarnNotify('Enter Product Code')
    }else if(this.BarcodeType == 'manual' && (this.Barcode == '' || this.Barcode == undefined)){
      this.msg.WarnNotify('Enter Barcode')
    }else if(this.BrandID == '' || this.BrandID == undefined){
      this.msg.WarnNotify('Select Brand')
    }else if(this.rackID == '' || this.rackID == undefined){
      this.msg.WarnNotify('Select Rack ')
    }else if(this.UOMID == '' || this.UOMID == undefined){
      this.msg.WarnNotify('Select Unit of Measurement')
    }else if(this.CostPrice == '' || this.CostPrice == undefined){
      this.msg.WarnNotify('Enter Cost Price')
    } else if(this.SalePrice == '' || this.SalePrice == undefined){
      this.msg.WarnNotify('Enter Sale Price')
    }else if(this.DiscPercent == '' || this.DiscPercent == undefined){
      this.msg.WarnNotify('Enter Discount In Percentage')
    }else if(this.DiscRupee == '' || this.DiscRupee == undefined){
      this.msg.WarnNotify('Enter Discount In Rupees')
    }else if(this.minRol == '' || this.minRol == undefined){
      this.msg.WarnNotify('Enter Minimun Reorder Level')
    }else if(this.maxRol == '' || this.maxRol == undefined){
      this.msg.WarnNotify('Enter Maximum Reorder Level')
    }else if(this.gst == '' || this.gst == undefined){
      this.msg.WarnNotify('Enter General Sales Tax')
    }else if(this.Et == '' || this.Et == undefined){
      this.msg.WarnNotify('Enter Extra Tax')
    }else if(this.pctCode == '' || this.pctCode == undefined){
      this.msg.WarnNotify('Enter PCT Code')
    }else if( this.allowMinus == undefined){
      alert(this.allowMinus);
      this.msg.WarnNotify('Select Allow Minus True or False')
    }else if( this.barcodeType == undefined){
      this.msg.WarnNotify('Select Barcode Type')
    }else {

      if(this.Description == '' || this.Description == undefined){
        this.Description = '-';
      }

      if(this.barcodeType == 'auto' && this.Barcode == ''){
        this.Barcode = '-';
      }

      if(this.btnType == 'Save'){
        this.insert();
      }else if(this.btnType == 'Update'){
        this.update();
      }

    }

   }


  insert() {
    this.app.startLoaderDark();
    console.log(  this.ProductID ,
    this.CategoryID ,
    this.SubCategoryID ,
    this.BrandID ,
    this.rackID ,
    this.ProductName ,
    this.productCode ,
    this.productNameOthLanguage ,
      this.Description ,
    this.minRol ,
    this.maxRol ,
    this.gst ,
    this.Et ,
    this.pctCode ,
    this.allowMinus ,
    this.CostPrice ,
    this.SalePrice ,
    this.DiscPercent ,
    this.DiscRupee ,
    this.UOMID ,
    this.Barcode ,
    this.barcodeType ,)
    this.http.post(environment.mainApi + 'inv/InsertProduct', {
      CategoryID: this.CategoryID,
      SubCategoryID: this.SubCategoryID,
      BrandID: this.BrandID,
      RackID: this.rackID,
      ProductTitle: this.ProductName,
      ProductCode: this.productCode,
      ProductTitleOtherLang: this.productNameOthLanguage,
      ProductDescription: this.Description,
      MinRol: this.minRol,
      MaxRol: this.maxRol,
      GST: this.gst,
      ET: this.Et,
      PCTCode: this.pctCode,
      AllowMinus: this.allowMinus,
      CostPrice: this.CostPrice,
      SalePrice: this.SalePrice,
      DiscPercentage: this.DiscPercent,
      DiscRupees: this.DiscRupee,
      UomID: this.UOMID,
      Barcode: this.Barcode,
      BarcodeType: this.barcodeType,


      UserID: this.global.getUserID(),
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getProductList();
          this.reset();
          this.app.stopLoaderDark();
        } else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error:any)=>{
        this.app.stopLoaderDark();
      }
    )
  }

  update() {
    
    this.dialogue.open(PincodeComponent, {
      width: '30%'
    }).afterClosed().subscribe(pin => {
      if (pin != '') {
        this.app.startLoaderDark();
        this.http.post(environment.mainApi + 'inv/UpdateProduct', {
          ProductID: this.ProductID,
          CategoryID: this.CategoryID,
          SubCategoryID: this.SubCategoryID,
          BrandID: this.BrandID,
          RackID: this.rackID,
          ProductTitle: this.ProductName,
          ProductCode: this.productCode,
          ProductTitleOtherLang: this.productNameOthLanguage,
          ProductDescription: this.Description,
          MinRol: this.minRol,
          MaxRol: this.maxRol,
          GST: this.gst,
          ET: this.Et,
          PCTCode: this.pctCode,
          AllowMinus: this.allowMinus,
          CostPrice: this.CostPrice,
          SalePrice: this.SalePrice,
          DiscPercentage: this.DiscPercent,
          DiscRupees: this.DiscRupee,
          UomID: this.UOMID,
          Barcode: this.Barcode,
          BarcodeType: this.barcodeType,
          PinCode: pin,

          UserID: this.global.getUserID()
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Updated Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getProductList();
              this.reset();
              this.app.stopLoaderDark();
            } else {
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
          },
          (error:any)=>{
            this.app.stopLoaderDark();
          }
        )
      }
    })
  }

  reset() {
    this.ProductID = '';
    this.CategoryID = '';
    this.SubCategoryID = '';
    this.BrandID = '';
    this.rackID = '';
    this.ProductName = '';
    this.productCode = '';
    this.productNameOthLanguage = '',
      this.Description = '';
    this.minRol = '';
    this.maxRol = '';
    this.gst = '';
    this.Et = '';
    this.pctCode = '';
    this.allowMinus = '';
    this.CostPrice = '';
    this.SalePrice = '';
    this.DiscPercent = '';
    this.DiscRupee = '';
    this.UOMID = '';
    this.Barcode = '';
    this.barcodeType = 'auto'
    this.barcodeType = '';
    this.btnType = 'Save';

  }


  edit(row: any) {
    this.ProductID = row.productID;
    this.CategoryID = row.categoryID;
    this.getSubCategory();
    this.SubCategoryID = row.subCategoryID;
    this.ProductName = row.productTitle;
    this.productNameOthLanguage = row.productTitleOtherLang;
    this.productCode = row.productCode;
    this.Barcode = row.barcode;
    this.BrandID = row.brandID;
    this.rackID = row.rackID;
    this.UOMID = row.uomID;
    this.CostPrice = row.costPrice;
    this.SalePrice = row.salePrice;
    this.DiscPercent = row.discPercentage;
    this.DiscRupee = row.discRupees;
    this.gst = row.gst;
    this.Et = row.et;
    this.pctCode = row.pctCode;
    this.minRol = row.minRol;
    this.maxRol = row.maxRol;
    this.allowMinus = row.allowMinus;
    this.barcodeType = row.barcodeType;
    this.Description = row.productDescription;
    this.tabIndex = 0;
    this.btnType = 'Update';


   }


  delete(row: any) { }

  activeProduct(row:any){
   
    this.dialogue.open(PincodeComponent,{
      width:'30%'
    }).afterClosed().subscribe(pin=>{
      if(pin != ''){
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+'inv/ActiveProduct',{
          ProductID: row.productID,
          ActiveStatus:!row.activeStatus,
          PinCode: pin,
          UserID: this.global.getUserID(),
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Updated Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.getProductList();
                this.app.stopLoaderDark();
              }else{
                this.msg.WarnNotify(Response.msg);
                this.app.stopLoaderDark();
              }
            },
          (error:any)=>{
            this.app.stopLoaderDark();
          }
          )
      }
    })
  }



  changeTab(tabNum: any) {
    this.tabIndex = tabNum;

  }


  addBrand(){
    this.dialogue.open(AddBrandComponent,{
      width:'40%'
    }).afterClosed().subscribe(value=>{
      if(value == 'Update'){
        this.getBrandList();
      }
    })
  }

  
  addRack(){
    this.dialogue.open(AddRackComponent,{
      width:'40%'
    }).afterClosed().subscribe(value=>{
      if(value == 'Update'){
        this.getRacksList();
      }
    })
  }


  addUOM(){
    this.dialogue.open(AddUOMComponent,{
      width:'40%'
    }).afterClosed().subscribe(value=>{
      if(value == 'Update'){
        this.getUOMList();
      }
    })
  }


  addCategory(){
    this.dialogue.open(AddCategoryComponent,{
      width:'40%'
    }).afterClosed().subscribe(value=>{
      if(value == 'Update'){
        this.getCategory();
      }
    })

  }


  addSubCategory(){
    this.dialogue.open(AddProdSubCategoryComponent,{
      width:'40%'
    }).afterClosed().subscribe(value=>{
      if(value == 'Update'){
        this.getSubCategory();
      }
    })

  }



}
