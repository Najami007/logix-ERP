import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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


    
 projectList:any = [];
 crudList:any = {c:true,r:true,u:true,d:true};



  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private global:GlobalDataModule,
    private route:Router
  ){
    
    // this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe(
    //   (Response:any)=>{
    //     this.companyProfile = Response;
    //     //console.log(Response)  
        
    //   }
    // )

    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })

  }


  ngOnInit(): void {
   
    this.global.setHeaderTitle('Budget Report');
    this.getProject();
 

  }


  budgetMonth :any = new Date();

  reportData:any;
  TotalAmount:any = 0;
  totalConsumedAmount:any = 0;
  companyProfile:any = [];
  projectSearch:any;
  projectID:number = 0; 
  projectName:any;
  
  
  // getCrud(){
  //   this.http.get(environment.mainApi+'user/getusermenu?userid='+this.global.getUserID()+'&moduleid='+this.global.getModuleID()).subscribe(
  //     (Response:any)=>{
  //       this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
  //     }
  //   )
  // }
 



 

  getProject(){

    this.global.getProjectList().subscribe((data: any) => { this.projectList = data; });

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

    this.http.get(environment.mainApi+this.global.accountLink+'GetMonthlyBudget?BudgetDate='+this.global.dateFormater(this.budgetMonth,'-')+'&projectid='+this.projectID).subscribe(
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

