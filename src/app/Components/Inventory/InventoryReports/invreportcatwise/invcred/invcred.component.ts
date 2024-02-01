import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-invcred',
  templateUrl: './invcred.component.html',
  styleUrls: ['./invcred.component.scss']
})
export class InvcredComponent implements OnInit {

  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<InvcredComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private dialogue:MatDialog
  ){}



  ngOnInit(): void {
    this.getCategory();
    this.getSubCategory();
    this.getBrandList();
    this.getLocation();
    this.getProductTypes();
  }

  reportType = '';

  categoryID = 0;
  subCategoryID = 0;
  locationID = 0;
  typeID = 0;
  brandID = 0;


  
  inventoryList:any = [];

  SubCategoriesList:any = []
  CategoriesList:any = [];
  BrandList:any = [];
  ProductTypeList:any =[];
  locationList:any = [];




  
  getSubCategory() {
    this.http.get(environment.mainApi + this.global.inventoryLink+'GetSubCategory').subscribe(
      (Response: any) => {
        this.SubCategoriesList = Response;

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

  
  getBrandList() {
    this.http.get(environment.mainApi +this.global.inventoryLink+'GetBrand').subscribe(
      (Response: any) => {
        this.BrandList = Response;
      }
    )
  }


  getProductTypes(){
    this.http.get(environment.mainApi + this.global.inventoryLink+'GetProductType').subscribe(
      (Response: any) => {
        this.ProductTypeList = Response;
     
      }
    )
  }

  getLocation(){
    this.http.get(environment.mainApi+this.global.inventoryLink+'getlocation').subscribe(
      (Response:any)=>{
        this.locationList = Response;
      }
    )
  }




}
