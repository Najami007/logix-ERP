import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import * as $ from 'jquery'
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plstat',
  templateUrl: './plstat.component.html',
  styleUrls: ['./plstat.component.scss']
})
export class PLStatComponent implements OnInit {



   crudList:any = [];
   companyProfile:any = [];


  constructor(private globalData: GlobalDataModule,
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private route:Router
    
    ){
      this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe(
        (Response:any)=>{
          this.companyProfile = Response;
          //console.log(Response)  
          
        }
      )
    
    }
  ngOnInit(): void {
    this.globalData.setHeaderTitle('Profit & Loss Statement');
    this.getCrud();
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

  ////////////////////////////////////////////////////////////////





  
 getCrud(){
  this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globalData.getUserID()+'&moduleid='+this.globalData.getModuleID()).subscribe(
    (Response:any)=>{
      this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    }
  )
}






 
  getProject(){
    this.http.get(environment.mainApi+'cmp/getproject').subscribe(
      (Response:any)=>{
        this.projectList = Response;
      }
    )
  }
 


  // getIncomeTotal(){
  //   this.incDebitTotal = 0;
  //   this.incCreditTotal = 0;
  //   this.IncomeData.forEach((e:any) => {
  //     this.incDebitTotal += e.debit;
  //     this.incCreditTotal += e.credit;

  //   });

   
  // }
  // getExpenseTotal(){
  //   this.expDebitTotal = 0;
  //   this.expCreditTotal = 0;
  //   this.ExpenseData.forEach((e:any) => {
  //     this.expDebitTotal += e.debit;
  //     this.expCreditTotal += e.credit;

  //   });
  // }


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
      this.http.get(environment.mainApi+'acc/GetProfitRpt?fromdate='+this.globalData.dateFormater(this.fromDate,'-')+'&todate='
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
      this.http.get(environment.mainApi+'acc/GetProfitDetailRpt?fromdate='+this.globalData.dateFormater(this.fromDate,'-')+'&todate='
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

    
    this.http.get(environment.mainApi+'acc/GetLossRpt?fromdate='+this.globalData.dateFormater(this.fromDate,'-')+'&todate='
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
}
