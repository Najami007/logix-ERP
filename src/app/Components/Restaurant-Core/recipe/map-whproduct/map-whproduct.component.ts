import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PincodeComponent } from 'src/app/Components/User/pincode/pincode.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-map-whproduct',
  templateUrl: './map-whproduct.component.html',
  styleUrls: ['./map-whproduct.component.scss']
})
export class MapWHProductComponent implements OnInit {


  constructor(
    private http:HttpClient,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private dialogRef:MatDialogRef<MapWHProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialog:MatDialog
  ){


     
    this.global.getProducts().subscribe(
      (data:any)=>{this.productList = data;})
  }
  ngOnInit(): void {
    this.getCategories();
    this.getCookingArea();
  }

  cookingAriaID = 0;
  productID = 0;
  categoryID = 0;
  productList:any = [];



  categoriesList:any = [];


  cookingAreaList:any = [];


  getCookingArea(){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetCookingAria').subscribe(
      (Response:any)=>{
        this.cookingAreaList = Response;
      }
    )
  }

  getCategories(){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetRecipeCategories').subscribe(
      (Response:any)=>{
        this.categoriesList = Response;
      }
    )
  }


  save(){
  //  alert(this.productID);
  //  alert(this.categoryID);
    if(this.productID == 0 || this.productID == undefined){
      this.msg.WarnNotify('Select Product')
    }else if(this.categoryID == 0 || this.categoryID == undefined){
      this.msg.WarnNotify('Select Category')
    }else if(this.cookingAriaID == 0 || this.cookingAriaID == undefined){
      this.msg.WarnNotify('Select Cooking Area')
    }
    else{
      this.dialog.open(PincodeComponent,{
        width:"30%",
      }).afterClosed().subscribe(pin=>{
        if(pin !== ''){
          $('.loaderDark').show();
          this.http.post(environment.mainApi+this.global.restaurentLink+'MapProductWithRecipe',{
            ProductID: this.productID,
            RecipeCatID: this.categoryID,
            CookingAriaID:this.cookingAriaID,
            PinCode: pin,
            UserID: this.global.getUserID()
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Updated Successfully'){
                  this.msg.SuccessNotify(Response.msg);
                  this.reset();

                  this.dialogRef.close('Update')
              }else {
                this.msg.WarnNotify(Response.msg);
              }
              $('.loaderDark').fadeOut(200);
            }
          )
        }
      })
    }
  
    
  }

  closeDialogue(){
    this.dialogRef.close();
  }


  reset(){
    this.productID = 0;
    this.categoryID = 0;
    this.cookingAriaID = 0;
  }

}
