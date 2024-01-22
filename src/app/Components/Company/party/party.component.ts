import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { PincodeComponent } from '../../User/pincode/pincode.component';

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



  constructor(private globalData: GlobalDataModule,
 
    private http : HttpClient,
    private msg : NotificationService,
    private app:AppComponent,
    private dialogue:MatDialog
    ){

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
    this.http.get(environment.mainApi+'cmp/getcity').subscribe(
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




addCity(){
  // this.dialogue.open(AddcityformComponent,{
  //   width:"40%",

  // }).afterClosed().subscribe(val=>{
  //   if(val == 'Update'){
  //     this.getCityNames();
  //   }
  // })
}




///////getting City Name for the table//////
  getCityName(id:any){

    var curcity = this.CitiesNames.find((e:any)=>{return e.cityID == id});
    return   curcity.cityName;
  }
//////////////////////////////////////////////



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


  getParty(){
   if(this.srPartyType == 'Customer'){
    this.http.get(environment.mainApi+'cmp/getcustomer').subscribe(
      {
        next:value =>{
          this.partyData = value;
          console.log(value);
          this.loadingBar = 'Stop';     
        },
        error: error=>{
          this.msg.WarnNotify('Error Occured While Loading Data')  ;      
        }         
      }
      )
   }else if(this.srPartyType == 'Supplier'){
    this.http.get(environment.mainApi+'cmp/getsupplier').subscribe(
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

    if(this.btnType == "Save"){
      this.app.startLoaderDark();

      this.http.post(environment.mainApi+'cmp/insertparty',{
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
            this.getParty();
            this.app.stopLoaderDark();
            this.reset();
          }else{
           
            this.msg.WarnNotify(Response.msg);
            this.app.stopLoaderDark();
          }
         }
       )
    }else if(this.btnType == 'Update'){
      
   
      this.dialogue.open(PincodeComponent,{
        width:"30%"
      }).afterClosed().subscribe(pin=>{
        if(pin != ''){
          this.app.startLoaderDark();
          this.http.post(environment.mainApi+'cmp/updateparty',{
  
            PartyID:this.curPartyId,
            PartyType:this.partyType,
            PartyName:this.partyName,
            PartyAddress:this.partyAddress,
          
            PartyCNIC:this.partyCNIC,
            BankName:this.bankName,
            BankAccountTitle: this.accountTitle,
            BankAccountNo: this.accountNo,
            CityID:this.City,
            PassportNo:this.passportNo,
            PartyMobileNo:this.partyMobileno,
            TelephoneNo:this.partyTelephoneno,
            PartyDescription:this.description,
            PinCode:pin,
            UserID:this.globalData.getUserID(),
          }).subscribe(
            (Response:any)=>{
              
          
              if(Response.msg == 'Data Updated Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.getParty();
                this.app.stopLoaderDark();
                this.reset();
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

  }

////////////////to Delete The Party/////////////////////////
  DeleteParty(row:any){

    this.dialogue.open(PincodeComponent,{
      width:"30%"
    }).afterClosed().subscribe(pin=>{
      if(pin != ''){
        alert(pin);
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
            
                this.http.post(environment.mainApi+'cmp/deleteparty',{
                  PartyID:row.partyID,
                  deletedBy:this.globalData.getUserID(),
                  PinCode:pin,
                }).subscribe(
                 (Response:any)=>{
                  if(Response.msg == 'Data Deleted Successfully'){
                    this.msg.SuccessNotify(Response.msg);
                    this.getParty();
                    
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

