import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import { AddcityComponent } from '../settings/city/addcity/addcity.component';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent implements OnInit{
  loadingBar = 'start';

  
  page:number = 1;
  count: number = 0;
 
  tableSize: number = 10;
  tableSizes : any = [];

  onTableDataChange(event:any){

    this.page = event;
    this.getParty();
  }

  onTableSizeChange(event:any):void{
    this.tableSize = event.target.value;
    this.page =1 ;
    this.getParty();
  }


  cnicMask = this.globalData.cnicMask;
  mobileMask = this.globalData.mobileMask;
  telephoneMask = this.globalData.phoneMask;

  crudList:any = {c:true,r:true,u:true,d:true};

  constructor(private globalData: GlobalDataModule,
 
    private http : HttpClient,
    private msg : NotificationService,
    private app:AppComponent,
    private dialogue:MatDialog,
    private route:Router,
    public global:GlobalDataModule
    ){
      this.globalData.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      })
  
  }
  ngOnInit(): void{
   this.globalData.setHeaderTitle('Add Party');
   this.getParty();
   this.getCityNames();
  //  this.tableSize = this.globalData.paginationDefaultTalbeSize;
   this.tableSizes = this.globalData.paginationTableSizes;
  }




  //////////////////////////////////////////////////////
  //////////////////////getting the City Names/////////////////
  //////////////////////////////////////////////////////////////

  CitiesNames : any = []

  getCityNames(){
    this.http.get(environment.mainApi+this.globalData.companyLink+'getcity').subscribe(
      {
        next : value =>{
          this.CitiesNames = value;
        },
        error : error=>{
          console.log(error);
        }
      }
    )
  }
/////////////////////////////////////////////////////////////////////////


@ViewChild('city') mycity:any;

addCity(){
  setTimeout(() => {
    this.mycity.close()
 
  }, 100);
  this.dialogue.open(AddcityComponent,{
    width:"40%",

  }).afterClosed().subscribe(val=>{
    if(val == 'Update'){
      this.getCityNames();
    }
  })
}




///////getting City Name for the table//////
  getCityName(id:any){

    var curcity = this.CitiesNames.find((e:any)=>{return e.cityID == id});
    return   curcity.cityName;
  }
//////////////////////////////////////////////


  autoEmpty = false; 
  searchtxt:any;
  btnType = "Save";
  curPartyId:any;
  partyType :any;
  partyName :any = '';
  partyCNIC  = '';
  passportNo:any = '';
  partyPhoneno = '';
  partyMobileno = '';
  bankName:any = '';
  accountTitle:any = '';
  accountNo:any = '';
  partyTelephoneno:any = '';
  City :any = 0;
  partyAddress:any = '';
  description :any = '';
 
  validate = true;


  partyData : any = [];


  srPartyType = 'Customer';


  getParty(){
   if(this.srPartyType == 'Customer'){
    this.http.get(environment.mainApi+this.globalData.companyLink+'getcustomer').subscribe(
      {
        next:value =>{
          this.partyData = value;
          this.loadingBar = 'Stop';     
        },
        error: error=>{
          this.msg.WarnNotify('Error Occured While Loading Data')  ;      
        }         
      }
      )
   }else if(this.srPartyType == 'Supplier'){
    this.http.get(environment.mainApi+this.globalData.companyLink+'getsupplier').subscribe(
      {
        next:value =>{
          this.partyData = value;
          this.loadingBar = 'Stop';
          
        
        },
        error: error=>{
          this.msg.WarnNotify('Error Occured While Loading Data')
         
        }        
        
        
      }
      )
   }
  }


  saveParty(){
    if(this.partyType == "" || this.partyType == undefined){
      this.msg.WarnNotify("Select The Party Type");
    }else if(this.partyName == "" || this.partyName == undefined){
      this.msg.WarnNotify("Enter The Party Name");
      
    }else if(this.City == "" || this.City == undefined){
      this.msg.WarnNotify("Select The City")
    }else if(this.partyAddress == "" || this.partyAddress == undefined){
      this.msg.WarnNotify("Enter The Party Address")
    }else if(this.partyCNIC.length > 1 && this.partyCNIC.length < 15){
    this.msg.WarnNotify("Please Enter the Valid CNIC No.")
  }else if(this.partyMobileno.length > 1 && this.partyMobileno.length < 12){
    this.msg.WarnNotify("Please Enter the Valid Mobile NO.")
  }
  else if( this.partyTelephoneno.length > 1 && this.partyTelephoneno.length < 11){
    this.msg.WarnNotify("Please Enter the Valid Telephone NO.")
  }else{

    if(this.btnType == "Save"){
      this.app.startLoaderDark();

      this.http.post(environment.mainApi+this.globalData.companyLink+'insertparty',{
        PartyType:this.partyType,
        PartyName:this.partyName,
        PartyAddress:this.partyAddress,
        PartyCNIC:this.partyCNIC || '-',
        CityID:this.City,
        PassportNo:this.passportNo || '-',
        BankName:this.bankName || '-',
        BankAccountTitle: this.accountTitle || '-',
        BankAccountNo: this.accountNo || '-',
        PartyMobileNo:this.partyMobileno || '-',
        TelephoneNo:this.partyTelephoneno || '-',
        PartyDescription:this.description || '-',
        UserID:this.globalData.getUserID(),
   
       }).subscribe(
         (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.getParty();
            this.app.stopLoaderDark();
            this.reset();
            this.focusPartyName();
          }else{
           
            this.msg.WarnNotify(Response.msg);
            this.app.stopLoaderDark();
          }
         }
       )
    }else if(this.btnType == 'Update'){
      
   
      this.globalData.openPinCode().subscribe(pin=>{
        if(pin != ''){
          this.app.startLoaderDark();
          this.http.post(environment.mainApi+this.globalData.companyLink+'updateparty',{
  
            PartyID:this.curPartyId,
            PartyType:this.partyType ,
            PartyName:this.partyName,
            PartyAddress:this.partyAddress,
          
            PartyCNIC:this.partyCNIC || '-',
            BankName:this.bankName|| '-',
            BankAccountTitle: this.accountTitle|| '-',
            BankAccountNo: this.accountNo|| '-',
            CityID:this.City,
            PassportNo:this.passportNo|| '-',
            PartyMobileNo:this.partyMobileno|| '-',
            TelephoneNo:this.partyTelephoneno|| '-',
            PartyDescription:this.description|| '-',
            PinCode:pin,
            UserID:this.globalData.getUserID(),
          }).subscribe(
            (Response:any)=>{
              
          
              if(Response.msg == 'Data Updated Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.getParty();
                this.app.stopLoaderDark();
                this.reset();
                this.focusPartyName();
              }else{
                
                this.msg.WarnNotify(Response.msg);
                this.app.stopLoaderDark();
              }
             }
          )
        }
      })
    }
  }



  }

