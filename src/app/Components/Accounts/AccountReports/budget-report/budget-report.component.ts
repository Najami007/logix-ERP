import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-budget-report',
  templateUrl: './budget-report.component.html',
  styleUrls: ['./budget-report.component.scss']
})
export class BudgetReportComponent implements OnInit{

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private global:GlobalDataModule,
  ){
    
    this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe(
      (Response:any)=>{
        this.companyProfile = Response;
        //console.log(Response)  
        
      }
    )
  }


  ngOnInit(): void {
   
    this.global.setHeaderTitle('Budget Report');
    this.getProject();
    this.logo = this.global.Logo;
    this.logo1 = this.global.Logo1;
    this.CompanyName = this.global.CompanyName;
    this.CompanyName2 = this.global.CompanyName2;
    this.companyAddress = this.global.Address;
    this.companyPhone = this.global.Phone;
    this.companyMobileno = this.global.mobileNo;
    this.companyEmail = this.global.Email;

  }

  logo:any;
  logo1:any;
  CompanyName:any;
  CompanyName2:any;
   companyAddress :any;
   companyPhone :any;
   companyMobileno:any;
   companyEmail:any;
   

  budgetMonth :any = new Date();

  reportData:any;
  TotalAmount:any = 0;
  totalConsumedAmount:any = 0;
  companyProfile:any = [];
  projectSearch:any;
  projectID:number = 0;
  projectName:any;

  
 projectList:any = [];

 
 getProject(){
   this.http.get(environment.mainApi+'cmp/getproject').subscribe(
     (Response:any)=>{
       this.projectList = Response;
     }
   )
 }


  ////////////////////////////////////////////

  getReport(param:any){

    if(this.projectID == 0 && param == 'project'){
      this.msg.WarnNotify('Select Project')
    }else{


      this.projectName = '';
      if(param == 'all'){
      
        this.projectID = 0;
      }
      if(this.projectID != 0){
        this.projectName = this.projectList.find((e:any)=> e.projectID == this.projectID).projectTitle;
      }

      
    this.TotalAmount = 0;
    this.totalConsumedAmount = 0;

    this.http.get(environment.mainApi+'acc/GetMonthlyBudget?BudgetDate='+this.global.dateFormater(this.budgetMonth,'-')+'&projectid='+this.projectID).subscribe(
      (Response:any)=>{
        this.reportData = Response;

        Response.forEach((e:any) => {
          this.TotalAmount += e.budgetAmount;
          this.totalConsumedAmount += e.consumedAmount;

        });
      }
    )

    }


  }

  PrintTable(){

    this.global.printData('#printDiv');
  }

}

