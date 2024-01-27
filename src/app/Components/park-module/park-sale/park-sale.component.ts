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



  subTotal = 0;

  ///////////////////////////////////////////////////////////////


  getSwing(){
    this.http.get(environment.mainApi+this.global.parkLink+'GetActiveSwing').subscribe(
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
    // this.TicketDetails = [];
    this.billType = 'Sale';
    this.billDetail = [];

    var myIndex = this.TicketDetails.findIndex((e:any)=> e.swingID == item.swingID);
    // alert(myIndex)

    if(myIndex !== -1){
      // alert('alert')
      this.TicketDetails[myIndex].TicketQuantity += 1;
    }else{

      this.TicketDetails.push({swingID:item.swingID,swingTitle:item.swingTitle,TicketQuantity:1,TicketPrice:item.ticketPrice,SwingDuration:item.swingDuration});
    }

    this.getTotal();

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
  
    this.getTotal();
  }


 


///////////////////////////////////////////////////////////////

findTickets(){
  this.app.startLoaderDark();
  this.http.get(environment.mainApi+this.global.parkLink+'GetTicketSummarySingleDate?ToDate='+this.global.dateFormater(this.TicketDate,'-')).subscribe(
    (Response:any)=>{
    // console.log(Response);
      this.TicketsList = Response;
      this.app.stopLoaderDark();
    }
  )
}


getTotal(){

  this.subTotal = 0;
  this.TicketDetails.forEach((e:any) => {
    this.subTotal += e.TicketPrice * e.TicketQuantity;
  });

}


deleteRow(index:any){
this.TicketDetails.splice(index,1);
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
  
      this.http.post(environment.mainApi+this.global.parkLink+'InsertTicket',{
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
            //this.printTicket(Response.tktNo,'save');
            console.log(Response);
            this.reset();
           this.app.stopLoaderDark();
           this.printTicket('','save',Response.tktList);   
          //   Response.tktList.forEach((e:any) => {           
          //    setTimeout(() => {
          //     this.printTicket(e.ticketNo,'save',Response.tktList);   
          //    }, 200);
          //     alert(e.ticketNo);       
          // });

          }else {
            this.msg.WarnNotify(Response.msg);
            this.app.stopLoaderDark();
          }
        
        }
      )
    }else if(this.billType == 'SaleReturn'){
     
      if(this.TicketDetails[0].TicketQuantity > (this.billDetail[0].ticketQuantity - this.billDetail[0].rtnQuantity)){
        this.msg.WarnNotify('Entered Quantity is more than bill Quantity');
        this.app.stopLoaderDark();
      }else{
    
        this.http.post(environment.mainApi+this.global.parkLink+'InsertReturnTicket',{
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
              this.printTicket(Response.tktNo,'save','');
             }, 100);
              setTimeout(() => {
                this.printTicket(Response.rtnTktNo,'SaleReturn','');
              }, 200);
             // console.log(Response);
              this.reset();
              this.app.stopLoaderDark();
              
            }else {
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
          
          }
        )
      }
      
      
    }
    }

  
  }


  printTicket(ticketNo:any,type:any,tktList:any){
    this.billDetail =[];
    this.printDetails = [];
      this.printType = type;

      if(tktList == ''){
        this.http.get(environment.mainApi+this.global.parkLink+'PrintTicket?ticketno='+ticketNo).subscribe(
          (Response:any)=>{
         if(type == 'detail'){
            this.billDetail = Response;
           }else{
            this.printDetails = Response;
           }
          //  console.log(Response);
    
          if(type != 'detail'){
              this.global.printData('#ticketPrint');   
    
          }
          }
          
        )
    
      }else{
     
        tktList.forEach((e:any) => { 
         
         setTimeout(() => {
          alert(e.ticketNo);
            this.http.get(environment.mainApi+this.global.parkLink+'PrintTicket?ticketno='+e.ticketNo).subscribe(
              (Response:any)=>{
               
                this.printDetails = Response;
  
               
                  this.global.printData('#ticketPrint'); 
                 
              }  
            )
         }, 2000);
        
        });

      
      }


 
    

  }



  verifyRtn(row:any){
    this.TicketDetails= [];
   
    this.http.get(environment.mainApi+this.global.parkLink+'VerifyRtnQty?ticketno='+row.ticketNo+'&SwingID='+row.swingID).subscribe(
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
