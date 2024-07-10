import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { SharedServicesDataModule } from 'src/app/Shared/helper/shared-services-data/shared-services-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-file-ownership',
  templateUrl: './file-ownership.component.html',
  styleUrls: ['./file-ownership.component.scss']
})
export class FileOwnershipComponent {


  companyProfile:any = [];
  crudList:any = {c:true,r:true,u:true,d:true};

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router,
    private dataService:SharedServicesDataModule,
    
    ){
     

      this.globaldata.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      });

      this.globaldata.getCompany().subscribe((data)=>{
        this.companyProfile = data;
      });

    }

    
    ngOnInit(): void {
      this.globaldata.setHeaderTitle('File Ownership');
     
    }


    tblSearch:any;
    tableData:any = [];

    FileID = 0;
    spType = '';
    UserID = 0;
    PartyID = 0;
    AllotmentDate = '';
    FosDescription = '';
    ReferredBy = '';
    PlotBookingTypeID = 0;
    PaymentPlanID = 0;
    PaymentPlanDetail = '';
    dtpAllotmentDate = '';



    fileList:any = [];
    partyList:any = [];
    referredList:any = [];
    bookingList:any = [];
    paymentList:any = [];

    cmbInstallment:any;
    txtAmount:any;
    dtpDueDate:any;


    installmentList:any = [];

    paymentDetailList:any = [];

    lblFile:any;
    lblParty:any;
    lblTotal = 0;
    paymentPlanDetailList:any = [];

    addPaymentPlan(){

    }


   
    remove(index: any) {
      this.paymentDetailList.splice(index, 1);
      if (this.paymentDetailList.length > 0) {
        this.lblTotal = 0;
        for (let i = 0; i < this.paymentDetailList.length; i++) {
          this.lblTotal += this.paymentDetailList[i].amount;
        }
      }
    }
    




    getPaymentDetail(item:any){

    }


    printData(item:any){

    }


 

  }