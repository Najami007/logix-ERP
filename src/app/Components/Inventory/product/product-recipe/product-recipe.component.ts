import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { retry } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-product-recipe',
  templateUrl: './product-recipe.component.html',
  styleUrls: ['./product-recipe.component.scss']
})
export class ProductRecipeComponent {



  @Output() resetEmitter = new EventEmitter();
  @Output() reloadProductEmitter = new EventEmitter();


  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
    private dialogue: MatDialog,
    private app: AppComponent,
    private route: Router
  ) {
    this.getProductList();


  }



  RawProductList: any = [];



  /////////////////// getting Product List global Function //////////
  getProductList() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetProduct').subscribe(
      (Response: any) => {


        this.RawProductList = Response.length > 0 ? Response.filter((e: any) => e.productNature == 'Raw') : [];

      }
    )
  }

  PBarcode: any = '';
  sortType: any = 'Desc';

  searchByCode(e: any) {

    var barcode = this.PBarcode;
    var qty: number = 0;
    var BType = '';

    if (this.PBarcode !== '') {
      if (e.keyCode == 13) {


        // this.app.startLoaderDark();
        this.global.getProdDetail(0, barcode).subscribe(
          (Response: any) => {
            if (Response == '' || Response == null || Response == undefined) {
              return;
            } else {



              if (BType == 'price') { qty = qty / parseFloat(Response[0].salePrice); }
              this.pushProdData(Response[0], qty);
            }
          }
        )
      }
    }
  }

  holdDataFunction(data: any) {
    this.global.getProdDetail(data.productID, '').subscribe(
      (Response: any) => {
        this.pushProdData(Response[0], 1)
      }
    )

    this.app.stopLoaderDark();
    setTimeout(() => {
      $('#searchProduct').trigger('focus');
    }, 500);

  }

  pushProdData(data: any, qty: any) {

    if (data.productNature == 'Finished') {
      this.msg.WarnNotify('Product not Found');
      this.PBarcode = '';
      $('.searchProduct').trigger('focus')
      return;
    }
    /////// check already present in the table or not
    const targetBarcode = data.barcode2 || data.barcode;
    var condition = this.recipeProductList.find(
      (x: any) => x.productID == data.productID && x.barcode == targetBarcode

    );

    var index = this.recipeProductList.indexOf(condition);
    //// push the data using index
    if (condition == undefined) {


      this.recipeProductList.push({
        rowIndex: this.recipeProductList.length == 0 ? this.recipeProductList.length + 1
          : this.sortType == 'desc' ? this.recipeProductList[0].rowIndex + 1
            : this.recipeProductList[this.recipeProductList.length - 1].rowIndex + 1,
        productID: data.productID,
        productTitle: data.productTitle,
        barcode: data.barcode,
        quantity: Number(qty) > 0 ? Number(qty) : 1,
        avgCostPrice: data.avgCostPrice,
        costPrice: data.costPrice,
        salePrice: data.salePrice,
        expiryDate: this.global.dateFormater(new Date(), '-'),
        uomID: data.uomID,
        packing: data.packing,
        uomTitle: data.uomTitle,

      });

      this.getTotal();




    } else {
      var newQty: any = Number(qty) > 0 ? Number(qty) : data.quantity;
      this.recipeProductList[index].quantity = Number(this.recipeProductList[index].quantity) + newQty;

      /////// Sorting Table
      this.getTotal();
    }

    this.PBarcode = '';
    $('.searchProduct').trigger('focus')

  }

  recipeBtnType = 'Save';
  productRecipeID = 0;
  recipeCostPrice = 0;
  recipeTotalQty = 0;
  recipeAvgCostTotal = 0;
  recipeCostTotal = 0;
  recipeSalePrice = 0;
  recipeProductList: any = [];
  foodCost: any = 0;
  getTotal() {
    this.recipeCostPrice = 0;
    this.recipeTotalQty = 0;
    this.recipeAvgCostTotal = 0;
    this.recipeCostTotal = 0;

    this.recipeProductList.forEach((e: any) => {
      this.recipeCostPrice += e.avgCostPrice * Number(e.quantity);
      this.recipeTotalQty += Number(e.quantity);
      this.recipeAvgCostTotal += e.avgCostPrice * Number(e.quantity);
      this.recipeCostTotal += e.costPrice * Number(e.quantity);
    });

    this.foodCost = (this.recipeCostPrice / this.recipeSalePrice) * 100;
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

      if (this.recipeProductList.length > 1) {
        this.rowFocused += 1;
        if (this.rowFocused >= this.recipeProductList.length) {
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

      if (this.recipeProductList.length > 1) {

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


  delRow(row: any) {
    var index = this.recipeProductList.indexOf(row);
    this.recipeProductList.splice(index, 1);
    this.getTotal();
  }

  focusToQty(e: any) {
    if (e.keyCode == 40) {

      if (this.recipeProductList.length >= 1) {
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

        if (this.recipeProductList.length >= 1) {
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
        if (this.recipeProductList.length >= 1) {
          $('.prodRow0').trigger('focus');
          // e.which = 9;   
          // $('.prodRow0').trigger(e)  ;
        }
      }
    }
  }


  openProductRecipeModal(item: any) {
    this.global.openBootstrapModal('#productRecipeModal', true);
    this.productRecipeID = item.productID;
    this.getProductRecipe(item.productID).subscribe(
      {
        next: (Response: any) => {
          this.recipeProductList = [];
          if (Response.length == 0) {
            return;
          }
          this.recipeBtnType = 'Update';
          Response.forEach((e: any) => {
            this.pushProdData(e, e.quantity);
          });

        },
        error: (error: any) => {
          console.log(error);
        }
      }
    );


  }

  getProductRecipe(ProductRecipeID: any) {
    return this.http.get(`${environment.mainApi + this.global.inventoryLink}GetProductRecipeDetail?reqProductRecipeID=${ProductRecipeID}`).pipe(retry(3));
  }

  saveProductRecipe() {

    if (this.recipeProductList.length == 0) {
      this.msg.WarnNotify('Enter Recipe Ingredient');
      return;
    }

    var postData: any = {
      ProductRecipeID: this.productRecipeID,
      ProductRecipeDetail: JSON.stringify(this.recipeProductList),
      UserID: this.global.getUserID()
    }

    var url = `${environment.mainApi + this.global.inventoryLink}InsertProductRecipe`
    if (this.recipeBtnType == 'Update') {
      url = `${environment.mainApi + this.global.inventoryLink}UpdateProductRecipe`
    }

    this.app.startLoaderDark();
    this.http.post(url, postData).subscribe(
      {
        next: (Response: any) => {

          if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.global.closeBootstrapModal('#productRecipeModal', true);
            this.reloadProductEmitter.emit();
            this.resetEmitter.emit();
            this.resetRecipeList();


          } else {
            this.msg.WarnNotify(Response.msg)
          }

          this.app.stopLoaderDark();
        },
        error: (error: any) => {
          console.log(error);
          this.app.stopLoaderDark();
        }
      }
    )

  }

  DeleteProductRecipe() {

    this.global.openPinCode().subscribe(pin => {
      if (pin !== '') {

        var postData: any = {
          ProductRecipeID: this.productRecipeID,
          UserID: this.global.getUserID()
        }

        var url = `${environment.mainApi + this.global.inventoryLink}DeleteProductRecipe`
        this.app.startLoaderDark();
        this.http.post(url, postData).subscribe(
          {
            next: (Response: any) => {

              if (Response.msg == 'Data Deleted Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.global.closeBootstrapModal('#productRecipeModal', true)
                this.resetEmitter.emit();
                this.resetRecipeList();

              } else {
                this.msg.WarnNotify(Response.msg)
              }

              this.app.stopLoaderDark();
            },
            error: (error: any) => {
              console.log(error);
              this.app.stopLoaderDark();
            }
          }
        )

      }
    })



  }



  resetRecipeList() {

    this.recipeProductList = [];
    this.recipeTotalQty = 0;
    this.recipeAvgCostTotal = 0;
    this.recipeSalePrice = 0;
    this.recipeCostPrice = 0;
    this.recipeCostTotal = 0;
    this.recipeBtnType = 'Save';
  }

}
