import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import { error } from 'jquery';
import { AddBrandComponent } from '../Configurations/brand/add-brand/add-brand.component';
import { AddRackComponent } from '../Configurations/racks/add-rack/add-rack.component';
import { AddUOMComponent } from '../Configurations/unit-of-measurement/add-uom/add-uom.component';
import { AddCategoryComponent } from '../Configurations/product-category/add-category/add-category.component';
import { AddProdSubCategoryComponent } from '../Configurations/product-sub-category/add-prod-sub-category/add-prod-sub-category.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  crudList:any = {c:true,r:true,u:true,d:true};

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  AutoFillProdNameFeature = this.global.AutoFillNameFeature;

  applyFilter() {
    // const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.searchProduct;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  loadingBar = 'start';


  page:number = 1;
  count: number = 0;
 
  tableSize: number = 0;
  tableSizes : any = [];

  onTableDataChange(event:any){

    this.page = event;
    this.getProductList();
    setTimeout(() => {
      this.filterProductList(this.filterType);
    }, 500);
  }

  onTableSizeChange(event:any):void{
    this.tableSize = event.target.value;
    this.page =1;
    this.getProductList();
    setTimeout(() => {
      this.filterProductList(this.filterType);
    }, 500);
  }

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
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
    this.getProductTypes();
    this.getUOMList();
    this.getProductList();
    this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;
    for (let i = 0; i <= 100; i++) { this.discountList.push({ value: i }); }
  }

  discountList: any = [];
  brandFilterID = 0;
  subCategoryFilterID = 0;
  categoryFilterID = 0;
  activeFilterID:any = '-';

  filterType = '';

  subCategoryFilterList:any = [];
  tempProdList:any= [];

  filterProductList(type:any){
    
    this.filterType = type;

    if(type == 'brand'){
      this.productList = this.brandFilterID == 0 ? this.productList = this.tempProdList : this.tempProdList.filter((e:any)=> e.brandID == this.brandFilterID);


    }

    if(type == 'subcat'){
      
      this.productList =this.subCategoryFilterID == 0 ? this.productList = this.tempProdList : this.tempProdList.filter((e:any)=> e.subCategoryID == this.subCategoryFilterID);
 
    }
   

    
    if(type == 'status'){

      this.productList =this.activeFilterID == '-' ? this.productList = this.tempProdList : this.tempProdList.filter((e:any)=> e.activeStatus == this.activeFilterID);
    }

    if(type == 'disc'){

      if(this.discFilterID == 0){
        this.productList = this.tempProdList;
      }else if(this.discFilterID == 1){
        this.productList = this.tempProdList.filter((e:any)=> e.discPercentage > 0);
      }else if(this.discFilterID == 2){
        this.productList = this.tempProdList.filter((e:any)=> e.discPercentage == 0);
      }

    }

 
  }


  
  

  isAsc = false;
  sortProds(key:any){
    this.isAsc = !this.isAsc;
    this.productList = this.global.sortByKey(this.productList,key, this.isAsc ? 'asc' : 'desc');
  }

 
  tabIndex: any;
  Validation = true;
  btnType = 'Save';
  autoEmpty = false;
  searchProduct:any = '';
  CategoriesList: any;
  SubCategoriesList: any;
  ProductID: any;
  CategoryID: any;
  SubCategoryID: any;
  ProductName: any;
  prodBarcodeType = 'auto';
  Barcode: any;
  CostPrice: any;
  SalePrice: any;
  productType: any;
  productImg:any;

  BrandID: any;
  rackID: any;
  minRol: any;
  maxRol: any;
  DiscPercent: any = 0;
  DiscRupee: any = 0;
  gst: any;
  Et: any;
  allowMinus: any = false;
  barcodeType: any = 'Basic';
  Description: any;
  pctCode: any;
  UOMID: any;
  prodTypeID:any;

  discFilterID = 0;
  DiscFilterList:any = [
    {val:0,title:'All'},
    {val:1,title:'Disc'},
    {val:2,title:'W/O Disc'},
  ]


  productNameOthLanguage: any;
  productCode: any;
  BrandList: any = [];
  RacksList: any = [];
  ProductTypeList:any = [];
  UOMList: any = [];
  productList:any = [];
  allowMinusList:any = [{value:true,title:'True'},{value:false,title:'false'},]


  displayedColumns = ['Product Title', 'Product Title 2', 'Product Barcode', 'Sub Category', 
  'Brand','UOM','Type', 'Cost Price', 'Average Cost' , 'Sale Price','GST', 'Entered By','Active Status','Image','Edit','Delete' ]

  applyDiscount() {
    this.DiscRupee = (this.SalePrice == '' || this.SalePrice == undefined || this.SalePrice == null ? 0 : this.SalePrice * this.DiscPercent) / 100
  }
  
  getProductList(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetProduct').subscribe(
      (Response:any)=>{
        this.productList = Response;
        this.tempProdList = Response;
      }
    )
  }


  getProductTypes(){
    this.http.get(environment.mainApi + this.global.inventoryLink+'GetProductType').subscribe(
      (Response: any) => {
        this.ProductTypeList = Response;
     
      },
      (Error:any)=>{
        this.msg.WarnNotify(Error);
      
       }
    )
  }



  getUOMList() {
    this.http.get(environment.mainApi + this.global.inventoryLink+'GetUOM').subscribe(
      (Response: any) => {
        this.UOMList = Response;
     
      },
      (Error:any)=>{
        this.msg.WarnNotify(Error);
      
       }
    )
  }



  getRacksList() {
    this.http.get(environment.mainApi + this.global.inventoryLink+'getrack').subscribe(
      (Response: any) => {
        this.RacksList = Response;
      },
      (Error:any)=>{
        this.msg.WarnNotify(Error);
       
       }
    )
  }



  getBrandList() {
    this.http.get(environment.mainApi +this.global.inventoryLink+'GetBrand').subscribe(
      (Response: any) => {
        this.BrandList = Response;
      },
      (Error:any)=>{
        this.msg.WarnNotify(Error);
     
       }
    )
  }


  getSubCategory() {
    this.SubCategoryID = 0;
    this.http.get(environment.mainApi + this.global.inventoryLink+'GetSubCategory').subscribe(
      (Response: any) => {
        this.SubCategoriesList = Response.filter((e: any) => e.categoryID == this.CategoryID);
        this.subCategoryFilterList = Response;
      }
    )
  }




  getCategory() {
    this.http.get(environment.mainApi + this.global.inventoryLink+'GetCategory').subscribe(
      (Response: any) => {
        this.CategoriesList = Response;
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
    }
    else if(!this.AutoFillProdNameFeature && (this.productNameOthLanguage == '' || this.productNameOthLanguage == undefined) ){
      this.msg.WarnNotify('Enter Product Name In Other Language')
    }else if( !this.AutoFillProdNameFeature && (this.productCode == '' || this.productCode == undefined)){
      this.msg.WarnNotify('Enter Product Code')
    }
    else if(this.prodBarcodeType == 'manual' && (this.Barcode == '' || this.Barcode == undefined)){
      this.msg.WarnNotify('Enter Barcode')
    }else if(this.BrandID == '' || this.BrandID == undefined){
      this.msg.WarnNotify('Select Brand')
    }else if(this.rackID == '' || this.rackID == undefined){
      this.msg.WarnNotify('Select Rack ')
    }else if(this.UOMID == '' || this.UOMID == undefined){
      this.msg.WarnNotify('Select Unit of Measurement')
    }else if(this.CostPrice == '' || this.CostPrice <= 0 || this.CostPrice == undefined){
      this.msg.WarnNotify('Enter Cost Price')
    } else if(this.SalePrice == '' || this.SalePrice <= 0 || this.SalePrice == undefined){
      this.msg.WarnNotify('Enter Sale Price')
    }else if(this.DiscPercent == null || this.DiscPercent < 0 || this.DiscPercent == undefined){
      this.msg.WarnNotify('Enter Discount In Percentage')
    }else if(this.DiscRupee == null || this.DiscRupee < 0 || this.DiscRupee == undefined){
      this.msg.WarnNotify('Enter Discount In Rupees')
    }else if(this.minRol == null || this.minRol < 0 || this.minRol == undefined){
      this.msg.WarnNotify('Enter Minimun Reorder Level')
    }else if(this.maxRol == null || this.maxRol < 0 || this.maxRol == undefined){
      this.msg.WarnNotify('Enter Maximum Reorder Level')
    }else if(this.gst == null || this.gst < 0 || this.gst == undefined){
      this.msg.WarnNotify('Enter General Sales Tax')
    }else if(this.Et == null || this.Et < 0 || this.Et == undefined){
      this.msg.WarnNotify('Enter Extra Tax')
    }else if(this.pctCode == '' || this.pctCode == undefined){
      this.msg.WarnNotify('Enter PCT Code')
    }else if( this.allowMinus == undefined){
      
      this.msg.WarnNotify('Select Allow Minus True or False')
    }else if( this.barcodeType == undefined){
      this.msg.WarnNotify('Select Barcode Type')
    }else if(this.SalePrice < this.CostPrice){
      this.msg.WarnNotify('Sale Price Is less Than Cost Price')
    }
    else {
       if(this.productImg == '' || this.productImg == undefined){
        this.productImg = '-'
      }

      if(this.Description == '' || this.Description == undefined){
        this.Description = '-';
      }

      if(this.prodBarcodeType == 'auto' && ( this.Barcode == '' || this.Barcode == undefined || this.Barcode == null)){
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
    this.http.post(environment.mainApi + this.global.inventoryLink+'InsertProduct', {
      CategoryID: this.CategoryID,
      SubCategoryID: this.SubCategoryID,
      BrandID: this.BrandID,
      RackID: this.rackID,
      ProductTitle: this.ProductName,
      ProductCode: this.AutoFillProdNameFeature ? this.ProductName : this.productCode,
      ProductTitleOtherLang: this.AutoFillProdNameFeature ? this.ProductName : this.productNameOthLanguage,
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
      ProductImage:this.productImg,
      ProductTypeID:this.prodTypeID,


      UserID: this.global.getUserID(),
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getProductList();
          this.reset('');
          this.app.stopLoaderDark();
        } else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error:any)=>{
        this.msg.WarnNotify(error);
        this.app.stopLoaderDark();
      }
    )
  }

  openFlag = false;
  update() {

  if(this.openFlag == false){
    this.openFlag = true;
    this.global.openPinCode().subscribe(pin=>{
      if(pin !== ''){
        this.app.startLoaderDark();     
        this.http.post(environment.mainApi + this.global.inventoryLink+'UpdateProduct', {
          ProductID: this.ProductID,
          CategoryID: this.CategoryID,
          SubCategoryID: this.SubCategoryID,
          BrandID: this.BrandID,
          RackID: this.rackID,
          ProductTitle: this.ProductName,
          ProductCode: this.AutoFillProdNameFeature ? this.ProductName : this.productCode,
          ProductTitleOtherLang: this.AutoFillProdNameFeature ? this.ProductName : this.productNameOthLanguage,
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
          ProductImage:this.productImg,
          ProductTypeID:this.prodTypeID,

          UserID: this.global.getUserID()
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Updated Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getProductList();
              this.reset('');
              this.app.stopLoaderDark();
              setTimeout(() => {
                this.filterProductList(this.filterType);
              }, 500);
             
            } else {
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
            this.openFlag = false;
          },
          (error:any)=>{
            this.msg.WarnNotify(error);
            this.app.stopLoaderDark();
          }
        )
      }

      if(pin == ''){
        this.openFlag = false;
      }
    }
    )
  }
  }

  reset(type:any) {
    this.ProductID = '';
    this.Barcode = '';
    this.productImg = '';
    this.btnType = 'Save';
    this.salePercent = '';
   if(this.autoEmpty == true || type == 'btn'){
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
    this.allowMinus = false;
    this.CostPrice = '';
    this.SalePrice = '';
    this.DiscPercent = 0;
    this.DiscRupee = 0;
    this.UOMID = '';
    // this.Barcode = '';
    this.prodBarcodeType = 'auto'
    this.barcodeType = 'Basic';
    this.prodTypeID = '';
 
    //this.btnType = 'Save';
    // this.productImg= '';
   }


  }


  edit(row: any) {
    this.SubCategoryID = 0;
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
    
    this.prodTypeID = row.productTypeID;
    this.tabIndex = 0;
    this.btnType = 'Update';

    this.global.getProdImage( row.productID).subscribe(
      (Response:any)=>{
        this.productImg = Response[0].productImage;
      }
    )
    


   }


  deleteProd(row: any) { 

    this.global.openPinCode().subscribe(pin=>{

     if(pin != ''){
      this.app.startLoaderDark();

      this.http.post(environment.mainApi+this.global.inventoryLink+'deleteProduct',{
        ProductID: row.productID,
        PinCode:pin,
        UserID: this.global.getUserID()

      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Deleted Successfully'){
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

     }})


  }

  activeProduct(row:any){
   
    this.global.openPinCode().subscribe(pin=>{
      if(pin != ''){
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+this.global.inventoryLink+'ActiveProduct',{
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


  /////// to change the tab on edit

  changeTab(tabNum: any) {
    this.tabIndex = tabNum;

  }

  @ViewChild('brand') mybrand:any;
  addBrand(){
    setTimeout(() => {
      this.mybrand.close()
   
    }, 200);
    this.dialogue.open(AddBrandComponent,{
      width:'40%'
    }).afterClosed().subscribe(value=>{
      if(value == 'Update'){
        this.getBrandList();
      }
    })
  }

  @ViewChild('rack') myrack:any; 
  addRack(){
    setTimeout(() => {
      this.myrack.close()
   
    }, 200);
    this.dialogue.open(AddRackComponent,{
      width:'40%'
    }).afterClosed().subscribe(value=>{
      if(value == 'Update'){
        this.getRacksList();
      }
    })
  }

  @ViewChild('uom') myUom:any;
  addUOM(){
    setTimeout(() => {
      this.myUom.close()
   
    }, 200);
    this.dialogue.open(AddUOMComponent,{
      width:'40%'
    }).afterClosed().subscribe(value=>{
      if(value == 'Update'){
        this.getUOMList();
      }
    })
  }

  @ViewChild('category') myCategory:any;
 
  addCategory(){
    // alert()
    
    setTimeout(() => {
      this.myCategory.close()
   
    }, 200);
  
    this.dialogue.open(AddCategoryComponent,{
      width:'40%'
    }).afterClosed().subscribe(value=>{
      if(value == 'Update'){
        this.getCategory();
      }
    })

  }

  @ViewChild('subCategory') mysubcat:any;

  addSubCategory(){
    setTimeout(() => {
      this.mysubcat.close()
   
    }, 200);
    this.dialogue.open(AddProdSubCategoryComponent,{
      width:'40%'
    }).afterClosed().subscribe(value=>{
      if(value == 'Update'){
        this.getSubCategory();
      }
    })

  }




  onImgSelected(event:any) {

  
    var imgSize = event.target.files[0].size ;
    var isConvert:number = parseFloat((imgSize / 1048576).toFixed(2));

    if(isConvert > 2){
      
       this.msg.WarnNotify('File Size is more than 2MB');
    }
    else{

    ////////////// will check the file type ////////////////
      if(this.global.getExtension(event.target.value) != 'pdf'){   
        let targetEvent = event.target;

    /////////// assign the targeted file to file variable
        let file:File = targetEvent.files[0];   
    
        let fileReader:FileReader = new FileReader();
    
     //////////////// if the file is other than pdf eill assign to product img varialb
        fileReader.onload =(e)=>{
          this.productImg = fileReader.result;          
        }
    
        fileReader.readAsDataURL(file);
    
      }else{
    
          this.msg.WarnNotify('File Must Be in jpg or png formate');
          event.target.value = '';
          this.productImg = '';
        }

    }
 
    
  }


  salePercent = '';

  generatePrice(e:any){
    
    if(e.keyCode == 13 || e == 'generate'){
      this.SalePrice = parseFloat(this.CostPrice) + (parseFloat(this.CostPrice) * parseFloat(this.salePercent) / 100);
    }
  }


}
