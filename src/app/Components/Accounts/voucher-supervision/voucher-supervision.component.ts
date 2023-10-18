import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-voucher-supervision',
  templateUrl: './voucher-supervision.component.html',
  styleUrls: ['./voucher-supervision.component.scss']
})
export class VoucherSupervisionComponent {

  pBillNo: any;
  pBillDate: any;
  pShopName: any;
  pCustomername: any;
  TotalCharges: any;
  billRemarks: any;
  tableData: any;


  logo:any;
  logo1:any;
  CompanyName :any;
   CompanyName2:any;
   companyAddress :any;
   companyPhone :any;
   companyMobileno:any;
   companyEmail:any;

  constructor(
    private http:HttpClient,
    private globalData:GlobalDataModule,
    private msg:NotificationService,
    private dialogue:MatDialog,
    private app:AppComponent
    
  ){}


  ngOnInit(): void {
    this.globalData.setHeaderTitle('Voucher Supervision');
    this.logo = this.globalData.Logo;
    this.logo1 = this.globalData.Logo1;
    this.CompanyName = this.globalData.CompanyName;
    this.CompanyName2 = this.globalData.CompanyName2;
    this.companyAddress = this.globalData.Address;
    this.companyPhone = this.globalData.Phone;
    this.companyMobileno = this.globalData.mobileNo;
    this.companyEmail = this.globalData.Email;
  
  }

  fromDate = new Date();
  toDate = new Date();


  voucherList:any = [];

  ////////////////////////////////////

  lblDebitTotal = 0;
  lblCreditTotal=0;
  invoiceDetails:any;

  lblInvoiceNo:any;
  lblInvoiceDate:any;
  lblRemarks:any

  /////////////////////////////////////

  getVouchers(){
    this.voucherList = [];
    this.app.startLoaderDark();
      this.http.get(environment.mainApi+'GetSavedVoucherDetailDateWise?fromdate='+this.globalData.dateFormater(this.fromDate,'-')+
      '&todate='+this.globalData.dateFormater(this.toDate,'-')).subscribe(
        (Response:any)=>{
        
          this.voucherList = Response;
          this.app.stopLoaderDark();
        },
        (Error:any)=>{
          this.app.stopLoaderDark();
        }
      )
  }

  




  /////////////////////////////////////////////

  getInvoiceDetail(invoiceNo:any){

    this.lblDebitTotal = 0;
    this.lblCreditTotal = 0;
    this.invoiceDetails = [];

    
    this.http.get(environment.mainApi+'GetSpecificVocherDetail?InvoiceNo='+invoiceNo).subscribe(
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


///////////////// will temorarily delete the row from array /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////// 


  delRow(item: any) {
    var index = this.voucherList.indexOf(item);
    this.voucherList.splice(index, 1);
   
  }

   ////////////////////////////////////////////////

  approveBill(row:any){

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
        this.http.post(environment.mainApi+'ApproveVoucher',{
          InvoiceNo: row.invoiceNo,
        UserID: this.globalData.getUserID(),
        }).subscribe(
          (Response:any)=>{
            // console.log(Response.msg);
            if(Response.msg == 'Voucher Approved Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.delRow(row);
            }else{
              this.msg.WarnNotify(Response.msg);
            }
            
          }
        )
      }
    });


   
  }


  //////////////////////////////////////////////

  DeleteVoucher(row:any){

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
        this.http.post(environment.mainApi+'DeleteVoucher',{
          InvoiceNo: row.invoiceNo,
          UserID: this.globalData.getUserID(),
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.delRow(row);
            }else{
              this.msg.WarnNotify(Response.msg);
            }
          }
        ) 
      }
    });

   
  }


   ///////////////////////////////////////////////////

   printBill(row:any){

    
    this.lblInvoiceNo = row.invoiceNo;
    this.lblInvoiceDate = row.invoiceDate;
    this.lblRemarks = row.invoiceRemarks;

    this.getInvoiceDetail(row.invoiceNo);
    

    
      setTimeout(() => {
        if(this.invoiceDetails != ''){
          this.globalData.printData('#InvociePrint');
        }else{
          this.msg.WarnNotify('Error Occured While Printing');
        }
      }, 500);

    
  

    
  }

 




}
