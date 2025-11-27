import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {

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
    this.globaldata.setHeaderTitle('Features');
    this.getFeatureCategories();
    this.getSavedData();
   
  }

  btnType = 'Save';
  PropertyFeatureID = 0;
  PropertyCategoryID = 0;
  PropertyFeatureTitle = '';
  autoEmpty = false;

  featureCategoryList:any = [];
  SavedDataList: any = [];

 getFeatureCategories(){
  this.http.get(environment.mainApi + this.globaldata.propertyLink + 'GetPropertyCategory').subscribe(
    (Response) => {
      this.featureCategoryList = Response;
    },
    (Error) => {
      this.msg.WarnNotify('Error Occured while Loading Countries List')
    }
  )
 }




 getSavedData() {
   this.http.get(environment.mainApi + this.globaldata.propertyLink + 'GetPropertyFeature').subscribe(
     (Response) => {
       this.SavedDataList = Response;
     },
     (Error) => {
       this.msg.WarnNotify('Error Occured while Loading Countries List')
     }
   )
 }


 save() {
  if(this.PropertyCategoryID == 0 || this.PropertyCategoryID == undefined){
    this.msg.WarnNotify('Select Category')
  }else if (this.PropertyFeatureTitle == '' || this.PropertyFeatureTitle == undefined) {
    this.msg.WarnNotify('Enter Title');
  } else {
    if (this.btnType == 'Save') {
      this.insert();
    }

    if (this.btnType == 'Update') {
      this.update();
    }
  }

}


insert() {
  $('.loaderDark').show();
  this.http.post(environment.mainApi + this.globaldata.propertyLink + 'InsertPropertyFeature', {
   PropertyCategoryID: this.PropertyCategoryID,
    PropertyFeatureTitle: this.PropertyFeatureTitle,
    UserID: this.globaldata.getUserID(),
  }).subscribe(
    (Response: any) => {
      if (Response.msg == 'Data Saved Successfully') {
        this.msg.SuccessNotify(Response.msg);
        this.getSavedData();
        this.reset();
        $('.loaderDark').fadeOut(500);
      } else {
        this.msg.WarnNotify(Response.msg);
        $('.loaderDark').fadeOut(500);
      }
    }
  )
}

update() {
  this.globaldata.openPinCode().subscribe(pin => {
    if (pin != '') {

      $('.loaderDark').show();
      this.http.post(environment.mainApi + this.globaldata.propertyLink + 'UpdatePropertyFeature', {

        PropertyFeatureID: this.PropertyFeatureID,
        PropertyCategoryID: this.PropertyCategoryID,
        PropertyFeatureTitle: this.PropertyFeatureTitle,
        PinCode:pin,
        UserID: this.globaldata.getUserID(),
      }).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.getSavedData();
            this.reset();
            $('.loaderDark').fadeOut(500);
          } else {
            this.msg.WarnNotify(Response.msg);
            $('.loaderDark').fadeOut(500);
          }
        }
      )

    }
  })

}

edit(row: any) {
  this.PropertyFeatureID = row.propertyFeatureID;
  this.PropertyCategoryID = row.propertyCategoryID;
  this.PropertyFeatureTitle = row.propertyFeatureTitle;
  this.btnType = 'Update';
}


delete(row: any) {
  Swal.fire({
    title: 'Alert!',
    text: 'Confirm to Delete the Data',
    position: 'center',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirm',
  }).then((result) => {
    if (result.isConfirmed) {
      this.globaldata.openPinCode().subscribe(pin => {
        if (pin != '') {
          this.app.startLoaderDark();
          //////on confirm button pressed the api will run
          this.http.post(environment.mainApi + this.globaldata.propertyLink + 'DeletePropertyFeature', {
            PropertyFeatureID: row.propertyFeatureID,
            PinCode:pin,
            UserID: this.globaldata.getUserID(),
          }).subscribe(
            (Response: any) => {
              if (Response.msg == 'Data Deleted Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.getSavedData();
                this.app.stopLoaderDark();
              } else {
                this.msg.WarnNotify(Response.msg);
                this.app.stopLoaderDark();
              }
            }
          )
        }

      })

    }
  });
}

  

  reset(){
   
   this.PropertyFeatureID = 0;
   if(this.autoEmpty){
    this.PropertyCategoryID = 0;
   }
   this.PropertyFeatureTitle = '';

    this.btnType = 'Save';

  }

}
