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
  selector: 'app-property-type',
  templateUrl: './property-type.component.html',
  styleUrls: ['./property-type.component.scss']
})
export class PropertyTypeComponent {

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
    this.globaldata.setHeaderTitle('Property Type');

    this.getSavedData();
  }

  btnType = 'Save';
  PropertyTypeID = 0;
  PropertyTypeTitle = '';


  SavedDataList: any = [];

  getSavedData() {
    this.http.get(environment.mainApi + this.globaldata.propertyLink + 'GetPropertyType').subscribe(
      (Response) => {
        this.SavedDataList = Response;
      },
      (Error) => {
        this.msg.WarnNotify('Error Occured while Loading Countries List')
      }
    )
  }

  save() {
    if (this.PropertyTypeTitle == '' || this.PropertyTypeTitle == undefined) {
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
    this.http.post(environment.mainApi + this.globaldata.propertyLink + 'InsertPropertyType', {
      PropertyTypeTitle: this.PropertyTypeTitle,
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
        this.http.post(environment.mainApi + this.globaldata.propertyLink + 'UpdatePropertyType', {

          PropertyTypeID: this.PropertyTypeID,
          PropertyTypeTitle: this.PropertyTypeTitle,
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
    this.PropertyTypeID = row.propertyTypeID;
    this.PropertyTypeTitle = row.propertyTypeTitle;
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
            this.http.post(environment.mainApi + this.globaldata.propertyLink + 'DeletePropertyType', {
              PropertyTypeID: row.propertyTypeID,
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
   this.PropertyTypeID = 0;
   this.PropertyTypeTitle = '';
    this.btnType = 'Save';

  }

}
