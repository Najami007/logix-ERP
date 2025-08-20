import { Component, OnInit, ViewChild } from '@angular/core';
import { AddCategoryComponent } from './add-category/add-category.component';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-item-categories',
  templateUrl: './item-categories.component.html',
  styleUrls: ['./item-categories.component.scss']
})
export class ItemCategoriesComponent implements OnInit {

  @ViewChild(AddCategoryComponent) addCompany:any;

  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    private globaldata: GlobalDataModule,
    private app: AppComponent,
    private route: Router,
    private titleService: Title

  ) {

    this.globaldata.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());

    })


  }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Item Category');
    this.getSavedData();


  }

  txtSearch: any;
  


  dataList:any = [];




  getSavedData(){
    this.http.get(environment.mainApi+this.globaldata.manufacturingLink+'GetMnuItemsCategories').subscribe(
      {
        next:(Response:any)=>{
          this.dataList = Response;
        },
        error:(error:any)=>{
          console.log(error);
        }
      }
    )
  }






  edit(item:any){
    this.addCompany.MnuItemCatID = item.mnuItemCatID;
    this.addCompany.categoryTitle = item.mnuItemCatTitle;
   
    this.addCompany.btnType = 'Update';

  }

  delete(item:any){

    var postData:any = {

    MnuItemCatID: item.mnuItemCatID,
    PinCode: "",
    UserID: this.globaldata.getUserID()

    }

    this.globaldata.openPinCode().subscribe( pin =>{
      if(pin != ''){
        postData.PinCode  = pin;
        this.app.startLoaderDark();

         this.http.post(environment.mainApi+this.globaldata.manufacturingLink+'DeleteMnuItemCategory',postData).subscribe(
          {
            next: (Response:any) =>{
              if(Response.msg == 'Data Deleted Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.getSavedData();

              }else{
                this.msg.WarnNotify(Response.msg);
              }
              this.app.stopLoaderDark();
            },
            error: error =>{
              console.log(error);
              this.app.stopLoaderDark();
            }
          }
         )
      }
    })


   

  }


  

}