/////////////to Set CNIC Field Formate/////////////////
  setCnicData() {
    if (
      this.partyCNIC.length == 5 ||
      this.partyCNIC.length == 13
    ) {
      this.partyCNIC = this.partyCNIC + '-';
    }
  }

  ////////////////////to Set Phone No field Formate//////////////
  setPhoneno(){
    if(this.partyTelephoneno.length == 3){
      this.partyTelephoneno = this.partyTelephoneno + '-';
    } 
  }

  ////////////Mobile no field formate//////////////////////////
  mobileNoFormate(){
    if(this.partyMobileno.length == 4){
      this.partyMobileno = this.partyMobileno + '-';
    }
  }


  editParty(item:any){

    this.curPartyId = item.partyID;
    
    this.partyType = item.partyType;
    this.partyName = item.partyName;
    this.partyCNIC = item.partyCNIC;
    this.passportNo = item.passportNo;
    this.partyMobileno = item.partyMobileNo;
    this.partyTelephoneno = item.telephoneNo;
    this.partyAddress = item.partyAddress;
    this.bankName = item.bankName;
    this.accountNo = item.bankAccountNo;
    this.accountTitle = item.bankAccountTitle;
    this.City = item.cityID.toString();
    this.description = item.partyDescription;
    this.btnType = "Update";
    this.focusPartyName();



  }

////////////////to Delete The Party/////////////////////////
  DeleteParty(row:any){

    this.globalData.openPinCode().subscribe(pin=>{
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
    
            //////on confirm button pressed the api will run
            
                this.http.post(environment.mainApi+this.globalData.companyLink+'deleteparty',{
                  PartyID:row.partyID,
                  UserID:this.globalData.getUserID(),
                  PinCode:pin,
                }).subscribe(
                 (Response:any)=>{
                  if(Response.msg == 'Data Deleted Successfully'){
                    this.msg.SuccessNotify(Response.msg);
                    this.getParty();
                    this.focusPartyName();
                    
                  }else{
                    this.msg.WarnNotify(Response.msg);
                  }
                 }
                )
             
          }
        });
      }})

  

   
  }





  reset(){
   
   if(!this.autoEmpty){
    this.partyName = '';
    this.partyMobileno = '';
    this.partyCNIC = '';
    this.btnType = "Save";
   }else{
    this.partyType = '';
    this.partyName = '';
    this.partyCNIC = '';
    this.bankName = '';
    this.accountNo = '';
    this.accountTitle = '';
    this.partyTelephoneno = '';
    this.partyMobileno = '';
    this.City = '';
    this.passportNo = '';
    this.partyAddress="";
    this.description = '';
    this.btnType = "Save";
   }
  }


  focusPartyName(){
    
    $('#partyName').trigger('focus');
   setTimeout(() => {
    $('#partyName').trigger('select');
   }, 200);
  }


}

