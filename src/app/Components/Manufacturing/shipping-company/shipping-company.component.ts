import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AddcityComponent } from '../../Company/settings/city/addcity/addcity.component';
import { environment } from 'src/environments/environment.development';
import { AddShippingCompanyComponent } from './add-shipping-company/add-shipping-company.component';

@Component({
  selector: 'app-shipping-company',
  templateUrl: './shipping-company.component.html',
  styleUrls: ['./shipping-company.component.scss']
})
export class ShippingCompanyComponent implements OnInit {

  @ViewChild(AddShippingCompanyComponent) addCompany:any;

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
    this.globaldata.setHeaderTitle('Shipment Company');
    this.getSavedData();
    


  }

  txtSearch: any;
  


  dataList:any = [];




  getSavedData(){
    this.http.get(environment.mainApi+this.globaldata.manufacturingLink+'GetShpCompanies').subscribe(
      {
        next:(Response:any)=>{
          this.dataList = Response;
          console.log(Response);
        },
        error:(error:any)=>{
          console.log(error);
        }
      }
    )
  }






  edit(item:any){
    this.addCompany.scAutoID = item.scAutoID;
    this.addCompany.ShpCmpName = item.shpCmpName;
    this.addCompany.OwnerName = item.ownerName;
    this.addCompany.RepName = item.repName;
    this.addCompany.ContactNo = item.contactNo;
    this.addCompany.CityID  = item.cityID;
    this.addCompany.Description = item.description;
    this.addCompany.btnType = 'Update';

    alert( this.addCompany.CityID)

  }

  delete(item:any){

    var postData:any = {

    SCAutoID: item.scAutoID,
    PinCode: "",
    UserID: this.globaldata.getUserID()

    }

    this.globaldata.openPinCode().subscribe( pin =>{
      if(pin != ''){
        postData.PinCode  = pin;
        this.app.startLoaderDark();

         this.http.post(environment.mainApi+this.globaldata.manufacturingLink+'DeleteShpCmp',postData).subscribe(
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
