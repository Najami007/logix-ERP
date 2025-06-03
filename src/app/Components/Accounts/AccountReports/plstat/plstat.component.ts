import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import * as $ from 'jquery'
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-plstat',
  templateUrl: './plstat.component.html',
  styleUrls: ['./plstat.component.scss']
})
export class PLStatComponent implements OnInit {



  crudList:any = {c:true,r:true,u:true,d:true};
   companyProfile:any = [];


  constructor(private globalData: GlobalDataModule,
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private route:Router,
    private datePipe:DatePipe
    
    ){
      // this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe(
      //   (Response:any)=>{
      //     this.companyProfile = Response;
      //   }
      // )

      this.globalData.getCompany().subscribe((data)=>{
        this.companyProfile = data;
      });

      this.globalData.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      })

    
    }
  ngOnInit(): void {
    this.globalData.setHeaderTitle('Profit & Loss Statement');
    this.globalData.getCompany();
    this.getProject();
   

    $('#printDiv').hide();
  }


  fromDate: any = new Date();
  toDate: any = new Date();

  IncomeData:any;
  ExpenseData:any;

  incDebitTotal = 0;
  incCreditTotal = 0;

  expDebitTotal = 0;
  expCreditTotal = 0;
  projectSearch:any;
  projectID:number = 0;
  projectName:any;
  projectList:any = [];


getProject(){

  this.globalData.getProjectList().subscribe((data: any) => { this.projectList = data; });

}
 


  getReport(reqFunc:any,param:any){

    if(this.projectID == 0 && param == 'project'){
      this.msg.WarnNotify('Select Project');

    }else{
      this.projectName = '';

      if(param == 'all'){
        this.projectID = 0;
      }


      if(this.projectID != 0){
        this.projectName = this.projectList.find((e:any)=> e.projectID == this.projectID).projectTitle;
      }
      

      
    this.incDebitTotal = 0;
    this.incCreditTotal = 0;
    this.expDebitTotal = 0;
    this.expCreditTotal = 0;
    this.app.startLoaderDark();
    
    this.IncomeData = [];
    this.ExpenseData = [];


    if(reqFunc == 'R1'){
      this.http.get(environment.mainApi+this.globalData.accountLink+'GetProfitRpt?fromdate='+this.globalData.dateFormater(this.fromDate,'-')+'&todate='
      +this.globalData.dateFormater(this.toDate,'-')+'&projectid='+this.projectID).subscribe(
        (Response)=>{
         
          $('#printDiv').show();
         
          
          this.IncomeData = Response;

          this.incDebitTotal = 0;
          this.incCreditTotal = 0;
          this.IncomeData.forEach((e:any) => {
            this.incDebitTotal += e.debit;
            this.incCreditTotal += e.credit;
      
          });
      

          this.app.stopLoaderDark();
          
  
        },
        (Error)=>{
          this.msg.WarnNotify('Error occured While Loading Expense');
          this.app.stopLoaderDark();
        }
      )
    }

    if(reqFunc == 'R2'){
      this.http.get(environment.mainApi+this.globalData.accountLink+'GetProfitDetailRpt?fromdate='+this.globalData.dateFormater(this.fromDate,'-')+'&todate='
      +this.globalData.dateFormater(this.toDate,'-')+'&projectid='+this.projectID).subscribe(
        (Response)=>{
        
         
          $('#printDiv').show();
        
          this.IncomeData = Response;
          this.incDebitTotal = 0;
          this.incCreditTotal = 0;
          this.IncomeData.forEach((e:any) => {
            this.incDebitTotal += e.debit;
            this.incCreditTotal += e.credit;
      
          });
          this.app.stopLoaderDark();
          
  
        },
        (Error)=>{
          this.msg.WarnNotify('Error occured While Loading Expense');
          this.app.stopLoaderDark();
        }
      )
    }

    
    this.http.get(environment.mainApi+this.globalData.accountLink+'GetLossRpt?fromdate='+this.globalData.dateFormater(this.fromDate,'-')+'&todate='
    +this.globalData.dateFormater(this.toDate,'-')+'&projectid='+this.projectID).subscribe(
      (Response)=>{

        this.ExpenseData = Response;
     

        this.expDebitTotal = 0;
        this.expCreditTotal = 0;
        this.ExpenseData.forEach((e:any) => {
          this.expDebitTotal += e.debit;
          this.expCreditTotal += e.credit;
    
        });


        this.app.stopLoaderDark();
        $('#printDiv').show();
      },
      (Error)=>{
        this.msg.WarnNotify('Error occured While Loading Income')
        this.app.stopLoaderDark();
      }
    )


    }
  
  }
  

  

  PrintTable() {
 
   setTimeout(() => {
    this.globalData.printData('#printDiv');
   }, 200);
  }

  export(){
     var startDate = this.datePipe.transform(this.fromDate,'dd/MM/yyyy');
    var endDate = this.datePipe.transform(this.toDate,'dd/MM/yyyy');
    this.globalData.ExportHTMLTabletoExcel('printDiv','P&L '+'(' + startDate + ' - ' + endDate +')')
  }
}
