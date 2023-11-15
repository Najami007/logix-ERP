import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { AddcityComponent } from '../settings/city/addcity/addcity.component';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import Swal from 'sweetalert2';
import { error } from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersComponent implements OnInit {


  cnicMask = this.global.cnicMask;
  mobileMask = this.global.mobileMask;

  crudList:any = [];

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private global:GlobalDataModule,
    private app:AppComponent,
    private dialogue:MatDialog,
    private route:Router
  ){}

  ngOnInit(): void {
    this.global.setHeaderTitle('Partner Profile')
    this.getCrud();
    this.getCity();
    this.getPartners();
   
  }

  txtSearch:any;
  btnType = 'Save';

  partnerID:any;
  partnerName:any;
  partnerCNIC:any;
  partnerMobile:any;
  partnerEmail:any;
  cityID:any;
  citySearch:any;
  partnerAddress:any;


  citiesList:any = [];
  partnersList:any = [];




  getCrud(){
    this.http.get(environment.mainApi+'user/getusermenu?userid='+this.global.getUserID()+'&moduleid='+this.global.getModuleID()).subscribe(
      (Response:any)=>{
        this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      }
    )
  }



  
  getCity(){
    this.http.get(environment.mainApi+'cmp/getcity').subscribe({
      next:value=>{
    
        this.citiesList = value;
      },
      error:error=>{
        console.log(error);
      }
    })
  }



  addCity(){
    this.dialogue.open(AddcityComponent,{
      width:"40%",

    }).afterClosed().subscribe(val=>{
      this.getCity();
    })
  }

  getPartners(){
    this.http.get(environment.mainApi+'cmp/getpartner').subscribe(
      (Response)=>{
        this.partnersList = Response;
      }
    )
  }

  save(){
    if(this.partnerName == '' || this.partnerName == undefined){
      this.msg.WarnNotify('Enter Partner Name')
    }else if(this.partnerCNIC == '' || this.partnerCNIC == undefined){
      this.msg.WarnNotify('Enter Partner CNIC')
    }else if(this.partnerMobile == '' || this.partnerMobile == undefined){
      this.msg.WarnNotify('Enter Partner Mobile NO.')
    }else if(this.partnerEmail == '' || this.partnerMobile == undefined){
      this.msg.WarnNotify('Enter Email Address')
    }else if(this.cityID == '' || this.cityID == undefined){
      this.msg.WarnNotify('Select City')
    }else if(this.partnerAddress == '' || this.partnerAddress == undefined){
      this.msg.WarnNotify('Enter Party Address')
    }else {

      if(this.btnType == 'Save'){
        this.insertPartner();
      }else if(this.btnType == 'Update'){
        this.dialogue.open(PincodeComponent,{
          width:"40%",
    
        }).afterClosed().subscribe(pin=>{
          if(pin != ''){
            this.updatePartner(pin);
          }
        })
      }


    }
  }


  insertPartner(){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+'cmp/insertpartner',{
    PartnerName: this.partnerName,
    PartnerCNIC: this.partnerCNIC,
    PartnerAddress: this.partnerAddress,
    PartnerMobileNo: this.partnerMobile,
    PartnerEmail: this.partnerEmail,
    CityID: this.cityID,
    UserID: this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.getPartners();
          this.app.stopLoaderDark();
        }else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error:any)=>{
        this.app.stopLoaderDark();
      }
    )
  }


  updatePartner(pin:any){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+'cmp/updatepartner',{
      PartnerID: this.partnerID,
    PartnerName: this.partnerName,
    PartnerCNIC: this.partnerCNIC,
    PartnerAddress: this.partnerAddress,
    PartnerMobileNo: this.partnerMobile,
    PartnerEmail: this.partnerEmail,
    CityID: this.cityID,
    PinCode:pin,
    UserID: this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.getPartners();
          this.app.stopLoaderDark();
        }else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error:any)=>{
        this.app.stopLoaderDark();
      }
    )
  }


  editPartner(row:any){
    this.partnerName = row.partnerName;
    this.partnerCNIC = row.partnerCNIC;
    this.partnerMobile = row.partnerMobileNo;
    this.partnerEmail = row.partnerEmail;
    this.partnerID = row.partnerID;
    this.cityID = row.cityID;
    this.partnerAddress = row.partnerAddress;
    this.btnType = 'Update';
  }


  deletePartner(row:any){

    this.dialogue.open(PincodeComponent,{
      width:"30%",

    }).afterClosed().subscribe(pin=>{
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
    
  
    this.http.post(environment.mainApi+'cmp/deletepartner',{
      PartnerID:row.partnerID ,
      PinCode:pin,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Deleted Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getPartners();
          this.app.stopLoaderDark();
        }else{
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error:any)=>{
        this.app.stopLoaderDark();
      }
    
   );


    }})
  


 

   



      }
    })

  }


  reset(){
    this.btnType = 'Save'
    this.partnerName = '';
    this.partnerCNIC = '';
    this.partnerMobile = '';
    this.partnerEmail = '';
    this.partnerAddress = '';
    this.cityID = '';

  }


}
