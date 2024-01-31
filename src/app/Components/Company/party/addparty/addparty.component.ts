import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { AddcityComponent } from '../../settings/city/addcity/addcity.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-addparty',
  templateUrl: './addparty.component.html',
  styleUrls: ['./addparty.component.scss']
})
export class AddpartyComponent implements OnInit {




  cnicMask = this.globalData.cnicMask;
  mobileMask = this.globalData.mobileMask;
  telephoneMask = this.globalData.phoneMask;


  constructor(private globalData: GlobalDataModule,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<AddcityComponent>,
    private http : HttpClient,
    private msg : NotificationService,
    private dialogue:MatDialog
    ){

  }
  ngOnInit(): void {
   
  }





  
  searchtxt:any;
  btnType = "Save";
  curPartyId:any;
  partyType :any;
  partyName :any;
  partyCNIC :any;
  passportNo:any;
  partyPhoneno:any;
  partyMobileno:any;
  bankName:any;
  accountTitle:any;
  accountNo:any;
  partyTelephoneno:any;
  City :any;
  partyAddress:any;
  description :any;
 
  validate = true;


  partyData : any = [];


  srPartyType = 'Customer';



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



  
addCity(){
  this.dialogue.open(AddcityComponent,{
    width:"40%",

  }).afterClosed().subscribe(val=>{
    if(val == 'Update'){
      this.getCityNames();
    }
  })
}




saveParty(){
  if(this.partyType == "" || this.partyType == undefined){
    this.msg.WarnNotify("Select The Party Type");
  }else if(this.partyName == "" || this.partyName == undefined){
    this.msg.WarnNotify("Enter The Party Name");
    
  }else if(this.partyCNIC == "" || this.partyCNIC == undefined ){
    this.msg.WarnNotify("Enter Party CNIC")
  }
  else if(this.passportNo == "" || this.passportNo == undefined ){
    this.msg.WarnNotify("Enter PassPort No");
  } else if(this.bankName == "" || this.bankName == undefined ){
    this.msg.WarnNotify("Enter Bank Name");
  } else if(this.accountTitle == "" || this.accountTitle == undefined ){
    this.msg.WarnNotify("Enter Bank Account Title");
  } else if(this.accountNo == "" || this.accountNo == undefined ){
    this.msg.WarnNotify("Enter Bank Account No.");
  }else if(this.partyMobileno == "" || this.partyMobileno == undefined){
    this.msg.WarnNotify("Enter Party Mobile Number")
  }
  else if(this.partyTelephoneno == "" || this.partyTelephoneno == undefined){
    this.msg.WarnNotify("Enter Party Telephone Number")
  }else if(this.City == "" || this.City == undefined){
    this.msg.WarnNotify("Select The City")
  }else if(this.partyAddress == "" || this.partyAddress == undefined){
    this.msg.WarnNotify("Enter The Party Address")
  }else if(this.description == "" || this.description == undefined){
  this.description = "-";
}else if(this.partyCNIC.length < 15){
  this.msg.WarnNotify("Please Enter the Valid CNIC No.")
}else if(this.partyMobileno.length < 12){
  this.msg.WarnNotify("Please Enter the Valid Mobile NO.")
}
else if(this.partyTelephoneno.length < 11){
  this.msg.WarnNotify("Please Enter the Valid Telephone NO.")
}else{

 
    $('.loaderDark').show();

    this.http.post(environment.mainApi+this.globalData.companyLink+'insertparty',{
      PartyType:this.partyType,
      PartyName:this.partyName,
      PartyAddress:this.partyAddress,
      PartyCNIC:this.partyCNIC,
      CityID:this.City,
      PassportNo:this.passportNo,
      BankName:this.bankName,
      BankAccountTitle: this.accountTitle,
      BankAccountNo: this.accountNo,
      PartyMobileNo:this.partyMobileno,
      TelephoneNo:this.partyTelephoneno,
      PartyDescription:this.description,
      UserID:this.globalData.getUserID(),
 
     }).subscribe(
       (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);

          $('.loaderDark').fadeOut(100);
          this.reset();
        }else{
         
          this.msg.WarnNotify(Response.msg);
          $('.loaderDark').fadeOut(100);
        }
       }
     )
  
}



}



reset(){
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
  this.dialogRef.close('Update');
 }



}
