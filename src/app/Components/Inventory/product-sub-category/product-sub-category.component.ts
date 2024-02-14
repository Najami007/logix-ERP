import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NotificationService } from 'src/app/Shared/service/notification.service';
import { HttpClient } from '@angular/common/http';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';

import { Router } from '@angular/router';
import { PincodeComponent } from '../../User/pincode/pincode.component';


@Component({
  selector: 'app-product-sub-category',
  templateUrl: './product-sub-category.component.html',
  styleUrls: ['./product-sub-category.component.scss']
})
export class ProductSubCategoryComponent implements OnInit {

  crudList:any = {c:true,r:true,u:true,d:true};

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router
    
    ){
      this.globaldata.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      })

    }


    
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Sub Category');
    this.getCategory();
    this.getSubCategory();

   
  }


  txtSearch:any;
  btnType:string = 'Save';
  categorySearch:any;
  categoryID:any;
  subCategoryTitle:any;
  categoryList:any  = [];
  subCategoryList:any = [];
  subCategoryID:any;
  description:any;
  



  ///////////////////////////////////////////////////////////

  getCategory(){
    this.http.get(environment.mainApi+this.globaldata.inventoryLink+'GetCategory').subscribe(
      (Response:any)=>{
        this.categoryList = Response;
      }
    )
  }


  /////////////////////////////////////////////////////////////////////

  getSubCategory(){
    this.http.get(environment.mainApi+this.globaldata.inventoryLink+'GetSubCategory').subscribe(
      (Response:any)=>{
        this.subCategoryList = Response;
      }
    )
  }





  save(){
    if(this.categoryID == '' || this.categoryID == undefined){
      this.msg.WarnNotify('Enter Category Title')
    }else if(this.subCategoryTitle == '' || this.subCategoryTitle == undefined){
      this.msg.WarnNotify('Enter Sub Category Title')
    }else {

      if(this.description == '' || this.description == undefined){
        this.description = '-';
      }

      if(this.btnType == 'Save'){
        this.insert();
      }else if(this.btnType == 'Update'){
        this.update();

      }

    }

  }




  
  insert(){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+this.globaldata.inventoryLink+'InsertSubCategory',{  
      CategoryID: this.categoryID,
      SubCategoryTitle: this.subCategoryTitle,
      SubCategoryDescription: this.description,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getSubCategory();
          this.reset();
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

  update(){
    this.globaldata.openPinCode().subscribe(pin=>{

     if(pin != ''){
      this.app.startLoaderDark();
      this.http.post(environment.mainApi+this.globaldata.inventoryLink+'UpdateSubCategory',{
        SubCategoryID:this.subCategoryID,  
        CategoryID:this.categoryID,
        SubCategoryTitle: this.subCategoryTitle,
        SubCategoryDescription: this.description,
      PinCode:pin,
      UserID: this.globaldata.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Updated Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.getSubCategory();
            this.reset();
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
    })
   
  }



  reset(){
    this.categoryID = '';
    this.subCategoryID = '';
    this.subCategoryTitle = '';
    this.description = '';
    this.btnType = 'Save';
  }


  edit(row:any){
    this.categoryID = row.categoryID;
    this.subCategoryID = row.subCategoryID;
    this.subCategoryTitle = row.subCategoryTitle;
    this.description = row.subCategoryDescription;
    this.btnType = 'Update';
  }

  delete(row:any){
    this.globaldata.openPinCode().subscribe(pin=>{

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

      this.http.post(environment.mainApi+this.globaldata.inventoryLink+'DeleteSubCategory',{
        SubCategoryID: row.subCategoryID,
        PinCode:pin,
        UserID: this.globaldata.getUserID()

      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Deleted Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.getSubCategory();
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
        }})

     }})

  }



}
