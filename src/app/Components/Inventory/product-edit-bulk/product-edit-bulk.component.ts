import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-product-edit-bulk',
  templateUrl: './product-edit-bulk.component.html',
  styleUrls: ['./product-edit-bulk.component.scss']
})
export class ProductEditBulkComponent implements OnInit {
  /////////// crud list to handle user wise restriction //////////
  crudList: any = { c: true, r: true, u: true, d: true };


  AutoFillProdNameFeature = this.global.AutoFillNameFeature;
  discFeature = this.global.discFeature;



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
    this.global.setHeaderTitle('Product Edit Bulk');
    this.getCategory();
    this.getBrandList();

    for (let i = 0; i <= 100; i++) { this.discountList.push({ value: i }); }


  }

  discountList: any = [];

  reqType: any = 'OTHER';


  rptType: any = 'full'
  productList: any = [];
  tempProdList: any = [];


  /////////////////// getting Product List global Function //////////
  getProductList() {

    if (this.rptType == 'cw' && this.CategoryID == 0) {
      this.msg.WarnNotify('Select Category');
      return
    }
    if (this.rptType == 'scw' && (this.CategoryID == 0 || this.SubCategoryID == 0)) {
      this.msg.WarnNotify('Category Or Sub Category Not Selected');
      return
    }
    if (this.rptType == 'bw' && this.BrandID == 0) {
      this.msg.WarnNotify('Select Category');
      return
    }

    this.app.startLoaderDark();
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetProduct').subscribe(
      (Response: any) => {


        if (this.rptType == 'full') {
          this.productList = Response;
        }

        if (this.rptType == 'cw') {
          this.productList = Response.filter((e: any) => e.categoryID == this.CategoryID);
        }
        if (this.rptType == 'scw') {
          this.productList = Response.filter((e: any) => e.categoryID == this.CategoryID && e.subCategoryID == this.SubCategoryID);
        }
        if (this.rptType == 'bw') {
          this.productList = Response.filter((e: any) => e.brandID == this.BrandID);
        }

        this.tempProdList = this.productList;
        console.log(Response);
        this.app.stopLoaderDark();
      },
      (Error: any) => {
        console.log(Error);
        this.app.stopLoaderDark();
      }
    )
  }


  onDiscountChange(item: any) {
    var index = this.productList.indexOf(item);

    this.productList[index].discRupees = (item.salePrice * item.discPercentage) / 100;
  }



  CategoriesList: any = [];
  SubCategoriesList: any = [];
  updateSubCategoryList:any = [];
  SubCategoryID = 0;
  CategoryID = 0;
  getSubCategory(type:any) {
    
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSubCategory').subscribe(
      (Response: any) => {
       if(type == 'filter'){
        this.SubCategoryID = 0;
        this.SubCategoriesList = Response.filter((e: any) => e.categoryID == this.CategoryID);
       } 
       if(type == 'update'){
        this.updateSubCategoryID = 0;
        this.updateSubCategoryList = Response.filter((e: any) => e.categoryID == this.updateCategoryID);
       }
      }
    )
  }




  getCategory() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetCategory').subscribe(
      (Response: any) => {
        this.CategoriesList = Response;
      }
    )
  }

  BrandList: any = [];
  BrandID = 0;
  getBrandList() {
    this.global.getBrandList().subscribe((data: any) => { this.BrandList = data; });
  }

  isAsc = false;
  sortProds(key: any) {
    this.isAsc = !this.isAsc;
    this.productList = this.global.sortByKey(this.productList, key, this.isAsc ? 'asc' : 'desc');
  }


  checkAll = false;
  onCheckAll(e: any) {
    if (e.checked) {
      this.productList.forEach((e: any) => {
        e.isChecked = true;
      });
    }
    if (!e.checked) {
      this.productList.forEach((e: any) => {
        e.isChecked = false;
      });
    }
  }




  updateProdList() {


    var invalidProdList = this.productList.filter((e:any)=> Number(e.salePrice < e.costPrice));

    if(invalidProdList.length > 0){
      this.msg.WarnNotify(`${invalidProdList[0].productTitle} Sale Price Is not Valid` );
      return;
    }

    ///////// extracting data that is checked //////////////
    var ProductList = this.productList.filter((e: any) => e.isChecked == true);
    if (ProductList.length == 0) {
      this.msg.WarnNotify('No Products Selected');
      return;
    }

    /////////// verifying atleast one update check box checked ///////
    if (this.reqType == 'CAT' && !this.updateCategoryFlag && !this.updateSubcategoryFlag && !this.updateBrandFlag) {
      this.msg.WarnNotify('No type Checked');
      return
    }

    if(this.updateCategoryFlag && (this.updateCategoryID == 0 || this.updateSubCategoryID == 0)){
      this.msg.WarnNotify('Category or Sub Category Not Selected');
      return;
    }

    
    if(this.updateBrandFlag && this.UpdateBrandID == 0 ){
      this.msg.WarnNotify('Brand Not Selected');
      return;
    }

    var postData = {
      reqTypy: this.reqType,
      ProductDetail: JSON.stringify(ProductList),
      PinCode: '',
      UserID: this.global.getUserID(),
      CategoryID: this.updateCategoryFlag ? this.updateCategoryID : 0,       /////////// conditional Inserting ID
      SubCategoryID: this.updateCategoryFlag  ? this.updateSubCategoryID : 0,
      BrandID: this.updateBrandFlag ? this.UpdateBrandID : 0

    }


    //////////// opeinging pin code Modal
    this.global.openPinCode().subscribe(
      pin => {
        if (pin != '') {
          postData.PinCode = pin; ///// inserting pin to data modal
          this.app.startLoaderDark();
          console.log(postData);
          this.http.post(environment.mainApi + this.global.inventoryLink + 'UpdateProductsList', postData).subscribe(
            (Response: any) => {

              if (Response.msg == 'Data Updated Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.getProductList();
              } else {
                this.msg.WarnNotify(Response.msg);
              }
              this.app.stopLoaderDark();
              this.checkAll = false;

            },
            (Error: any) => {
              console.log(Error);
              this.app.stopLoaderDark();
            }
          )

        }
      }
    )

  }



  updateCategoryID: any = 0;
  updateSubCategoryID: any = 0;
  UpdateBrandID: any = 0;
  updateCategoryFlag = false;
  updateSubcategoryFlag = false;
  updateBrandFlag = false;


  gstAll: any = 0;
  discountAll: any = 0;

  onGstAllUpdate(e: any, type: any) {

    if(this.reqType == 'CAT'){
      return;
    }

    if (e.key == 'Enter') {
      this.productList.forEach((e: any) => {
        if (e.isChecked) {
          if (type == 'gst') e.gst = this.gstAll;
          if (type == 'disc') {
            e.discPercentage = this.discountAll;
            e.discRupees = (e.salePrice * e.discPercentage) / 100
          }
        }
      });
    }

  }


}
