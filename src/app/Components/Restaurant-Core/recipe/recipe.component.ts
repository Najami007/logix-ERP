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

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit{
    tabIndex = 0;
  crudList:any = [];
  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private global:GlobalDataModule,
    private dialog:MatDialog,
    private route:Router
  ){

    this.global.getMenuList().subscribe((data) => {

      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })
  }



  ngOnInit(): void {
   this.global.setHeaderTitle('Recipe');
   this.getProductList();
   this.getAllRecipe();
   this.getCategories();
  }


  btnType = 'Save';
  recipeID = 0;
  recipeTitle:any;
  recipeImg:any;
  salePrice:any;
  costPrice:any;
  Description:any;
  PBarcode:any;
  productImage:any;

  costTotal:number = 0;
  avgCostTotal:number = 0;

  totalQty:any = 0;
  productList:any = [];

  menuProdList:any = [];

  RecipeList:any = [];


  categoryID:number = 0;
  categoriesList:any = [];



  getCategories(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetRecipeCategories').subscribe(
      (Response:any)=>{
        this.categoriesList = Response;
      }
    )
  }

  getAllRecipe(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetAllRecipes').subscribe(
      (Response:any)=>{
        this.RecipeList = Response;
      }
    )
  }

  showImg(item:any){
    
    var index = this.menuProdList.findIndex((e:any)=> e.productID == item.productID);
    this.productImage = this.menuProdList[index].productImage;
  
  }


  changeValue(item:any){
    var myIndex = this.menuProdList.indexOf(item);
   // console.log(this.tableDataList[myIndex]);
    var myQty = this.menuProdList[myIndex].quantity;
    var myCP = this.menuProdList[myIndex].costPrice;
    var mySP = this.menuProdList[myIndex].salePrice;
    if(myCP == null || myCP == '' || myCP == undefined){
     
      this.menuProdList[myIndex].costPrice = 0;
    }else if(myQty == null || myQty == '' || myQty == undefined){
      this.menuProdList[myIndex].quantity = 0;
    }else if(mySP == null || mySP == '' || mySP == undefined){
      this.menuProdList[myIndex].salePrice = 0;
    }
   }


  
  searchByCode(e:any){

    if(this.PBarcode !== ''){
      if(e.keyCode == 13){
        ///// check the product in product list by barcode
        var row =  this.productList.find((p:any)=> p.barcode == this.PBarcode);
   
        /////// check already present in the table or not
        if(row !== undefined){
          var condition = this.menuProdList.find(
            (x: any) => x.productID == row.productID
          );
      
          var index = this.menuProdList.indexOf(condition);
      
          //// push the data using index
          if (condition == undefined) {
      
          //console.log(data);
          this.menuProdList.push({
            productID:row.productID,
            productTitle:row.productTitle,
            barcode:row.barcode,
            productImage:row.productImage,
            quantity:1,
            avgCostPrice:row.avgCostPrice,
            costPrice:row.costPrice,
            salePrice:row.salePrice,
            expiryDate:this.global.dateFormater(new Date(),'-'),
            batchNo:'-',
            batchStatus:'-',
            uomID:row.uomID,
            packing:1,
            discInP:0,
            discInR:0,
      
          })
      
          this.productImage = row.productImage;
        
          this.PBarcode = '';
          $('#searchProduct').trigger('focus');
        }else {
          this.menuProdList[index].quantity += 1;
          this.productImage = this.menuProdList[index].productImage;
       
          this.PBarcode = '';
          $('#searchProduct').trigger('focus');
        }
        }else{
          this.msg.WarnNotify('Product Not Found')
        }
     
       
       this.PBarcode = '';
   
       }
    }

   
  }

  holdDataFunction(data:any){
  var condition = this.menuProdList.find(
      (x: any) => x.productID == data.productID
    );

    var index = this.menuProdList.indexOf(condition);

    if (condition == undefined) {

    //console.log(data);
    this.menuProdList.push({
      productID:data.productID,
      productTitle:data.productTitle,
      barcode:data.barcode,
      productImage:data.productImage,
      quantity:1,
      avgCostPrice:data.avgCostPrice,
      costPrice:data.costPrice,
      salePrice:data.salePrice,
      expiryDate:this.global.dateFormater(new Date(),'-'),
      batchNo:'-',
      batchStatus:'-',
      uomID:data.uomID,
      packing:1,
      discInP:0,
      discInR:0,
     

    })

    // console.log(this.tableDataList);

    this.productImage = data.productImage;
    
    this.PBarcode = '';
    $('#searchProduct').trigger('focus');
  }else {
    this.menuProdList[index].quantity += 1;
    this.productImage = this.menuProdList[index].productImage;
    
    this.PBarcode = '';
    $('#searchProduct').trigger('focus');
  }

  this.getTotal();
    this.PBarcode = '';
    return false;
  }



  rowFocused = 0;
  handleNumKeys(item:any ,e:any,cls:string){

   

    // if (e.target.value < '0') {
    //   e.target.value = 0;
    // }else if(e.target.value == ''){
    //   e.target.value = 0
    // }



    if ((e.keyCode == 13 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 16 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 110 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 48 || e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51 || e.keyCode == 52 || e.keyCode == 53 || e.keyCode == 54 || e.keyCode == 55 || e.keyCode == 56 || e.keyCode == 57 || e.keyCode == 96 || e.keyCode == 97 || e.keyCode == 98 || e.keyCode == 99 || e.keyCode == 100 || e.keyCode == 101 || e.keyCode == 102 || e.keyCode == 103 || e.keyCode == 104 || e.keyCode == 105)) {
      // 13 Enter ///////// 8 Back/remve ////////9 tab ////////////16 shift ///////////46 del  /////////37 left //////////////110 dot
  }
  else {
      e.preventDefault();
  }

  /////move down
    if(e.keyCode == 40){
     
     if(this.menuProdList.length > 1 ){
      this.rowFocused += 1;
      if (this.rowFocused >= this.menuProdList.length) {      
        this.rowFocused -= 1  
    } else {
        var clsName = cls + this.rowFocused;    
        $(clsName).trigger('focus');    
    }}
  }


     //Move up
     if (e.keyCode == 38) {

      if (this.rowFocused == 0) {
          $(".searchProduct").trigger('focus');
          this.rowFocused = 0;
 
      }

      if (this.menuProdList.length > 1) {

          this.rowFocused -= 1;

          var clsName = cls + this.rowFocused;
          $(clsName).trigger('focus');
          

      }

  }

    ////removeing row
    if (e.keyCode == 46) {

      this.delRow(item);
      this.rowFocused = 0;
  }

  }

  focusToQty(e:any){
    if(e.keyCode == 40){
      
      if(this.menuProdList.length >= 1 ){  
         $('.qty0').trigger('focus');

      }
     }
   }



  getProductList(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'GetActiveProduct').subscribe(
      (Response)=>{
        this.productList = Response;
        //console.log(Response);
      }
    )
  }

  onProdSelect(row:any){

    if(this.menuProdList.find((e:any)=> e.productID == row.productID)){
    this.msg.WarnNotify('Item Already Exist')    
    }else{

      this.menuProdList.push({
        productID : row.productID,
        productTitle:row.productTitle,
        quantity :1,
        costPrice:row.costPrice,
      
      })
    }

    this.getTotal();


  }


  getTotal(){
    this.costPrice = 0;
    this.totalQty = 0;
    this.avgCostTotal = 0;
    this.costTotal = 0;

    this.menuProdList.forEach((e:any) => {
      this.costPrice += e.costPrice * e.quantity;
      this.totalQty += parseFloat(e.quantity);
      this.avgCostTotal +=  e.avgCostPrice * e.quantity;
      this.costTotal +=  e.costPrice * e.quantity;
    });
    
  }



  delRow(row:any){
    var index = this.menuProdList.indexOf(row);
    this.menuProdList.splice(index,1);
    this.getTotal();
  }




  onImgSelected(event:any) {

  
    var imgSize = event.target.files[0].size ;
    var isConvert:number = parseFloat((imgSize / 1048576).toFixed(2));

    if(isConvert > 1){
      
       this.msg.WarnNotify('File Size is more than 1MB');
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
          this.recipeImg = fileReader.result;          
        }
    
        fileReader.readAsDataURL(file);
    
      }else{
    
          this.msg.WarnNotify('File Must Be in jpg or png formate');
          event.target.value = '';
          this.recipeImg = '';
        }

    }
 
    
  }



  save(){

    if(this.recipeTitle == '' || this.recipeTitle == undefined){
      this.msg.WarnNotify('Enter Recipe Title')
    }else if(this.costPrice == 0 || this.costPrice == '' || this.costPrice == undefined){
      this.msg.WarnNotify('Select Ingredients')
    }else if(this.salePrice == 0 || this.salePrice == '' || this.salePrice == undefined){
      this.msg.WarnNotify('Enter Receipe Sale Price')
    }else if(this.recipeImg == '' || this.recipeImg == undefined){
      this.msg.WarnNotify('Select Recipe Image')
    }else if(this.categoryID == 0 || this.categoryID == undefined){
      this.msg.WarnNotify('Select Category');
    }
    else {

      if(this.Description == '' || this.Description == undefined){
        this.Description = '-';
      }
      console.log(this.menuProdList);

      if(this.btnType == 'Save'){
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+this.global.inventoryLink+'InsertRecipe',{
          RecipeTitle: this.recipeTitle,
          RecipeDescription: this.Description,
          RecipeCostPrice: this.costPrice,
          RecipeSalePrice: this.salePrice,
          RecipeCatID:this.categoryID,
          ProjectID: 1,
          RecipeImage: this.recipeImg,
      
          RecipeDetail: JSON.stringify(this.menuProdList) ,
      
          UserID: this.global.getUserID(),
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Saved Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getAllRecipe();
              this.reset();
              this.app.stopLoaderDark();
            }else{
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
          }
        )
      }else if(this.btnType == 'Update'){

        this.dialog.open(PincodeComponent,{
          width:"30%"
        }).afterClosed().subscribe(pin=>{
          if(pin != ''){
            this.app.startLoaderDark();
            this.http.post(environment.mainApi+this.global.inventoryLink+'UpdateRecipe',{
              RecipeID: this.recipeID,
              RecipeTitle: this.recipeTitle,
              RecipeDescription: this.Description,
              RecipeCostPrice: this.costPrice,
              RecipeSalePrice: this.salePrice,
              RecipeCatID:this.categoryID,
              ProjectID: 1,
              RecipeImage: this.recipeImg,
              PinCode:pin,
          
              RecipeDetail: JSON.stringify(this.menuProdList) ,
          
              UserID: this.global.getUserID(),
            }).subscribe(
              (Response:any)=>{
                if(Response.msg == 'Data Updated Successfully'){
                  this.msg.SuccessNotify(Response.msg);
                  this.getAllRecipe();
                  this.reset();
                  this.app.stopLoaderDark();
                }else{
                  this.msg.WarnNotify(Response.msg);
                  this.app.stopLoaderDark();
                }
              }
            )
          }
        })



       
      }

    }

  }


  edit(item:any){
    console.log(item)
    this.btnType = 'Update';
    this.tabIndex = 0;
    this.categoryID = item.recipeCatID;
    this.recipeID = item.recipeID;
    this.recipeTitle = item.recipeTitle;
    this.costPrice = item.recipeCostPrice;
    this.salePrice = item.recipeSalePrice;
    this.recipeImg = item.recipeImage;
    this.Description = item.recipeDescription;

    this.http.get(environment.mainApi+this.global.inventoryLink+'GetSingleRecipeDetail?recipeid='+item.recipeID).subscribe(
      (Response:any)=>{
        console.log(Response);
        this.menuProdList = [];
        

        Response.forEach((e:any) => {
          this.menuProdList.push({
            productID:e.productID,
            productTitle:e.productTitle,
            barcode:e.barcode,
            productImage:e.productImage,
            quantity:e.quantity,
            avgCostPrice:e.avgCostPrice,
            costPrice:e.costPrice,
            salePrice:e.salePrice,
            expiryDate:this.global.dateFormater(new Date(),'-'),
            batchNo:'-',
            batchStatus:'-',
            uomID:e.uomID,
            packing:1,
            discInP:0,
            discInR:0,
      
          })
        });

        this.getTotal();
     

      }
    )


  }


  delete(row:any){
    this.dialog.open(PincodeComponent,{
      width:'30%'
    }).afterClosed().subscribe(pin=>{

     if(pin != ''){


      Swal.fire({
        title:'Alert!',
        text:'Confirm to Delete the Data',
        position:'center',
        icon:'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
      }).then((result)=>{

        if(result.isConfirmed){
      this.app.startLoaderDark();

      this.http.post(environment.mainApi+this.global.inventoryLink+'deleteRack',{
        RecipeID: row.recipeID,
        PinCode:pin,
        UserID: this.global.getUserID()

      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Deleted Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.getAllRecipe();
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
     }
     )


     }})
  }



  reset(){
    this.recipeID = 0;
    this.recipeTitle = '';
    this.costPrice = '';
    this.salePrice = '';
    this.Description = '';
    this.menuProdList = [];
    this.totalQty = 0;
    this.costTotal = 0;
    this.avgCostTotal = 0;
    this.recipeImg = '';
    this.productImage = '';
    this.btnType = 'Save';

    

  }




  
  /////// to change the tab on edit

  changeTab(tabNum: any) {
    this.tabIndex = tabNum;

  }


}
