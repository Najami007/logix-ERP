import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import * as $ from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';
import { MatDialog } from '@angular/material/dialog';
import { VoucherDetailsComponent } from '../CommonComponent/voucher-details/voucher-details.component';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit{

  loadingBar = 'start';


  page:number = 1;
  count: number = 0;
 
  tableSize: number = 0;
  tableSizes : any = [];

  onTableDataChange(event:any){

    this.page = event;
    this.getSavedVoucher();
  }

  onTableSizeChange(event:any):void{
    this.tableSize = event.target.value;
    this.page =1;
    this.getSavedVoucher();
  }


  RoleID:any;
  crudList:any = {c:true,r:true,u:true,d:true};
  companyProfile:any;

  constructor(private msg: NotificationService,
    private globalData:GlobalDataModule,
    private http:HttpClient,
    private app:AppComponent,
    private dialogue:MatDialog,
    private route:Router
    ) { 

      
      //this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe((Response:any)=>{this.companyProfile = Response;})

      this.globalData.getCompany().subscribe((data)=>{
        this.companyProfile = data;
      });

      this.globalData.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      })

    
    }

  ngOnInit(): void {

    this.globalData.setHeaderTitle('Voucher'); 
    this.getSavedVoucher();
    this.getProject();
    this.getCoa();
  
    // this.logo = this.globalData.Logo;
    // this.logo1 = this.globalData.Logo1;
    // this.CompanyName = this.globalData.CompanyName;
    // this.CompanyName2 = this.globalData.CompanyName2;
    // this.companyAddress = this.globalData.Address;
    // this.companyPhone = this.globalData.Phone;
    // this.companyMobileno = this.globalData.mobileNo;
    // this.companyEmail = this.globalData.Email;

    this.tableSize = this.globalData.paginationDefaultTalbeSize;
    this.tableSizes = this.globalData.paginationTableSizes;

    //  this.RoleID = this.globalData.getRoleId();
    
  }

 



  voucherTypes: any = [
    { type: 'CASH PAYMENT (CP)', value : 'CPV' },
    { type: 'CASH RECEIPT (CR)' ,value : 'CRV'},
    { type: 'BANK PAYMENT (BP)', value : 'BPV' },
    { type: 'BANK RECEIPT (BR)' ,value : 'BRV'},
    { type: 'Journal Voucher (JV)' ,value : 'JV'}
  ]

  

  logo:any;
  logo1:any;
  CompanyName :any;
   CompanyName2:any;
   companyAddress :any;
   companyPhone :any;
   companyMobileno:any;
   companyEmail:any;
   
  

  /////////////////declared Variables//////////////////////
  cash = 'Cash';
  coaSearch = '';
  txtSearch: string = '';
  invoiceNo:any;
  vType: any;
  transactionType: any = 'Cash';
  invoiceDate:Date = new Date();
  refrenceCOA: any = 0;
  projectID:any;
  partyID: any ;
  COATitleID: any ;
  DebitAmount: any = 0 ;
  CreditAmount: any = 0 ;
  detailNarration:any;
  VoucherData: any = [];
  bankReceiptNo:any = '';
  invoiceDetails:any = [];
  VoucherDocument :any;

  
  debittotal :number = 0;
  creditTotal :number = 0;
  COA: any = [];
  narration='';

 //////////////// print Variables/////////////////////

 lblInvoiceNo:any;
 lblInvoiceDate:any;
 lblRemarks:any;
 lblVoucherType:any;
 lblProjectName:any;
 lblVoucherTable:any;
 lblDebitTotal:any;
 lblCreditTotal:any;
 lblVoucherPrintDate = new Date();


  //////////////////////////////////////////////

  SavedVoucherData:any=[];
  partyList:any;
  CoaList:any;
  refCoaList:any;
  projectList:any = [];


  
  
  getProject(){
    this.http.get(environment.mainApi+'cmp/getproject').subscribe(
      (Response:any)=>{
        this.projectList = Response;
       // console.log(Response);
      
      }
    )
  }
 

  //////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////will change the debit and credit field value if ///////////////////////////
  ////////////////////// value is in minue ///////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////

  changeValue(val: any) {
   this.globalData.avoidMinus(val);
  }


  //////////////////////////

  getTotal(){
    this.debittotal = 0;
    this.creditTotal = 0;
    // this.VoucherData.forEach((a:any) => this.debittotal +=parseFloat(a.vDebit) );
    // this.VoucherData.forEach((a:any) => this.creditTotal +=parseFloat( a.vCredit)  );
    for (var i = 0; i < this.VoucherData.length; i++) {
      this.debittotal += parseFloat(this.VoucherData[i].Debit);
      this.creditTotal += parseFloat(this.VoucherData[i].Credit);
    }
  }

  // //////////save fuction to hold data in Voucher Data array/////////////

  save() {

    var titleRow = this.CoaList.find((obj:any)=> obj.coaID === this.COATitleID);
    // console.log(titleRow);

    // finding the value of coatitle in voucherdata array here
    const findValue = this.VoucherData.find((obj : any) => obj.COAID === this.COATitleID);
    if(this.COATitleID == '' || this.COATitleID == undefined){
      this.msg.WarnNotify('Select COA Head')
    }else if(this.detailNarration == '' || this.detailNarration == undefined){
      this.msg.WarnNotify('Enter the Head Narration')
    }else if(findValue != undefined){
      if(findValue.COAID == this.COATitleID){
        this.msg.WarnNotify('Title Already Exists!');
      } 
    }else if(this.DebitAmount > 0 && this.CreditAmount > 0 )
    {

      this.msg.WarnNotify('One Side must be Zero')

    }else if(this.DebitAmount == 0 && this.CreditAmount == 0){
      this.msg.WarnNotify('One Side Must Be Entered')
    }
    else {
      this.VoucherData.push({ COAID: this.COATitleID ,title:titleRow.coaTitle, Debit:this.DebitAmount, Credit: this.CreditAmount,DetailNarration:this.detailNarration }); 
      this.getTotal();
      $('#cTitle').trigger('focus');
      this.COATitleID = '';
      titleRow = '';
      this.DebitAmount = 0;
      this.CreditAmount = 0;
      this.detailNarration = '';   
    }
   
  }



  /////////////////////// to Delete the row from voucher Data /////////////////////

  deleteRow(item: any) {
    var index = this.VoucherData.indexOf(item);
    this.VoucherData.splice(index,1);
    this.getTotal();
    // this.getTotal();
  }


  /////////////////////////////////////////////////////////////////////

  getSavedVoucher(){
   
    this.http.get(environment.mainApi+this.globalData.accountLink+'GetSavedVoucherDetail').subscribe(
      (Response:any)=>{
      //  console.log(Response);
        this.SavedVoucherData = Response;
        this.loadingBar = 'stop';
       
       
      },
      (error:any)=>{
        console.log(error)
        this.msg.WarnNotify('Error Occured While Retreiving Data');
        this.loadingBar = 'stop';
       
      }
    )
  }


 

  ///////////////////////////////////////////////////////////

  getParty(){
    this.http.get(environment.mainApi+this.globalData.accountLink+'GetVoucherParty').subscribe(
      (Response)=>{
        // console.log(Response);
        this.partyList = Response;
      },
      (Error)=>{
        console.log(Error);
      }
    )
  }


  ////////////////////////////////////////////////////////////


  getCoa(){
    this.http.get(environment.mainApi+this.globalData.accountLink+'GetVoucherCOA').subscribe(
      (Response)=>{
        // console.log(Response);
        this.CoaList = Response;
      }
    )
  }

  ////////////////////////////////////////////

  getRefCoa(){
    this.http.get(environment.mainApi+this.globalData.accountLink+'GetVoucherCBCOA?type='+this.vType).subscribe(
      (Response)=>{
        this.refCoaList = Response;
      },
      (Error)=>{
        //console.log(Error);
      }
    )
  }

  ///////////////////////////////////////////////////////////

  insertVoucher(){
    
    
    if(this.vType == '' || this.vType == undefined){
      this.msg.WarnNotify('Select Voucher Type')
    }else if(this.VoucherData == ''){
      this.msg.WarnNotify('Data Table is Empty');
    }else if(this.refrenceCOA == 0 && (this.vType == 'CPV' || this.vType == 'CRV'  || this.vType == 'BPV' || this.vType == 'BRV')){
      this.msg.WarnNotify('Select Refrence Chart of Account')
    } else if(this.vType == 'JV' && this.creditTotal != this.debittotal){
      this.msg.WarnNotify('Debit And Credit Total Side Must Be Equal')
    } else if(this.projectID == ''|| this.projectID == undefined){
      this.msg.WarnNotify('Select Project')
    }
    else{

        
      if(this.narration == '' || this.narration == undefined){
        this.narration = '-';
      }

      if(this.VoucherDocument == '' || this.VoucherDocument == undefined){
        this.VoucherDocument = '-';
      }

      
   

      this.app.startLoaderDark();  ///////////// will start the loader
      this.http.post(environment.mainApi+this.globalData.accountLink+'InsertVoucher',{
        InvoiceDate: this.globalData.dateFormater(this.invoiceDate,'-'),
        RefCOAID: this.refrenceCOA,
        Type: this.vType,
        InvoiceRemarks: this.narration,
        ProjectID:this.projectID,
        BankReceiptNo: this.bankReceiptNo,
        VoucherDocument :this.VoucherDocument,
        InvoiceDetail: JSON.stringify(this.VoucherData),
        UserID: this.globalData.getUserID(),
      }).subscribe(
        (Response:any)=>{
          // console.log(Response);
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.reset();
            this.getSavedVoucher();
            

            /////////////////////////will print The invoice after SAve///////////////
            setTimeout(() => {
              this.printAfterSave(Response.invNo);  
            }, 1000);
            this.app.stopLoaderDark();
            
          }else{
            this.msg.WarnNotify(Response.msg);
            this.app.stopLoaderDark();
          }
          
        },
        (Error)=>{
          this.app.stopLoaderDark();
          this.msg.WarnNotify('Error Occured');
        }
      )
    }
    
  }



  //////////////////////////////////////////////////////////


  insertDocument(row:any){
    this.invoiceNo = row.invoiceNo;
    
  }

  insertVoucherDocument(){
    this.globalData.openPinCode().subscribe(pin=>{
    if(pin != ''){
      this.http.post(environment.mainApi+this.globalData.accountLink+'AddVoucherDocument',{
     
        InvoiceNo: this.invoiceNo,
        VoucherDocument:this.VoucherDocument,
        PinCode: pin,
         UserID: this.globalData.getUserID(),
        
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.reset();
        }else{
          this.msg.WarnNotify(Response.msg);
        }
      }
    )
    }
  })
  }


  onDocSelected(event:any) {

  
    if(this.globalData.getExtension(event.target.value) == 'pdf'){
    let targetEvent = event.target;

    let file:File = targetEvent.files[0];

    let fileReader:FileReader = new FileReader();


    fileReader.onload =(e)=>{
      this.VoucherDocument = fileReader.result;
    }

    fileReader.readAsDataURL(file);

    }else{
      this.msg.WarnNotify('File Must Be pdf Only');
      event.target.value = '';
      this.VoucherDocument = '';
    }
  


  //console.log(this.imageFile);
}


