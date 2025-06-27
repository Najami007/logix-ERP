import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-recipe-comparison',
  templateUrl: './recipe-comparison.component.html',
  styleUrls: ['./recipe-comparison.component.scss']
})
export class RecipeComparisonComponent implements OnInit {

  companyProfile:any = [];
  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private dialogRef: MatDialogRef<RecipeComparisonComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private dialogue:MatDialog
  ){
    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });
  }
  ngOnInit(): void {
   this.getAllRecipe();
  }


  recipeList:any = [];
  
  getAllRecipe() {
    
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetAllRecipes').subscribe(
      (Response: any) => {
        this.recipeList = Response;
   
 
      },
      (Error:any)=>{
        
      }
    )
  }

  recipe1= 0;
  recipe2  = 0;



  recipeTitle1 = '';
  recipeType1 = ''
  costPrice1 = 0;
  salePrice1 = 0;
  Category1 = '';
  prodListRecipe1:any = [];
  cookingTime1 = 0;
  curCostPrice1 = 0;

  recipeTitle2 = '';
  recipeType2 = ''
  costPrice2 = 0;
  salePrice2 = 0;
  Category2 = '';
  prodListRecipe2:any = [];
  cookingTime2 = 0;
  curCostPrice2 = 0;


  getReport(){
  if(this.recipe1 == 0 ){
    this.msg.WarnNotify('Select Recipe 1')
  }else if(this.recipe2 == 0){
    this.msg.WarnNotify('Select Recipe 2')
  }else{
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetSingleRecipeDetail?recipeid='+this.recipe1).subscribe(
      (Response: any) => {
        this.costPrice1 = Response[0].recipeCostPrice;
        this.recipeTitle1 = Response[0].recipeTitle;
        this.recipeType1 = Response[0].recipeType;
        this.salePrice1 = Response[0].recipeSalePrice;
        this.Category1 = Response[0].recipeCatTitle;
        this.prodListRecipe1 = [];
        Response.forEach((e: any) => {
          this.prodListRecipe1.push({
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
      }
    )

    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetSingleRecipeDetail?recipeid='+this.recipe2).subscribe(
      (Response: any) => {
        this.costPrice2 = Response[0].recipeCostPrice;
        this.recipeTitle2 = Response[0].recipeTitle;
        this.recipeType2 = Response[0].recipeType;
        this.salePrice2 = Response[0].recipeSalePrice;
        this.Category2 = Response[0].recipeCatTitle;
        this.prodListRecipe2 = [];
        Response.forEach((e: any) => {
          this.prodListRecipe2.push({
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
      }
    )
  }
  }


  
  print(){
    this.global.printData('#recipeDetail');
  }

  closeDialog(){
    this.dialogRef.close()
  }


}
