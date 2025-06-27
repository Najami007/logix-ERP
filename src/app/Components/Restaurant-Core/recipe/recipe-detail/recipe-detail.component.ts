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
    if(this.data[1].type == 'Other'){
      recipeID = this.data[0].recipeRefID;
    }else{
      recipeID = this.data[0].recipeID;
    }
     this.Category = this.data[0].recipeCatTitle;
     this.cookingTime = this.data[0].cookingTime;
     this.costPrice = this.data[0].recipeCurrentCostPrice;

    this.getDetail(this.data[0].recipeID,0);
    if(this.data[0].recipeRefID > 0){
      this.getDetail(0,this.data[0].recipeRefID);
    }
    
    }

   

  }


  getDetail(recipeID:any,refID:any){

    var tmpRecipeID = refID > 0 ? refID : recipeID;

     this.http.get(environment.mainApi + this.global.restaurentLink + 'GetSingleRecipeDetail?recipeid='+tmpRecipeID).subscribe(
      (Response: any) => {
       
        this.recipeTitle = Response[0].recipeTitle;
        this.recipeType = Response[0].recipeType;
        this.salePrice = Response[0].recipeSalePrice;
        
          
          if(recipeID > 0){
            this.DineInProdList = [];
            this.DineInProdList = Response;
            this.DineInProdList.sort((a:any,b:any)=>a.productTitle - b.productTitle )
          }
          if(refID > 0){
            this.OtherProdList = [];
            this.OtherProdList = Response;
             this.OtherProdList.sort((a:any,b:any)=>a.productTitle - b.productTitle && a.lockedStatus - b.lockedStatus )
            if(Response.length > 0){
              Response.forEach((e:any) => {
                this.OtherCostPrice += e.avgCostPrice * e.quantity;
              });
            }
          }

          // Response.forEach((e: any) => {
        //   this.prodList.push({
        //     productID: e.productID,
        //     productTitle: e.productTitle,
        //     barcode: e.barcode,
        //     productImage: e.productImage,
        //     quantity: e.quantity,
        //     avgCostPrice: e.avgCostPrice,
        //     costPrice: e.costPrice,
        //     salePrice: e.salePrice,
        //     expiryDate: this.global.dateFormater(new Date(), '-'),
        //     batchNo: '-',
        //     batchStatus: '-',
        //     uomID: e.uomID,
        //     packing: 1,
        //     discInP: 0,
        //     discInR: 0,
        //     lockedStatus: e.lockedStatus,

        //   })
        // });
      }
    )

  }

  recipeTitle = '';
  recipeType = ''
  costPrice = 0;
  salePrice = 0;
  Category = '';
  DineInProdList:any = [];
  OtherProdList:any = [];
  cookingTime = 0;
  curCostPrice = 0;
  OtherCostPrice = 0;


  print(){
    this.global.printData('#recipeDetail');
  }

  closeDialog(){
    this.dialogRef.close()
  }
}