downloadVoucherDocument(row:any){
  var vdoc = row.voucherDocument;
  // console.log(vdoc);
    
  var newImage = vdoc.replace('data:application/pdf;base64,','');

   const byteArray = new Uint8Array(atob(newImage).split('').map(char=> char.charCodeAt(0)));

   const file = new Blob([byteArray], {type:'application/pdf'});

   const fileURl = URL.createObjectURL(file);

   let fileName =  row.invoiceNo;
   let link = document.createElement('a');
   link.download = fileName;
   link.target = '_blank';
   link.href = fileURl;
   
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);



 }


  //////////////////////////////////////////////

  DeleteVoucher(row:any){


    this.globalData.openPinCode().subscribe(pin=>{
      if(pin!= ''){

        //////on confirm button pressed the api will run
        this.http.post(environment.mainApi+this.globalData.accountLink+'DeleteVoucher',{
          InvoiceNo: row.invoiceNo,
          PinCode:pin,
          UserID: this.globalData.getUserID(),
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getSavedVoucher();
            }else{
              this.msg.WarnNotify(Response.msg);
            }
          }
        ) 
      
    

  }})

   
  }


  ////////////////////////////////////////////////

  approveBill(row:any){

    this.globalData.openPinCode().subscribe(pin=>{
      if(pin!= ''){
        Swal.fire({
          title:'Alert!',
          text:'Confirm To Approve Invoice',
          position:'center',
          icon:'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
        }).then((result)=>{
          if(result.isConfirmed){
    
            //////on confirm button pressed the api will run
            this.http.post(environment.mainApi+this.globalData.accountLink+'ApproveVoucher',{
              InvoiceNo: row.invoiceNo,
              PinCode:pin,
            UserID: this.globalData.getUserID(),
            }).subscribe(
              (Response:any)=>{
                // console.log(Response.msg);
                if(Response.msg == 'Voucher Approved Successfully'){
                  this.msg.SuccessNotify(Response.msg);
                  this.getSavedVoucher();
                }else{
                  this.msg.WarnNotify(Response.msg);
                }
                
              }
            )
          }
        });
      }
    })


   
  }



  ///////////////////////////////////////////////////

  printBill(row:any){

    
    this.lblInvoiceNo = row.invoiceNo;
    this.lblInvoiceDate = row.invoiceDate;
    this.lblRemarks = row.invoiceRemarks;
    this.lblVoucherType = row.type;
    this.lblProjectName = row.projectTitle;
    this.getInvoiceDetail(row.invoiceNo);
    

    
      setTimeout(() => {
        if(this.invoiceDetails != ''){
          this.globalData.printData('#InvociePrint');
        }else{
          this.msg.WarnNotify('Error Occured While Printing');
        }
      }, 500);

    
  

    
  }

  /////////////////////////////////////////////////////////////


  printAfterSave(invoiceNo:any){

     this.getSavedVoucher();
    //console.log(this.SavedVoucherData);
    
    var curRow = this.SavedVoucherData.find((obj:any)=> obj.invoiceNo ===  invoiceNo );
    // console.log(curRow);

    this.lblInvoiceNo = curRow.invoiceNo;
    this.lblInvoiceDate = curRow.invoiceDate;
    this.lblRemarks = curRow.invoiceRemarks;
    this.lblVoucherType = curRow.type;
    this.lblProjectName = curRow.projectTitle;

    this.getInvoiceDetail(invoiceNo);

     setTimeout(() => {
      if(this.invoiceDetails != ''){
      
        this.globalData.printData('#afterSavePrint');
   
     }
     }, 1000);
    
   
   }


  /////////////////////////////////////////////

  getInvoiceDetail(invoiceNo:any){

    this.lblDebitTotal = 0;
    this.lblCreditTotal = 0;
    this.invoiceDetails = [];

    
    this.http.get(environment.mainApi+this.globalData.accountLink+'GetSpecificVocherDetail?InvoiceNo='+invoiceNo).subscribe(
      (Response:any)=>{
        // console.log(Response);
        this.invoiceDetails = Response;
        if(Response != ''){
         
          Response.forEach((e:any) => {
            this.lblDebitTotal += e.debit;
            this.lblCreditTotal += e.credit;
          });
        }
      },
      (error:any)=>{
        console.log(error);
        this.msg.WarnNotify('Error Occured While Printing');
      }
    )
  }



  VoucherDetails(row:any){
    this.dialogue.open(VoucherDetailsComponent,{
      width:"40%",
      data:row,
    }).afterClosed().subscribe(val=>{
      
    })
  }


  ////////////////////////////////////////////////////////
  reset(){
    this.vType = '';
    this.invoiceDate = new Date();
    this.refrenceCOA = 0;
    this.refCoaList = [];
    this.bankReceiptNo = '';
    this.COATitleID = '';
    this.DebitAmount = 0;
    this.CreditAmount = 0;
    this.VoucherData = [];
    this.debittotal = 0;
    this.creditTotal = 0;
    this.narration = '';
    this.invoiceNo = '';
    this.VoucherDocument = '';
    $('#vDoc').val('');
  }





}
