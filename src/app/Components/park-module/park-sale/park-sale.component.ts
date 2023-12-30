import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import * as $ from 'jquery';

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
    private route:Router
  ){
    // this.global.getCompany().subscribe((data)=>{
    //   this.companyProfile = data;
    // });

    // this.global.getMenuList().subscribe((data)=>{
    //   this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    // })
  }

  
  ngOnInit(): void {
    this.global.setHeaderTitle('Sale'); 
    this.getSwing();
   
   
   
    
  }



  curDateTime = new Date();

  searchSwing:any;
  tableData:any = [];


  TicketQty:any;
  ticketRemarks:any;
  TicketDetails:any = [];

  swingsList:any = [];
  printDetails:any = [];


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
      if(this.TicketDetails == ""){
        this.TicketDetails.push({swingID:item.swingID,TicketQuantity:1,TicketPrice:item.ticketPrice});
      }else{
        this.TicketDetails = [];
        this.TicketDetails.push({swingID:item.swingID,TicketQuantity:1,TicketPrice:item.ticketPrice});
      }
 
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






  save(){
    // if(this.TicketQty == '' || this.TicketQty == undefined || this.TicketQty == 0){
    //   this.msg.WarnNotify('Enter Ticket Qty')
    // }else 
    if(this.ticketRemarks == '' || this.ticketRemarks == undefined){
      this.msg.WarnNotify('Enter Ticket Remarks')
    }else {
      this.app.startLoaderDark();

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
            this.printTicket(Response.tktNo);
            // console.log(Response);
            this.app.stopLoaderDark();
          }else {
            this.msg.WarnNotify(Response.msg)
          }
        
        }
      )
    }

  
  }


  printTicket(ticketNo:any){

    this.http.get(environment.mainApi+'park/PrintTicket?ticketno='+ticketNo).subscribe(
      (Response:any)=>{
       this.printDetails = Response;
      //  console.log(Response);

       setTimeout(() => {
        this.global.printData('#ticketPrint');
       }, 100);
      }
    )

  }





 
}
