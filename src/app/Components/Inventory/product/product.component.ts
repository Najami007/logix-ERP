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
import { ProductBarcodesComponent } from './product-barcodes/product-barcodes.component';
import Swal from 'sweetalert2';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @ViewChild('filterPanel') filterPanel!: MatSidenav;

  /////////// crud list to handle user wise restriction //////////
  crudList: any = { c: true, r: true, u: true, d: true };

  dataSource!: MatTableDataSource<any>;




  //////////////// Pagination Setting
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  AutoFillProdNameFeature = this.global.AutoFillNameFeature;
  discFeature = this.global.discFeature;
  MultiBarcode = this.global.MultiBarcode;
  ManufacturingFeature = this.global.ManufacturingFeature;
  FurnitureSaleFeature = this.global.FurnitureSaleFeature;
  appConfigFeature = this.global.appConfigFeature;

  ImageUrlFeature = this.global.ImageUrlFeature;
  AddNewProductRestrictionFeature = this.global.AddNewProductRestrictionFeature;



  applyFilter() {
    // const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.searchProduct;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showAllFilterSubCategories = false;
  showAllFilterBrandList = false;

  tmpSearch = '';
  loadingBar = 'start';


  page: number = 1;
  count: number = 0;

  tableSize: number = 0;
  tableSizes: any = [];
  jumpPage: any = 0;
  tmpPage: number = 0;

  onTableDataChange(event: any) {

    this.page = event;
    this.getProductList();
    setTimeout(() => {
      this.AdvanceFilter();
    }, 500);
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getProductList();
    setTimeout(() => {
      this.AdvanceFilter();
    }, 500);
  }

  goToPage(): void {
    var count = this.productList.length / this.tableSize;
    if (parseFloat(this.jumpPage) > count) {
      this.msg.WarnNotify('Invalid Value')
      return;
    }

    if (this.jumpPage >= 1) {
      this.page = this.jumpPage;
      this.getProductList();
      setTimeout(() => {
        this.AdvanceFilter();
      }, 500);
    }
  }

  onProdSearchKeyup(e: any, value: any) {

    if (e.target.value.length == 0 && this.tmpPage == 0) {
      this.tmpPage = this.page;
      this.page = 1;
    }
    if (e.key == 'Backspace') {
      if (value.length == 1) {
        this.page = this.tmpPage;
        this.tmpPage = 0;
      }
    }


  }
  onProdSearchKeydown(e: any, value: any) {
    //    if(value.length == 0){
    //     alert(this.tmpPage)
    //   this.page = this.tmpPage;
    //   this.tmpPage = 0;
    // }
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


  mrp: any = 0;

  discountList: any = [];
  brandFilterID = 0;
  subCategoryFilterID = 0;
  categoryFilterID = 0;
  activeFilterID: any = '-';

  filterType = 'brand';



  tmpStatusList = [{ title: 'Active', value: true, isChecked: false }, { title: 'In Active', value: false, isChecked: false }]
  tmpDiscFilterList = [
    { title: 'With Disc', value: 1, isChecked: false },
    { title: 'Without Disc', value: 0, isChecked: false }];

  tmpGstFilterList = [
    { title: 'With GST', value: 1, isChecked: false },
    { title: 'Without GST', value: 0, isChecked: false }]
  tmpApplinkedList = [
    { title: 'Linked With APP', value: true, isChecked: false },
    { title: 'Not Linked With App', value: false, isChecked: false },
  ]

  costGreaterThenSaleFilter: any = false;
  avgCostGreaterThenSaleFilter: any = false;


  subCategoryFilterList: any = [];
  tempProdList: any = [];





  AdvanceFilter() {

    this.app.startLoaderDark();

    const subCatList = this.subCategoryFilterList
      .filter((e: any) => e.isChecked)
      .map((e: any) => e.subCategoryID);

    const brandList = this.BrandList
      .filter((e: any) => e.isChecked)
      .map((e: any) => e.brandID);

    const statusList = this.tmpStatusList
      .filter((e: any) => e.isChecked)
      .map((e: any) => e.value);

    const linkAppList = this.tmpApplinkedList
      .filter((e: any) => e.isChecked)
      .map((e: any) => e.value);

    const discList = this.tmpDiscFilterList
      .filter((e: any) => e.isChecked)
      .map((e: any) => e.value);

        const gstList = this.tmpGstFilterList
      .filter((e: any) => e.isChecked)
      .map((e: any) => e.value);





    this.productList = this.tempProdList.filter((p: any) =>
      (subCatList.length === 0 || subCatList.includes(p.subCategoryID)) &&
      (brandList.length === 0 || brandList.includes(p.brandID)) &&
      (statusList.length === 0 || statusList.includes(p.activeStatus)) &&
      (linkAppList.length === 0 || linkAppList.includes(p.linkWithApp)) &&
      (
        discList.length === 0 ||                               // no discount filter
        (discList.length === 1 && discList[0] === 1            // only 1 selected
          ? p.discPercentage > 0
          : discList.length === 1 && discList[0] === 0         // only 0 selected
            ? p.discPercentage <= 0
            : discList.includes(p.discPercentage)              // fallback for other cases
        )
      ) &&
      (
        gstList.length === 0 ||                               // no GST filter
        (gstList.length === 1 && gstList[0] === 1            // only 1 selected
          ? p.gst > 0
          : gstList.length === 1 && gstList[0] === 0         // only 0 selected
            ? p.gst <= 0
            : gstList.includes(p.gst)              // fallback for other cases
        )
      ) &&
      (this.costGreaterThenSaleFilter ? p.costPrice > p.salePrice : true) &&
      (this.avgCostGreaterThenSaleFilter ? p.avgCostPrice > p.salePrice : true)

    );


    this.filterPanel.close();
    this.app.stopLoaderDark();

  }



  clearFilter() {
    // reset checkboxes
    this.subCategoryFilterList.forEach((e: any) => e.isChecked = false);
    this.BrandList.forEach((e: any) => e.isChecked = false);
    this.tmpStatusList.forEach((e: any) => e.isChecked = false);
    this.tmpDiscFilterList.forEach((e: any) => e.isChecked = false);
    this.tmpApplinkedList.forEach((e: any) => e.isChecked = false);
    this.costGreaterThenSaleFilter = false;
    this.avgCostGreaterThenSaleFilter = false;
    // reset product list
    this.productList = [...this.tempProdList];

  }



  isAsc = false;
  sortProds(key: any) {
    this.isAsc = !this.isAsc;
    this.productList = this.global.sortByKey(this.productList, key, this.isAsc ? 'asc' : 'desc');
  }


  tabIndex: any;
  Validation = true;
  btnType = 'Save';
  autoEmpty = false;
  searchProduct: any = '';
  CategoriesList: any = [];
  ProductSupplierList: any = [];
  SubCategoriesList: any = [];
  ProductID: any = 0;
  CategoryID: any = 0;
  SubCategoryID: any = 0;
  ProductName: any = '';
  tmpProductName: any = '';
  prodBarcodeType = 'auto';
  Barcode: any = '';
  CostPrice: any = '';
  SalePrice: any = '';
  productType: any = 0;
  productImg: any = '';

  BrandID: any = 0;
  rackID: any = 0;
  minRol: any = '';
  maxRol: any = '';
  DiscPercent: any = 0;
  DiscRupee: any = 0;
  gst: any = '';
  Et: any = '';
  allowMinus: any = true;
  barcodeType: any = 'Basic';
  Description: any = '';
  pctCode: any = '';
  UOMID: any = 0;
  prodTypeID: any = 0;

  discFilterID = 0;
  DiscFilterList: any = [
    { val: 0, title: 'All' },
    { val: 1, title: 'Disc' },
    { val: 2, title: 'W/O Disc' },
  ]


  productNameOthLanguage: any = '';
  productCode: any = '';
  BrandList: any = [];
  RacksList: any = [];
  ProductTypeList: any = [];
  UOMList: any = [];
  productList: any = [];
  allowMinusList: any = [{ value: true, title: 'True' }, { value: false, title: 'false' },]


  displayedColumns = ['Product Title', 'Product Title 2', 'Product Barcode', 'Sub Category',
    'Brand', 'UOM', 'Type', 'Cost Price', 'Average Cost', 'Sale Price', 'GST', 'Entered By', 'Active Status', 'Image', 'Edit', 'Delete']


  ////// calculating Discount on Basis of Discount in Percentage click ////////////

  applyDiscount(type: any) {

    if (type == 'perc' || type == 'sale') {
      this.DiscRupee = (this.SalePrice == '' || this.SalePrice == undefined || this.SalePrice == null ? 0 : Number(this.SalePrice) * this.DiscPercent) / 100
    }

    if (type == 'rs') {
      this.DiscPercent = (this.SalePrice == '' || this.SalePrice == undefined || this.SalePrice == null ? 0 : this.DiscRupee / this.SalePrice) * 100
    }

  }



  /////////////////// getting Product List global Function //////////
  getProductList() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetProduct').subscribe(
      (Response: any) => {
        this.productList = Response;
        this.tempProdList = Response;
        this.AdvanceFilter();

      }
    )
  }



  ///////////////// Product Types //////////////////////

  getProductTypes() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetProductType').subscribe(
      (Response: any) => {
        this.ProductTypeList = Response;
        //////// assigning value on load/////////////
        if (Response.length > 0) { this.prodTypeID = Response[0].productTypeID; }
      },
      (Error: any) => {
        this.msg.WarnNotify(Error);

      }
    )
  }




  ////////////////////// Unit of Measurement ///////////
  getUOMList() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetUOM').subscribe(
      (Response: any) => {
        this.UOMList = Response;
        if (Response.length > 0) { this.UOMID = Response[0].uomID; }

      },
      (Error: any) => {
        this.msg.WarnNotify(Error);

      }
    )
  }




  /////////////////////////  Racks List /////////////////

  getRacksList() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'getrack').subscribe(
      (Response: any) => {
        this.RacksList = Response;
        //////// assigning value on load/////////////
        if (this.RacksList.length > 0) {
          this.rackID = this.RacksList[0].rackID;
        }
      },
      (Error: any) => {
        this.msg.WarnNotify(Error);

      }
    )
  }



  ///////////////////////// Brand List //////////////

  getBrandList() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetBrand').subscribe(
      (Response: any) => {

        //////// assigning value on load/////////////
        if (Response.length > 0) {
          this.BrandList = Response.sort((a: any, b: any) =>
            a.brandTitle.localeCompare(b.brandTitle)
          );;
          this.BrandID = this.BrandList[0].brandID;
        }
      },
      (Error: any) => {
        this.msg.WarnNotify(Error);

      }
    )
  }



  ////////////////////// Sub Categories List /////////////

  getSubCategory() {
    this.SubCategoryID = 0;
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSubCategory').subscribe(
      (Response: any) => {
        this.SubCategoriesList = Response.filter((e: any) => e.categoryID == this.CategoryID);

        if (Response.length > 0) {
          this.subCategoryFilterList = Response.sort((a: any, b: any) =>
            a.subCategoryTitle.localeCompare(b.subCategoryTitle)
          );
        }

      }
    )
  }




  ///////////////////// Product Supplier Details ///////////////
  getProductSupplierDetail(item: any) {
    this.ProductSupplierList = [];
    this.tmpProductName = item.productTitle;
    this.app.startLoaderDark();
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSinglePuroductSuppliers_13?reqProId=' + item.productID).subscribe(
      (Response: any) => {

        ////////////// Empty Data Alert //////////
        if (Response.length == 0 || Response == null) {
          this.global.popupAlert('Data Not Found!');
          this.app.stopLoaderDark();
          return;
        }
        this.ProductSupplierList = Response;
        this.app.stopLoaderDark();
        this.global.openBootstrapModal('#SuppDetMdl', true); ////////// using global bootstrap Modal Func

      },
      (Error: any) => {
        this.app.stopLoaderDark();
      }
    )
  }


  /////////////////////// List of Categories //////////////////
  getCategory() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetCategory').subscribe(
      (Response: any) => {
        this.CategoriesList = Response;
      }
    )
  }



  isBase64Image(str: string): boolean {
    if (typeof str !== "string") {
      return false;
    }

    // Regex for data:image/* base64 string
    const base64ImageRegex = /^data:image\/(png|jpg|jpeg|gif|webp|bmp|svg\+xml);base64,[A-Za-z0-9+/]+={0,2}$/;

    return base64ImageRegex.test(str);
  }

  /////////////////////////// Save Function Product//////////////
  save() {


    if(this.AddNewProductRestrictionFeature && this.btnType == 'Save'){
      this.msg.WarnNotify('Not Allowed to Add New Product');
      return;
    }


    if (this.CategoryID == '' || this.CategoryID == undefined) {
      this.msg.WarnNotify('Select Category');
      return;
    }
    if (this.SubCategoryID == '' || this.SubCategoryID == undefined) {
      this.msg.WarnNotify('Select SubCategory');
      return;
    }
    if (this.ProductName == '' || this.ProductName == undefined) {
      this.msg.WarnNotify('Enter Product Name');
      return;
    }

    if (this.prodBarcodeType == 'manual' && (this.Barcode == '' || this.Barcode == undefined)) {
      this.msg.WarnNotify('Enter Barcode');
      return;
    }
    if (this.BrandID == '' || this.BrandID == undefined) {
      this.msg.WarnNotify('Select Brand');
      return;
    }
    if (this.rackID == '' || this.rackID == undefined) {
      this.msg.WarnNotify('Select Rack ');
      return;
    }
    if (this.UOMID == '' || this.UOMID == undefined) {
      this.msg.WarnNotify('Select Unit of Measurement');
      return;
    }
    if ((this.CostPrice == '' || this.CostPrice <= 0 || this.CostPrice == undefined) && !this.ManufacturingFeature) {
      this.msg.WarnNotify('Enter Cost Price');
      return;
    }
    if ((this.SalePrice == '' || this.SalePrice <= 0 || this.SalePrice == undefined) && !this.ManufacturingFeature) {
      this.msg.WarnNotify('Enter Sale Price');
      return;
    }
    if (this.barcodeType == undefined) {
      this.msg.WarnNotify('Select Barcode Type');
      return;
    }
    if (this.SalePrice < this.CostPrice) {
      this.msg.WarnNotify('Sale Price Is less Than Cost Price');
      return;
    }


    if ((Number(this.SalePrice) - Number(this.DiscRupee)) < Number(this.CostPrice)) {
      this.msg.WarnNotify('Discount Not Valid');
      return;
    }



    if (this.prodBarcodeType == 'auto' && (this.Barcode == '' || this.Barcode == undefined || this.Barcode == null)) {
      this.Barcode = '-';
    }


    if (!this.isBase64Image(this.productImg)) {
      this.productImg = '-';
    }

    var postData = {
      ProductID: this.ProductID,
      CategoryID: this.CategoryID,
      SubCategoryID: this.SubCategoryID,
      BrandID: this.BrandID,
      RackID: this.rackID,
      ProductTitle: this.ProductName,
      ProductCode: this.productCode || this.ProductName,
      ProductTitleOtherLang: this.productNameOthLanguage || this.ProductName,
      ProductDescription: this.Description || '-',
      MinRol: this.minRol || 1,
      MaxRol: this.maxRol || 2,
      GST: this.gst || 0,
      ET: this.Et || 0,
      PCTCode: this.pctCode || '-',
      AllowMinus: this.allowMinus,
      CostPrice: this.CostPrice || 1,
      SalePrice: this.SalePrice || 1,
      DiscPercentage: this.DiscPercent,
      DiscRupees: this.DiscRupee,
      UomID: this.UOMID,
      Barcode: this.Barcode,
      BarcodeType: this.barcodeType,
      ProductImage: this.productImg || '-',
      ProductTypeID: this.prodTypeID,
      mrp: this.mrp || 0,
      UserID: this.global.getUserID()
    };
    if (this.btnType == 'Save') {
      this.insert(postData);
    } else if (this.btnType == 'Update') {
      this.update(postData);
    }


  }



  //////////////////////////////// Insert Function ////////////////
  insert(postData: any) {
    this.app.startLoaderDark();
    this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertProduct', postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getProductList();
          this.reset('');
          this.app.stopLoaderDark();
          $('#title2').trigger('select');
        } else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error: any) => {
        console.log(error);
        this.msg.WarnNotify(error);
        this.app.stopLoaderDark();
      }
    )
  }


  ////////////////////////// Update Function ///////////////
  openFlag = false;
  update(postData: any) {

    if (this.openFlag == false) {
      this.openFlag = true;
      this.global.openPinCode().subscribe(pin => {
        if (pin !== '') {
          this.app.startLoaderDark();
          postData['PinCode'] = pin;
          this.http.post(environment.mainApi + this.global.inventoryLink + 'UpdateProduct', postData).subscribe(
            (Response: any) => {
              if (Response.msg == 'Data Updated Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.getProductList();
                this.reset('');
                this.app.stopLoaderDark();
                setTimeout(() => {
                  this.AdvanceFilter();
                }, 500);

                $('#title2').trigger('select');

              } else {
                this.msg.WarnNotify(Response.msg);
                this.app.stopLoaderDark();
              }
              this.openFlag = false;
            },
            (error: any) => {
              console.log(error);
              this.msg.WarnNotify(error);
              this.app.stopLoaderDark();
            }
          )
        }

        if (pin == '') {
          this.openFlag = false;
        }
      }
      )
    }
  }



  //////////////////////////// Reset Fields ////////////////
  reset(type: any) {
    this.ProductID = 0;
    this.Barcode = '';
    this.productImg = '';
    this.btnType = 'Save';
    this.salePercent = '';
    if (this.autoEmpty == true || type == 'btn') {
      this.CategoryID = 0;
      this.SubCategoryID = 0;
      // this.BrandID = 0;
      // this.rackID = 0;
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
      // this.UOMID = 0;
      // this.Barcode = '';
      this.prodBarcodeType = 'auto'
      this.barcodeType = 'Basic';
      // this.prodTypeID = 0;

      //this.btnType = 'Save';
      // this.productImg= '';
    }


  }


  tmpImgPath = "'C:\inetpub\wwwroot\ERP_Images\'"


  /////////////////// Product Edit //////////////////
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
    this.mrp = row.mrp;

    if (this.ImageUrlFeature) {
      this.productImg = row.imagesPath;
    } else {

      ////////////// Product Img Global Fucntion ///////////
      this.global.getProdImage(row.productID).subscribe(
        async (Response: any) => {
          // this.productImg = Response[0].productImage;
          if (Response[0].productImage !== '-') {
            this.productImg = await this.compressBase64(Response[0].productImage, 400, 400, 0.5);
          } else {
            this.productImg = Response[0].productImage;
          }



        }
      )

    }





  }





  ////////////////////////// Copy Product Details ///////////////
  copyProd(row: any) {
    this.SubCategoryID = 0;
    this.CategoryID = row.categoryID;
    this.getSubCategory();
    this.SubCategoryID = row.subCategoryID;
    this.ProductName = row.productTitle;
    this.productNameOthLanguage = row.productTitleOtherLang;
    this.productCode = row.productCode;
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

    this.global.getProdImage(row.productID).subscribe(
      (Response: any) => {
        this.productImg = Response[0].productImage;
      }
    )



  }




  /////////////////////// Delete Product Func /////////////
  deleteProd(row: any) {

    this.global.openPinCode().subscribe(pin => {

      if (pin != '') {
        this.app.startLoaderDark();

        var postData = {
          ProductID: row.productID,
          PinCode: pin,
          UserID: this.global.getUserID()
        }

        this.http.post(environment.mainApi + this.global.inventoryLink + 'deleteProduct', postData).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Deleted Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getProductList();
              this.app.stopLoaderDark();


            } else {
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
          },
          (error: any) => {
            this.app.stopLoaderDark();
          }
        )

      }
    })


  }




  ////////////////Change Product Status ////////////////
  activeProduct(row: any) {

    this.global.openPinCode().subscribe(pin => {
      if (pin != '') {
        this.app.startLoaderDark();
        this.http.post(environment.mainApi + this.global.inventoryLink + 'ActiveProduct', {
          ProductID: row.productID,
          ActiveStatus: !row.activeStatus,
          PinCode: pin,
          UserID: this.global.getUserID(),
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Updated Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getProductList();
              this.app.stopLoaderDark();
            } else {
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
          },
          (error: any) => {
            this.app.stopLoaderDark();
          }
        )
      }
    })
  }


  /////// to change the tab on edit
  curFocusRow: any = -1;
  changeTab(tabNum: any) {
    this.tabIndex = tabNum;
    this.filterPanel.close();
    setTimeout(() => {
      if (this.tabIndex == 1) this.scrollToRow(this.curFocusRow)
    }, 500);
  }


  scrollToRow(index: number) {
    const row = document.getElementById('prod-' + index);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }


  /////////////// to Add New Brand Short cut ///////////////
  @ViewChild('brand') mybrand: any;
  addBrand() {
    /////// close List on Add Icon Click /////////
    setTimeout(() => {
      this.mybrand.close()
    }, 200);
    this.dialogue.open(AddBrandComponent, {
      width: '40%'
    }).afterClosed().subscribe(value => {
      if (value == 'Update') {
        this.getBrandList();
      }
    })
  }



  //////////////// to Add New Rack Short Cut ///////////////
  @ViewChild('rack') myrack: any;
  addRack() {
    /////// close List on Add Icon Click /////////
    setTimeout(() => {
      this.myrack.close()
    }, 200);
    this.dialogue.open(AddRackComponent, {
      width: '40%'
    }).afterClosed().subscribe(value => {
      if (value == 'Update') {
        this.getRacksList();
      }
    })
  }




  //////////////// to Add New Unit of Measurement Shortcut ///////////////
  @ViewChild('uom') myUom: any;
  addUOM() {
    /////// close List on Add Icon Click /////////
    setTimeout(() => {
      this.myUom.close()

    }, 200);
    this.dialogue.open(AddUOMComponent, {
      width: '40%'
    }).afterClosed().subscribe(value => {
      if (value == 'Update') {
        this.getUOMList();
      }
    })
  }



  //////////////// to Add New Category Short cut //////////////////
  @ViewChild('category') myCategory: any;
  addCategory() {
    // alert()
    /////// close List on Add Icon Click /////////
    setTimeout(() => {
      this.myCategory.close()

    }, 200);

    this.dialogue.open(AddCategoryComponent, {
      width: '40%'
    }).afterClosed().subscribe(value => {
      if (value == 'Update') {
        this.getCategory();
      }
    })

  }




  //////////////// adding New Subcategory Short cut ////////////////
  @ViewChild('subCategory') mysubcat: any;
  addSubCategory() {
    /////// close List on Add Icon Click /////////
    setTimeout(() => {
      this.mysubcat.close()
    }, 200);
    this.dialogue.open(AddProdSubCategoryComponent, {
      width: '40%'
    }).afterClosed().subscribe(value => {
      if (value == 'Update') {
        this.getSubCategory();
      }
    })

  }



  ///////////////// Imaging Converting Base 64 Function //////////



  onImgSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const imgSize = file.size;
    const isConvert: number = parseFloat((imgSize / 1048576).toFixed(2));

    ////////////// will check the file type ////////////////
    if (this.global.getExtension(event.target.value) !== 'pdf') {
      const fileReader: FileReader = new FileReader();

      fileReader.onload = async () => {
        const originalBase64 = fileReader.result as string;

        // 👉 if file size > 1MB, compress before assigning
        if (isConvert > 1) {
          this.msg.WarnNotify('File Size is more than 1MB, compressing...');
          this.productImg = await this.compressBase64(originalBase64, 400, 400, 0.5);
        } else {
          // assign compressed anyway (smaller size, faster upload)
          this.productImg = await this.compressBase64(originalBase64, 400, 400, 0.5);
        }

      };

      fileReader.readAsDataURL(file);

      // reset file input
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        input.value = '';
      }
    } else {
      this.msg.WarnNotify('File Must Be in jpg or png format');
      event.target.value = '';
      this.productImg = '';
    }
  }


  // ✅ helper compression function
  private compressBase64(base64: string, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Canvas not supported');
          return;
        }

        let width = img.width;
        let height = img.height;

        // Scale down
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // export as JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.onerror = (err) => reject(err);
    });
  }




  ////////////// Price Generator Function //////////////
  salePercent = '';
  generatePrice(e: any) {

    if (e.keyCode == 13 || e == 'generate') {
      this.SalePrice = parseFloat(this.CostPrice) + (parseFloat(this.CostPrice) * parseFloat(this.salePercent) / 100);
    }
  }



  //////////////////////// Add multiple Barcodes Model///////////

  openBarcodeModal(item: any) {
    this.dialogue.open(ProductBarcodesComponent, {
      width: '80%',
      data: item
    }).afterClosed().subscribe(
      val => {

      }
    )


  }





  linkWithApp(item: any, type: any) {

    var title = type == 'Pro' ? 'Do you want Link this product with app?' : 'Do you want to add product in Discount List?'

    Swal.fire({
      title: title,
      showCancelButton: true,
      confirmButtonText: "Confirm",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        var postData: any = {
          FlagType: type,
          FlagID: item.productID,
          FlagStatus: type == 'Pro' ? !item.linkWithApp : !item.addInDiscList,
        }

        this.http.post(environment.mainApi + this.global.inventoryLink + 'LinkWithMobApp', postData).subscribe(
          {
            next: (Response: any) => {
              if (Response.msg == 'Data Updated Successfully') {
                this.msg.SuccessNotify(Response.msg);
                if (type == 'Pro') {
                  item.linkWithApp = !item.linkWithApp;
                }
                if (type == 'ProDisc') {
                  item.addInDiscList = !item.addInDiscList;
                }

              } else {
                this.msg.WarnNotify(Response.msg);
              }
              this.scrollToRow(this.curFocusRow);
            },
            error: error => {
              this.scrollToRow(this.curFocusRow);
              console.log(error);
            }
          }

        )


      }
      if (result.isDenied || result.isDismissed) {
        setTimeout(() => {
          this.scrollToRow(this.curFocusRow);
        }, 200);
      }
    });



  }



  openImagesScreen() {
    this.route.navigate(["inv/product/addProductImages"]);
  }


}
