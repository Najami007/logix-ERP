import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent  {

  companyProfile:any = [];
  constructor(
    private http:HttpClient,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private dialogRef:MatDialogRef<RecipeDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialog:MatDialog
  ){

    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });

    if(this.data){
    var recipeID = 0;
    if(this.data.recipeRefID > 0){
      recipeID = this.data.recipeRefID;
    }else{
      recipeID = this.data.recipeID;
    }
     this.Category = this.data.recipeCatTitle;
     this.cookingTime = this.data.cookingTime;

     this.http.get(environment.mainApi + this.global.restaurentLink + 'GetSingleRecipeDetail?recipeid='+recipeID).subscribe(
      (Response: any) => {
        this.costPrice = Response[0].recipeCostPrice;
        this.recipeTitle = Response[0].productTitle;
        this.recipeType = Response[0].recipeType;
        this.salePrice = Response[0].recipeSalePrice;
        this.prodList = [];
        Response.forEach((e: any) => {
          this.prodList.push({
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

  recipeTitle = '';
  recipeType = ''
  costPrice = 0;
  salePrice = 0;
  Category = '';
  prodList:any = [];
  cookingTime = 0;


  print(){
    this.global.printData('#recipeDetail');
  }

  closeDialog(){
    this.dialogRef.close()
  }
}
