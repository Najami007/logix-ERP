import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import Swal from 'sweetalert2';
import { MapWHProductComponent } from './map-whproduct/map-whproduct.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
  tabIndex = 0;
  crudList: any = { c: true, r: true, u: true, d: true };




  page: number = 1;
  count: number = 0;

  tableSize: number = 0;
  tableSizes: any = [];
  jumpPage: any = 0;
  tmpPage: number = 0;

  onTableDataChange(event: any) {

    this.page = event;
    this.getAllRecipe();

  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getAllRecipe();

  }

  goToPage(): void {
    var count = this.productList.length / this.tableSize;
    if (parseFloat(this.jumpPage) > count) {
      this.msg.WarnNotify('Invalid Value')
      return;
    }

    if (this.jumpPage >= 1) {
      this.page = this.jumpPage;
      this.getAllRecipe();
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


  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    public global: GlobalDataModule,
    private dialog: MatDialog,
    private route: Router
  ) {

    this.global.getMenuList().subscribe((data) => {

      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })



  }



  ngOnInit(): void {
    this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;
    this.global.setHeaderTitle('Recipe');
    this.getAllRecipe();
    this.getCategories();
    this.getCookingArea()


    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; })
  }


  searchRecipe: any = ''
  filterCategoryID: any = 0;
  filterCookingAreaID: any = 0;
  filterStatus: any = 0;
  filterActiveStatus: any = 0;

  autoEmptyFlag = true;
  foodCost = 0;

  cookingAriaID = 0;
  btnType = 'Save';
  recipeID = 0;
  recipeTitle: any = '';
  recipeImg: any = '';
  salePrice: any = '';
  costPrice: any = '';
  recipeRefID = 0;
  Description: any = '';
  PBarcode: any;
  productImage: any;
  recipeType = 'Dine In';
  cookingTime = '';
  costTotal: number = 0;
  avgCostTotal: number = 0;
  projectID = this.global.InvProjectID;

  recipeCode: any = '';

  totalQty: any = 0;
  productList: any = [];

  menuProdList: any = [];

  RecipeList: any = [];
  tmpRecipeList: any = [];


  categoryID: number = 0;
  categoriesList: any = [];
  cookingAreaList: any = [];


  getCookingArea() {
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetCookingAria').subscribe(
      (Response: any) => {
        this.cookingAreaList = Response;
        if (Response.length > 0) {
          this.cookingAriaID = Response[0].cookingAriaID;
        }
      }
    )
  }


  getCategories() {
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetRecipeCategories').subscribe(
      (Response: any) => {
        this.categoriesList = Response.filter((e: any) => e.prodFlag == false);

      }
    )
  }


  filterRecipe(type: any) {

    if (type == 'cat') {
      this.RecipeList = this.filterCategoryID == 0 ? this.tmpRecipeList : this.tmpRecipeList.filter((e: any) => e.recipeCatID == this.filterCategoryID);
    }


    if (type == 'ca') {
      this.RecipeList = this.filterCookingAreaID == 0 ? this.tmpRecipeList : this.tmpRecipeList.filter((e: any) => e.cookingAriaID == this.filterCookingAreaID);
    }


    if (type == 'status') {
      this.RecipeList = this.filterStatus == 0 ? this.tmpRecipeList : this.tmpRecipeList.filter((e: any) => e.approvedStatus == this.filterStatus);
    }

    if (type == 'activeStatus') {
      this.RecipeList = this.filterActiveStatus == 0 ? this.tmpRecipeList : this.tmpRecipeList.filter((e: any) => e.activeStatus == this.filterActiveStatus);
    }
  }


  sortData(type: any) {
    if (type == 'title') {
      this.RecipeList = this.global.sortByKey(this.RecipeList, 'recipeTitle', 'asc');
    }
  }

  getAllRecipe() {
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetAllRecipes').subscribe(
      (Response: any) => {
        this.RecipeList = Response;
        this.tmpRecipeList = Response;
      }
    )
  }

  showImg(item: any) {

    var index = this.menuProdList.findIndex((e: any) => e.productID == item.productID);
    this.productImage = this.menuProdList[index].productImage;

  }


  changeValue(item: any) {
    var myIndex = this.menuProdList.indexOf(item);

    var myQty = this.menuProdList[myIndex].quantity;
    var myCP = this.menuProdList[myIndex].costPrice;
    var mySP = this.menuProdList[myIndex].salePrice;
    if (myCP == null || myCP == '' || myCP == undefined) {

      this.menuProdList[myIndex].costPrice = 0;
    } else if (myQty == null || myQty == '' || myQty == undefined) {
      this.menuProdList[myIndex].quantity = 0;
    } else if (mySP == null || mySP == '' || mySP == undefined) {
      this.menuProdList[myIndex].salePrice = 0;
    }
  }



  searchByCode(e: any) {

    if (this.PBarcode !== '') {
      if (e.keyCode == 13) {
        ///// check the product in product list by barcode
        var row = this.productList.find((p: any) => p.barcode == this.PBarcode);

        /////// check already present in the table or not
        if (row !== undefined) {
          var condition = this.menuProdList.find(
            (x: any) => x.productID == row.productID
          );

          var index = this.menuProdList.indexOf(condition);

          //// push the data using index
          if (condition == undefined) {





            this.global.getProdDetail(0, this.PBarcode).subscribe(
              (Response: any) => {

                if (this.recipeType == 'Dine In') {
                  this.menuProdList.push({
                    productID: Response[0].productID,
                    productTitle: Response[0].productTitle,
                    barcode: Response[0].barcode,
                    productImage: Response[0].productImage,
                    quantity: 1,
                    wohCP: Response[0].costPrice,
                    avgCostPrice: Response[0].avgCostPrice,
                    costPrice: Response[0].costPrice,
                    salePrice: Response[0].salePrice,
                    ovhPercent: 0,
                    ovhAmount: 0,
                    expiryDate: this.global.dateFormater(new Date(), '-'),
                    batchNo: '-',
                    batchStatus: '-',
                    uomID: Response[0].uomID,
                    packing: 1,
                    discInP: 0,
                    discInR: 0,
                    aq: Response[0].aq,
                    lockedStatus: true,
                  });
                } else {
                  this.menuProdList.push({
                    productID: Response[0].productID,
                    productTitle: Response[0].productTitle,
                    barcode: Response[0].barcode,
                    productImage: Response[0].productImage,
                    quantity: 1,
                    wohCP: Response[0].costPrice,
                    avgCostPrice: Response[0].avgCostPrice,
                    costPrice: Response[0].costPrice,
                    salePrice: Response[0].salePrice,
                    ovhPercent: 0,
                    ovhAmount: 0,
                    expiryDate: this.global.dateFormater(new Date(), '-'),
                    batchNo: '-',
                    batchStatus: '-',
                    uomID: Response[0].uomID,
                    packing: 1,
                    discInP: 0,
                    discInR: 0,
                    aq: Response[0].aq,
                    lockedStatus: false,
                  });
                }
                this.getTotal();


                this.productImage = Response[0].productImage;
              }
            )



            this.PBarcode = '';
            $('#searchProduct').trigger('focus');
          } else {
            this.menuProdList[index].quantity += 1;
            this.productImage = this.menuProdList[index].productImage;

            this.PBarcode = '';
            $('#searchProduct').trigger('focus');
          }
        } else {
          this.msg.WarnNotify('Product Not Found')
        }


        this.PBarcode = '';

      }
    }


  }

  holdDataFunction(data: any) {
    var condition = this.menuProdList.find(
      (x: any) => x.productID == data.productID
    );

    var index = this.menuProdList.indexOf(condition);

    if (condition == undefined) {

      this.global.getProdDetail(data.productID, '').subscribe(
        (Response: any) => {



          if (this.recipeType == 'Dine In') {
            this.menuProdList.push({
              productID: Response[0].productID,
              productTitle: Response[0].productTitle,
              barcode: Response[0].barcode,
              productImage: Response[0].productImage,
              quantity: 1,
              wohCP: Response[0].costPrice,
              costPrice: Response[0].costPrice,
              avgCostPrice: Response[0].avgCostPrice,
              salePrice: Response[0].salePrice,
              ovhPercent: 0,
              ovhAmount: 0,
              expiryDate: this.global.dateFormater(new Date(), '-'),
              batchNo: '-',
              batchStatus: '-',
              uomID: Response[0].uomID,
              packing: 1,
              discInP: 0,
              discInR: 0,
              aq: Response[0].aq,
              lockedStatus: true,

            })
          } else {
            this.menuProdList.push({
              productID: Response[0].productID,
              productTitle: Response[0].productTitle,
              barcode: Response[0].barcode,
              productImage: Response[0].productImage,
              quantity: 1,
              wohCP: Response[0].costPrice,
              costPrice: Response[0].costPrice,
              avgCostPrice: Response[0].avgCostPrice,
              salePrice: Response[0].salePrice,
              ovhPercent: 0,
              ovhAmount: 0,
              expiryDate: this.global.dateFormater(new Date(), '-'),
              batchNo: '-',
              batchStatus: '-',
              uomID: Response[0].uomID,
              packing: 1,
              discInP: 0,
              discInR: 0,
              aq: Response[0].aq,
              lockedStatus: false,

            })
          }
          this.getTotal();


          this.productImage = Response[0].productImage;
        }
      )




      this.PBarcode = '';
      $('#searchProduct').trigger('focus');
    } else {
      if (this.menuProdList[index].disable == false) {
        this.menuProdList[index].quantity += 1;
      } else {
        this.msg.WarnNotify('Can Not Edit this Product')
      }

      this.productImage = this.menuProdList[index].productImage;

      this.PBarcode = '';
      $('#searchProduct').trigger('focus');
    }

    this.getTotal();
    this.PBarcode = '';
    return false;
  }



  rowFocused = 0;
  handleNumKeys(item: any, e: any, cls: string, index: any) {

    if (e.keyCode == 9) {
      this.rowFocused = index + 1;
    }

    if (e.shiftKey && e.keyCode == 9) {

      this.rowFocused = index - 1;
    }


    if ((e.keyCode == 13 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 16 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 110 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 48 || e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51 || e.keyCode == 52 || e.keyCode == 53 || e.keyCode == 54 || e.keyCode == 55 || e.keyCode == 56 || e.keyCode == 57 || e.keyCode == 96 || e.keyCode == 97 || e.keyCode == 98 || e.keyCode == 99 || e.keyCode == 100 || e.keyCode == 101 || e.keyCode == 102 || e.keyCode == 103 || e.keyCode == 104 || e.keyCode == 105)) {
      // 13 Enter ///////// 8 Back/remve ////////9 tab ////////////16 shift ///////////46 del  /////////37 left //////////////110 dot
    }
    else {
      e.preventDefault();
    }

    /////move down
    if (e.keyCode == 40) {

      if (this.menuProdList.length > 1) {
        this.rowFocused += 1;
        if (this.rowFocused >= this.menuProdList.length) {
          this.rowFocused -= 1
        } else {
          var clsName = cls + this.rowFocused;
          e.preventDefault();
          $(clsName).trigger('select');
          $(clsName).trigger('focus');

        }
      }
    }


    //Move up
    if (e.keyCode == 38) {

      if (this.rowFocused == 0) {
        e.preventDefault();
        $(".searchProduct").trigger('select');
        $(".searchProduct").trigger('focus');

        this.rowFocused = 0;

      }

      if (this.menuProdList.length > 1) {

        this.rowFocused -= 1;

        var clsName = cls + this.rowFocused;
        e.preventDefault();
        $(clsName).trigger('select');
        $(clsName).trigger('focus');


      }

    }

    ////removeing row
    if (e.keyCode == 46) {

      this.delRow(item);
      this.rowFocused = 0;
    }

  }

  focusToQty(e: any) {
    if (e.keyCode == 40) {

      if (this.menuProdList.length >= 1) {
        $('.qty0').trigger('focus');

      }
    }
  }


  handleProdFocus(item: any, e: any, cls: any, endFocus: any, prodList: []) {


    /////// increment in prodfocus on tab click
    if (e.keyCode == 9 && !e.shiftKey) {
      this.prodFocusedRow += 1;

    }
    /////// decrement in prodfocus on shift tab click
    if (e.shiftKey && e.keyCode == 9) {
      this.prodFocusedRow -= 1;

    }
    /////move down
    if (e.keyCode == 40) {


      if (prodList.length > 1) {
        this.prodFocusedRow += 1;
        if (this.prodFocusedRow >= prodList.length) {
          this.prodFocusedRow -= 1
        } else {
          var clsName = cls + this.prodFocusedRow;
          //  alert(clsName);
          $(clsName).trigger('focus');
          // e.which = 9;   
          // $(clsName).trigger(e)       
        }
      }
    }


    //Move up
    if (e.keyCode == 38) {

      if (this.prodFocusedRow == 0) {
        $(endFocus).trigger('focus');
        this.prodFocusedRow = 0;

      }

      if (prodList.length > 1) {

        this.prodFocusedRow -= 1;

        var clsName = cls + this.prodFocusedRow;
        //  alert(clsName);
        $(clsName).trigger('focus');


      }

    }

  }

  prodFocusedRow = 0;
  changeFocus(e: any, cls: any) {

    if (e.target.value == '') {
      if (e.keyCode == 40) {

        if (this.menuProdList.length >= 1) {
          this.rowFocused = 0;
          e.preventDefault();
          $('.qty0').trigger('select');
          $('.qty0').trigger('focus');

        }
      }
    } else {
      this.prodFocusedRow = 0;
      /////move down
      if (e.keyCode == 40) {
        if (this.productList.length >= 1) {
          $('.prodRow0').trigger('focus');
          // e.which = 9;   
          // $('.prodRow0').trigger(e)  ;
        }
      }
    }
  }



  onProdSelect(row: any) {

    if (this.menuProdList.find((e: any) => e.productID == row.productID)) {
      this.msg.WarnNotify('Item Already Exist')
    } else {

      this.menuProdList.push({
        productID: row.productID,
        productTitle: row.productTitle,
        quantity: 1,
        costPrice: row.costPrice,

      })
    }

    this.getTotal();


  }


  getTotal() {
    this.costPrice = 0;
    this.totalQty = 0;
    this.avgCostTotal = 0;
    this.costTotal = 0;

    this.menuProdList.forEach((e: any) => {
      this.costPrice += e.avgCostPrice * e.quantity;
      this.totalQty += parseFloat(e.quantity);
      this.avgCostTotal += e.avgCostPrice * e.quantity;
      this.costTotal += e.costPrice * e.quantity;
    });

    this.foodCost = (this.costPrice / this.salePrice) * 100;
  }



  delRow(row: any) {
    var index = this.menuProdList.indexOf(row);
    this.menuProdList.splice(index, 1);
    this.getTotal();
  }




  onImgSelected(event: any) {


    var imgSize = event.target.files[0].size;
    var isConvert: number = parseFloat((imgSize / 1048576).toFixed(2));

    if (isConvert > 1) {

      this.msg.WarnNotify('File Size is more than 1MB');
    }
    else {

      ////////////// will check the file type ////////////////
      if (this.global.getExtension(event.target.value) != 'pdf') {
        let targetEvent = event.target;

        /////////// assign the targeted file to file variable
        let file: File = targetEvent.files[0];

        let fileReader: FileReader = new FileReader();

        //////////////// if the file is other than pdf eill assign to product img varialb
        fileReader.onload = (e) => {
          this.recipeImg = fileReader.result;
        }

        fileReader.readAsDataURL(file);


        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          input.value = ''; // Reset input value
        }

      } else {

        this.msg.WarnNotify('File Must Be in jpg or png formate');
        event.target.value = '';
        this.recipeImg = '';
      }

    }


  }



  isProcessing = false;

  save() {

    var inValidQty = this.menuProdList.filter((e:any)=> e.quantity == 0 || e.quantity == '0' || e.quantity == '' || e.quantity == undefined || e.quantity == null);

       if(inValidQty.length > 0){
      this.msg.WarnNotify(`${inValidQty[0].productTitle} Quantity is not Valid`)
      return;
    }
   



    if (this.recipeTitle == '' || this.recipeTitle == undefined) {
      this.msg.WarnNotify('Enter Recipe Title')
      return;
    }
    //  else if (this.costPrice == 0 || this.costPrice == '' || this.costPrice == undefined) {
    //   this.msg.WarnNotify('Select Ingredients')
    // } 
    if (this.menuProdList == '') {
      this.msg.WarnNotify('Select Ingredients');
      return;
    }
    if (this.salePrice == 0 || this.salePrice == '' || this.salePrice == undefined) {
      this.msg.WarnNotify('Enter Receipe Sale Price')
       return;

    } 
     if (this.recipeType == 'Dine In' && (this.recipeImg == '' || this.recipeImg == undefined)) {
      this.msg.WarnNotify('Select Recipe Image');
      return;
    } 
     if (this.categoryID == 0 || this.categoryID == undefined) {
      this.msg.WarnNotify('Select Category');
      return;
    } 
     if (this.costPrice > this.salePrice) {
      this.msg.WarnNotify('Receipe Cost is not Valid');
      return;
    } 
     if (this.recipeType == '' || this.recipeType == undefined) {
      this.msg.WarnNotify('Select Recipe Type');
      return;
    }

    if(this.cookingAriaID == 0 || this.cookingAriaID == undefined){
       this.msg.WarnNotify('Select Cooking Area');
      return;
    }


      var postData = {
        RecipeID: this.recipeID,
        RecipeTitle: this.recipeTitle,
        recipeCode: this.recipeCode || this.recipeTitle,
        RecipeDescription: this.Description || '-',
        RecipeCostPrice: this.costPrice,
        RecipeSalePrice: this.salePrice,
        RecipeType: this.recipeType,
        RecipeRefID: this.recipeRefID,
        CookingTime: this.cookingTime || 10,
        CookingAriaID: this.cookingAriaID,
        RecipeCatID: this.categoryID,
        ProjectID: this.projectID,
        RecipeImage: this.recipeImg,
        RecipeDetail: JSON.stringify(this.menuProdList),
        UserID: this.global.getUserID(),
      }


      if (this.isProcessing) return;

      this.isProcessing = true;

      if (this.btnType == 'Save') {
        this.app.startLoaderDark();
        this.http.post(environment.mainApi + this.global.restaurentLink + 'InsertRecipe', postData).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Saved Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getAllRecipe();
              this.reset();
            } else {
              this.msg.WarnNotify(Response.msg);
            }
            this.app.stopLoaderDark();
            this.isProcessing = false;

          },
          (Error: any) => {
            console.log(Error);
            this.isProcessing = false;
          }
        )
      } 
      
      if (this.btnType == 'Update') {

        this.global.openPinCode().subscribe(pin => {
          if (pin != '') {
            this.app.startLoaderDark();
            postData['PinCode'] = pin;
            this.http.post(environment.mainApi + this.global.restaurentLink + 'UpdateRecipe', postData).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Updated Successfully') {
                  this.msg.SuccessNotify(Response.msg);
                  this.getAllRecipe();
                  this.reset();
                } else {
                  this.msg.WarnNotify(Response.msg);
                }
                this.app.stopLoaderDark();
                this.isProcessing = false;

              }
            ),
              (Error: any) => {
                console.log(Error);
                this.isProcessing = false;
              }
          }else{
            this.isProcessing = false;
          }
        })
      }

    

  }


  getRecipeImage(recipeID: any, type: any) {
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetRecipeImage?RecipeID=' + recipeID).subscribe(
      (Response: any) => {

        if (type == 'hide') {
          this.recipeImg = Response[0].recipeImage;
        }
        if (type == 'show') {

          this.global.showProductImage(Response[0].recipeImage, 0);

        }
      }
    )
  }

  edit(item: any) {

    this.btnType = 'Update';
    this.tabIndex = 0;
    this.recipeType = item.recipeType;
    this.categoryID = item.recipeCatID;
    this.recipeID = item.recipeID;
    this.recipeTitle = item.recipeTitle;
    this.costPrice = item.recipeCostPrice;
    this.salePrice = item.recipeSalePrice;
    this.getRecipeImage(item.recipeID, 'hide');
    // this.recipeImg = this.getRecipeImage(item.recipeID);
    this.recipeRefID = item.recipeRefID;
    this.Description = item.recipeDescription;
    this.cookingTime = item.cookingTime;
    this.cookingAriaID = item.cookingAriaID;
    this.recipeCode = item.recipeCode;


    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetSingleRecipeDetail?recipeid=' + item.recipeID).subscribe(
      (Response: any) => {
        this.menuProdList = [];
        Response.forEach((e: any) => {
          this.menuProdList.push({
            productID: e.productID,
            productTitle: e.productTitle,
            barcode: e.barcode,
            productImage: e.productImage,
            quantity: e.quantity,
            avgCostPrice: e.avgCostPrice,
            costPrice: e.costPrice,
            salePrice: e.salePrice,
            expiryDate: this.global.dateFormater(new Date(), '-'),
            batchNo: '-',
            batchStatus: '-',
            uomID: e.uomID,
            packing: 1,
            discInP: 0,
            discInR: 0,
            lockedStatus: e.lockedStatus,
          })
        });

        this.getTotal();


      }
    )

    setTimeout(() => {
      $('#RecipeTitle').trigger('select');
    }, 200);

  }


  copyRecipe(item: any) {
    this.menuProdList = [];
    var recID = 0;
    if (item.recipeRefID > 0) {
      this.btnType = 'Update';
      recID = item.recipeRefID;
      this.recipeID = item.recipeRefID;

    } else if (item.recipeRefID == 0) {
      recID = item.recipeID
    }
    this.recipeType = 'Others';
    this.categoryID = item.recipeCatID;
    this.recipeTitle = item.recipeTitle;
    this.costPrice = item.recipeCostPrice;
    this.salePrice = item.recipeSalePrice;
    this.recipeImg = item.recipeImage;
    this.Description = item.recipeDescription;
    this.cookingTime = item.cookingTime;
    this.cookingAriaID = item.cookingAriaID;

    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetSingleRecipeDetail?recipeid=' + recID).subscribe(
      (Response: any) => {

        this.menuProdList = [];
        var tempProdList: any = [];
        Response.forEach((e: any) => {



          this.menuProdList.push({
            productID: e.productID,
            productTitle: e.productTitle,
            barcode: e.barcode,
            productImage: e.productImage,
            quantity: e.quantity,
            avgCostPrice: e.avgCostPrice,
            costPrice: e.costPrice,
            salePrice: e.salePrice,
            expiryDate: this.global.dateFormater(new Date(), '-'),
            batchNo: '-',
            batchStatus: '-',
            uomID: e.uomID,
            packing: 1,
            discInP: 0,
            discInR: 0,
            lockedStatus: e.lockedStatus,

          })



        });



        this.getTotal()







      }
    )





  }



  getIngredient(item: any) {

    if (this.menuProdList == '') {
      this.http.get(environment.mainApi + this.global.restaurentLink + 'GetSingleRecipeDetail?recipeid=' + item.recipeID).subscribe(
        (Response: any) => {

          this.menuProdList = [];
          var tempProdList: any = [];
          Response.forEach((e: any) => {

            this.menuProdList.push({
              productID: e.productID,
              productTitle: e.productTitle,
              barcode: e.barcode,
              productImage: e.productImage,
              quantity: e.quantity,
              avgCostPrice: e.avgCostPrice,
              costPrice: e.costPrice,
              salePrice: e.salePrice,
              expiryDate: this.global.dateFormater(new Date(), '-'),
              batchNo: '-',
              batchStatus: '-',
              uomID: e.uomID,
              packing: 1,
              discInP: 0,
              discInR: 0,
              lockedStatus: false,

            })
          });



          this.getTotal()
          this.tabIndex = 0;







        }
      )
    }

    if (this.menuProdList != '') {
      this.http.get(environment.mainApi + this.global.restaurentLink + 'GetSingleRecipeDetail?recipeid=' + item.recipeID).subscribe(
        (Response: any) => {
          Response.forEach((e: any) => {
            var value = this.menuProdList.find((f: any) => f.productID == e.productID);
            var index = this.menuProdList.indexOf(value);
            //  alert(index);
            if (value !== undefined) {
              this.menuProdList[index].quantity = parseFloat(this.menuProdList[index].quantity) + e.quantity;

            }
            if (value == undefined) {
              this.menuProdList.push({
                productID: e.productID,
                productTitle: e.productTitle,
                barcode: e.barcode,
                productImage: e.productImage,
                quantity: e.quantity,
                avgCostPrice: e.avgCostPrice,
                costPrice: e.costPrice,
                salePrice: e.salePrice,
                expiryDate: this.global.dateFormater(new Date(), '-'),
                batchNo: '-',
                batchStatus: '-',
                uomID: e.uomID,
                packing: 1,
                discInP: 0,
                discInR: 0,
                lockedStatus: e.lockedStatus,

              })
            }
          });


          this.getTotal()
          this.tabIndex = 0;
        }
      )

    }





  }


  approveRecipe(item: any) {

    this.global.openPinCode().subscribe(pin => { //////////// Opening Pin Code Global Modal
      if (pin != '') {
        this.app.startLoaderDark();
        this.http.post(environment.mainApi + this.global.restaurentLink + 'ApproveRecipe', {
          RecipeID: item.recipeID,
          ApprovedStatus: !item.approvedStatus,
          PinCode: pin,
          UserID: this.global.getUserID(),
        }).subscribe(
          (Response: any) => {
            if (Response.msg == "Approved Successfully") {
              this.msg.SuccessNotify(Response.msg);
              this.getAllRecipe();
            } else {
              this.msg.WarnNotify(Response.msg);

            }
            this.app.stopLoaderDark();
          }
        )
      }
    })

  }


  activeRecipe(item: any) {

    this.global.openPinCode().subscribe(pin => {
      if (pin != '') {
        this.app.startLoaderDark();
        this.http.post(environment.mainApi + this.global.restaurentLink + 'ActiveRecipe', {
          RecipeID: item.recipeID,
          ActiveStatus: !item.activeStatus,
          PinCode: pin,
          UserID: this.global.getUserID(),
        }).subscribe(
          (Response: any) => {
            if (Response.msg == "Data Updated Successfully") {
              this.msg.SuccessNotify(Response.msg);
              this.getAllRecipe();
            } else {
              this.msg.WarnNotify(Response.msg);

            }
            this.app.stopLoaderDark();
          }
        )
      }
    })

  }


  delete(row: any) {
    this.global.openPinCode().subscribe(pin => {

      if (pin != '') {


        Swal.fire({
          title: 'Alert!',
          text: 'Confirm to Delete the Data',
          position: 'center',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
        }).then((result) => {

          if (result.isConfirmed) {
            this.app.startLoaderDark();

            this.http.post(environment.mainApi + this.global.restaurentLink + 'deleteRecipe', {
              RecipeID: row.recipeID,
              RecipeRefID: row.recipeRefID,
              PinCode: pin,
              UserID: this.global.getUserID()

            }).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Deleted Successfully') {
                  this.msg.SuccessNotify(Response.msg);
                  this.getAllRecipe();
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
        }
        )


      }
    })
  }



  reset() {
    this.recipeID = 0;
    this.recipeType = 'Dine In';
    this.btnType = 'Save';
    this.productImage = '';
    this.recipeImg = '';
    this.recipeRefID = 0;
    if (this.autoEmptyFlag) {
      // this.cookingAriaID = 0;
      this.categoryID = 0;
      this.recipeTitle = '';
      this.costPrice = '';
      this.salePrice = '';
      this.Description = '';
      this.menuProdList = [];
      this.totalQty = 0;
      this.costTotal = 0;
      this.avgCostTotal = 0;
      this.cookingTime = '';
      this.foodCost = 0;
    }



  }





  /////// to change the tab on edit
  curFocusRow: any = -1;

  changeTab(tabNum: any) {
    this.tabIndex = tabNum;
    setTimeout(() => {
      this.scrollToRow(this.curFocusRow)
    }, 50);
  }

  scrollToRow(index: number) {
    const row = document.getElementById('rcp-' + index);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }




  MapProdWithCategory() {
    this.dialog.open(MapWHProductComponent, {
      width: '40%',
    }).afterClosed().subscribe(value => {
      if (value == 'Update') {
        this.getAllRecipe();
      }
    })
  }



  getRecipeDetail(item: any) {
    this.dialog.open(RecipeDetailComponent, {
      width: '80%',
      data: [item, { type: 'Dine In' }]
    }).afterClosed().subscribe()
  }

}
