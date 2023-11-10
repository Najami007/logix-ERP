import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NotificationService } from 'src/app/Shared/service/notification.service';
import { HttpClient } from '@angular/common/http';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';

import { Router } from '@angular/router';


@Component({
  selector: 'app-product-sub-category',
  templateUrl: './product-sub-category.component.html',
  styleUrls: ['./product-sub-category.component.scss']
})
export class ProductSubCategoryComponent implements OnInit {

  crudList:any = [];

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router
    
    ){}


    
  ngOnInit(): void {
    this.getCrud();

   
  }


  txtSearch:any;
  btnType:string = 'Save';
  categorySearch:any;
  categoryID:any;
  categoryList:any  = [];
  subCategoryList:any = [];
  subCategoryID:any;
  








  getCrud(){
    this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globaldata.getUserID()+'&moduleid='+this.globaldata.getModuleID()).subscribe(
      (Response:any)=>{
        this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      }
    )
  }




  save(){}



  reset(){
    this.categoryID = '';
    this.subCategoryID = '';
    this.btnType = 'Save';
  }


  edit(row:any){}

  delete(row:any){}


}
