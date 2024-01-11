import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import * as $ from 'jquery';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import { NumberInputComponent } from '../../Common/number-input/number-input.component';

@Component({
  selector: 'app-park-sale',
  templateUrl: './park-sale.component.html',
  styleUrls: ['./park-sale.component.scss']
})
export class ParkSaleComponent {
  



  crudList:any = [];
  companyProfile:any = [];

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    public global:GlobalDataModule,
    private dialogue:MatDialog,
    private route:Router,
   
  ){
    // this.global.getCompany().subscribe((data)=>{
    //   this.companyProfile = data;
    // });

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })
  }

  
  ngOnInit(): void {
    this.global.setHeaderTitle('Sale'); 
    this.getSwing();
   
   
   
    
  }
  tempTicketNo:number = 0;
  billType:any = 'Sale';
  billSearch:any;
  curDateTime = new Date();
  TicketDate:any = new Date();
  searchSwing:any;
  tableData:any = [];


  TicketQty:any;
  ticketRemarks:any = '-';
  TicketDetails:any = [];

  swingsList:any = [];
  printDetails:any = [];
  TicketsList:any = [];
  printType:any;
  billDetail:any;

  ///////////////////////////////////////////////////////////////


  getSwing(){
    this.http.get(environment.mainApi+'park/GetActiveSwing').subscribe(
      (Response)=>{

        this.swingsList = Response;

      }
    )
  }





  ///////////////////////////////////////////////////////////////

  onSwingSelected(item:any){
    this.printDetails = [];
    this.printType = '';
    this.tempTicketNo = 0;
    this.TicketDetails = [];
    this.billType = 'Sale';
    this.billDetail = [];
    this.TicketDetails.push({swingID:item.swingID,swingTitle:item.swingTitle,TicketQuantity:1,TicketPrice:item.ticketPrice});

  }



  ///////////////////////////////////////////////////////////////

  changeQty(type:any,index:any){
  
    if(type == 'add'){

      this.TicketDetails[index].TicketQuantity += 1;

    }
    if(type == 'minus'){
      if( this.TicketDetails[index].TicketQuantity > 1){
        this.TicketDetails[index].TicketQuantity -= 1;
      }
    }
  

  }


 


///////////////////////////////////////////////////////////////

findTickets(){
  this.app.startLoaderDark();
  this.http.get(environment.mainApi+'park/GetTicketSummarySingleDate?ToDate='+this.global.dateFormater(this.TicketDate,'-')).subscribe(
    (Response:any)=>{
     console.log(Response);
      this.TicketsList = Response;
      this.app.stopLoaderDark();
    }
  )
}




  save(){
  
  
    
    if(this.ticketRemarks == '' || this.ticketRemarks == undefined){
      this.msg.WarnNotify('Enter Ticket Remarks')
    }else if(this.tempTicketNo == 0 && this.billType == 'SaleReturn'){
      this.msg.WarnNotify('Ticket No is Empty');
    } 
    else {
      this.app.startLoaderDark();

    if(this.billType == 'Sale'){
  
      this.http.post(environment.mainApi+'park/InsertTicket',{
        TicketDate: this.curDateTime,
        Type: "S",
        TicketRemarks: this.ticketRemarks,
        ProjectID: 6,
        TicketDetail: JSON.stringify(this.TicketDetails),
        UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify('Ticket Saved')
            this.printTicket(Response.tktNo,'save');
            console.log(Response);
            this.reset();
            this.app.stopLoaderDark();
          }else {
            this.msg.WarnNotify(Response.msg)
          }
        
        }
      )
    }else if(this.billType == 'SaleReturn'){
     
      if(this.TicketDetails[0].TicketQuantity > (this.billDetail[0].ticketQuantity - this.billDetail[0].rtnQuantity)){
        this.msg.WarnNotify('Entered Quantity is more than bill Quantity');
        this.app.stopLoaderDark();
      }else{
    
        this.http.post(environment.mainApi+'park/InsertReturnTicket',{
          TicketNo:this.tempTicketNo,
          TicketDate: this.curDateTime,
          Type: "SR",
          TicketRemarks: this.ticketRemarks,
          ProjectID: 6,
          TicketDetail: JSON.stringify(this.TicketDetails),
          UserID: this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Saved Successfully'){
              this.msg.SuccessNotify('Return Ticket Saved')
             setTimeout(() => {
              this.printTicket(Response.tktNo,'save');
             }, 100);
              setTimeout(() => {
                this.printTicket(Response.rtnTktNo,'SaleReturn');
              }, 200);
              console.log(Response);
              this.reset();
              this.app.stopLoaderDark();
              
            }else {
              this.msg.WarnNotify(Response.msg)
            }
          
          }
        )
      }
      
      
    }
    }

  
  }


  printTicket(ticketNo:any,type:any){
    this.billDetail =[];
    this.printDetails = [];
      this.printType = type;


    this.http.get(environment.mainApi+'park/PrintTicket?ticketno='+ticketNo).subscribe(
      (Response:any)=>{
       
       if(type == 'detail'){
        this.billDetail = Response;
       }else{
        this.printDetails = Response;
       }
      //  console.log(Response);

      if(type != 'detail'){
        setTimeout(() => {
          this.global.printData('#ticketPrint');
         }, 100);
      }
      }
      
    )

    

  }



  verifyRtn(row:any){
    this.TicketDetails= [];
   
    this.http.get(environment.mainApi+'park/VerifyRtnQty?ticketno='+row.ticketNo+'&SwingID='+row.swingID).subscribe(
      (Response:any)=>{
        this.billDetail = Response;
        this.TicketDetails.push({swingID:row.swingID,swingTitle:row.swingTitle,TicketQuantity:1,TicketPrice:Response[0].ticketPrice});
        this.billType = 'SaleReturn';
        this.tempTicketNo = Response[0].ticketNo;
        // console.log(Response);
      }
    )
  }
 

  insertReturn(){
   
  }



reset(){
  this.printDetails = [];
  this.printType = '';
  this.tempTicketNo = 0;
  this.TicketDetails = [];
  this.billType = 'Sale';
  this.billDetail = [];


}



 
}
