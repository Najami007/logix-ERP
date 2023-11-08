import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { VoucherDetailsComponent } from '../voucher/voucher-details/voucher-details.component';


@Component({
  selector: 'app-day-transaction',
  templateUrl: './day-transaction.component.html',
  styleUrls: ['./day-transaction.component.scss']
})
export class DayTransactionComponent implements OnInit{

  constructor(
    private http:HttpClient,
    private global:GlobalDataModule,
    private app:AppComponent,
    private msg:NotificationService,
    private dialogue:MatDialog
  ){
    this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe(
      (Response:any)=>{
        this.companyProfile = Response;
        //console.log(Response)  
        
      }
    )
  
  }
  

   
  
  
  
    ngOnInit(): void {
  
      this.global.setHeaderTitle('Transaction Report');
      this.getProject();
     
  
  
  
    }
  
    fromDate:Date = new Date();
    toDate:Date = new Date();
    companyProfile:any = [];
    projectSearch:any;
    coaID:any;
    projectID:number = 0;
    projectName:any;
  
    lblDebitTotal:any;
    lblCreditTotal:any;
    invoiceDetails:any;
    reportData:any;
  


    projectList:any = [];




 
    getProject(){
      this.http.get(environment.mainApi+'cmp/getproject').subscribe(
        (Response:any)=>{
          this.projectList = Response;
        }
      )
    }
  
    getReport(param:any){
      if(this.projectID == 0 && param == 'project'){
        this.msg.WarnNotify('Select Project')
      }else{


        this.projectName = '';
        if(this.projectID != 0 && param == 'project' ){
          this.projectName = this.projectList.find((e:any)=> e.projectID == this.projectID).projectTitle;
        }

        this.app.startLoaderDark();
        this.http.get(environment.mainApi+'acc/GetDayTransaction?FromDate='+this.global.dateFormater(this.fromDate,'-')+
        '&ToDate='+this.global.dateFormater(this.toDate,'-')).subscribe(
          (Response:any)=>{
            //console.log(Response);
            if(param == 'all'){
              this.reportData = Response;
            }

            if(param == 'project'){
              this.reportData = Response.filter((e:any)=>e.projectID == this.projectID);
            }

            this.app.stopLoaderDark();
          },
          (Error:any)=>{
            this.msg.WarnNotify('Error Occured');
            this.app.stopLoaderDark();
          }
        )
      }
  
    }
    
  
  
  
    ///////////////////////////////////////////////////
  
    PrintTable(){
      this.global.printData('#printRpt');
      
    }



    VoucherDetails(row:any){
      this.dialogue.open(VoucherDetailsComponent,{
        width:"40%",
        data:row,
      }).afterClosed().subscribe(val=>{
        
      })
    }
  
  
  
  }
  
