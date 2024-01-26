import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { VoucherDetailsComponent } from '../voucher/voucher-details/voucher-details.component';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import { Router } from '@angular/router';

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



   companyProfile:any;
   crudList:any = [];

  constructor(
    private http:HttpClient,
    private globalData:GlobalDataModule,
    private msg:NotificationService,
    private dialogue:MatDialog,
    private app:AppComponent,
    private route:Router
    
  ){
    //this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe((Response:any)=>{this.companyProfile = Response});

    this.globalData.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });

    this.globalData.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })

  }


  ngOnInit(): void {
    this.globalData.setHeaderTitle('Voucher Supervision');
    this.getProject();

  
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
  lblProjectName:any;




  projectSearch:any;
  coaID:any;
  projectID:number = 0;
  projectName:any;


  projectList:any = [];



  // getCrud(){
  //   this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globalData.getUserID()+'&moduleid='+this.globalData.getModuleID()).subscribe(
  //     (Response:any)=>{
  //       this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
  //     }
  //   )
  // }



 
  getProject(){
    this.http.get(environment.mainApi+this.globalData.companyLink+'getproject').subscribe(
      (Response:any)=>{
        this.projectList = Response;
      }
    )
  }

  /////////////////////////////////////

  getVouchers(param:any){

    if(this.projectID == 0 && param == 'project'){
      this.msg.WarnNotify('Select Project')
    }else{


      this.projectName = '';
      if(this.projectID != 0){
        this.projectName = this.projectList.find((e:any)=> e.projectID == this.projectID).projectTitle;
      }



      this.voucherList = [];
    this.app.startLoaderDark();
      this.http.get(environment.mainApi+this.globalData.accountLink+'GetSavedVoucherDetailDateWise?fromdate='+this.globalData.dateFormater(this.fromDate,'-')+
      '&todate='+this.globalData.dateFormater(this.toDate,'-')).subscribe(
        (Response:any)=>{
          
          if(param == 'all'){
            this.voucherList = Response;

          }

          if(param == 'project'){
            this.voucherList = Response.filter((e:any)=>e.projectID == this.projectID);
          }
          this.app.stopLoaderDark();
        },
        (Error:any)=>{
          this.app.stopLoaderDark();
        }
      )

    }


    
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


///////////////// will temorarily delete the row from array /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////// 


  delRow(item: any) {
    var index = this.voucherList.indexOf(item);
    this.voucherList.splice(index, 1);
   
  }

   ////////////////////////////////////////////////

   approveBill(row:any){

    this.dialogue.open(PincodeComponent,{
      width:'30%',
    }).afterClosed().subscribe(pin=>{
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
                  this.delRow(row);
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


  //////////////////////////////////////////////

  DeleteVoucher(row:any){


    this.dialogue.open(PincodeComponent,{
      width:'30%',
    }).afterClosed().subscribe(pin=>{
      if(pin!= ''){
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
        this.http.post(environment.mainApi+this.globalData.accountLink+'DeleteVoucher',{
          InvoiceNo: row.invoiceNo,
          PinCode:pin,
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

  }})

   
  }


   ///////////////////////////////////////////////////

   printBill(row:any){

    
    this.lblInvoiceNo = row.invoiceNo;
    this.lblInvoiceDate = row.invoiceDate;
    this.lblRemarks = row.invoiceRemarks;
    this.lblProjectName = this.projectList.find((e:any)=>e.projectID == row.projectID).projectTitle;

    this.getInvoiceDetail(row.invoiceNo);
    

    
      setTimeout(() => {
        if(this.invoiceDetails != ''){
          this.globalData.printData('#InvociePrint');
        }else{
          this.msg.WarnNotify('Error Occured While Printing');
        }
      }, 500);

    
  

    
  }




  VoucherDetails(row:any){
    this.dialogue.open(VoucherDetailsComponent,{
      width:"40%",
      data:row,
    }).afterClosed().subscribe(val=>{
      
    })
  }


 




}
