import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss']
})
export class TrialBalanceComponent implements OnInit {


 
   crudList:any = [];

   companyProfile:any = [];


   
  constructor(private globalData: GlobalDataModule,
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private route:Router

    ) {
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
    this.globalData.getCompany();
    this.getProject();
    this.globalData.setHeaderTitle('Trial Balance');
    
    this.getNotes();

    $('#summary2').hide();
  }

  fromDate:any = new Date();
  toDate:any =  new Date();
  TrialBalanceData :any=[];

  oDebitTotal:any = 0;
  oCreditTotal:any = 0;
  debitTotal:any = 0;
  creditTotal:any = 0;
  cDebitTotal:any = 0;
  cCreditTotal:any = 0;

  notesList:any =[];

  projectSearch:any;

  projectID:number = 0;
  projectName:any;
  projectList:any = [];



  
//  getCrud(){
//   this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globalData.getUserID()+'&moduleid='+this.globalData.getModuleID()).subscribe(
//     (Response:any)=>{
//       this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
//     }
//   )
// }

  

 
  getProject(){
    this.http.get(environment.mainApi+'cmp/getproject').subscribe(
      (Response:any)=>{
        this.projectList = Response;
      }
    )
  }
 


  getTrialBalance(param:any){
  if(this.projectID == 0 && param == 'project'){
    this.msg.WarnNotify('Select Project')
  }else{
    this.getNotes();
    this.projectName = '';

    if(param == 'all'){
      this.projectID = 0;
    }


    if(this.projectID != 0){
      this.projectName = this.projectList.find((e:any)=> e.projectID == this.projectID).projectTitle;
    }
    
    $('#summary2').hide();
    $('#summary1').show();
this.TrialBalanceData = [];
    this.app.startLoaderDark();
    

    this.http.get(environment.mainApi+'acc/GetTrailBalanceRpt?fromdate='
    +this.globalData.dateFormater(this.fromDate,'-')+'&todate='+this.globalData.dateFormater(this.toDate,'-')+'&projectID='+this.projectID).subscribe(
      (Response)=>{
      
        this.TrialBalanceData = Response;
       
        if(Response != null){
          this.oDebitTotal = 0;
        this.oCreditTotal = 0;
        this.debitTotal = 0;
        this.creditTotal = 0;
        this.cDebitTotal = 0;
        this.cCreditTotal = 0;
          
        
        
       
       

         for(var i=0;i<this.TrialBalanceData.length;i++){

          if(this.TrialBalanceData[i].coaTypeID == 2){
            this.TrialBalanceData[i].noteID = 0.2;
          }

          if(this.TrialBalanceData[i].coaTypeID == 3){
            this.TrialBalanceData[i].noteID = 0.3;
          }
           this.oDebitTotal += this.TrialBalanceData[i].oDebit;
           this.oCreditTotal += this.TrialBalanceData[i].oCredit;
           this.debitTotal += this.TrialBalanceData[i].debit;
           this.creditTotal += this.TrialBalanceData[i].credit;
           this.cDebitTotal += this.TrialBalanceData[i].cDebit;
           this.cCreditTotal += this.TrialBalanceData[i].cCredit;
           

           this.notesList.forEach((n:any) => {
            
            if(n.noteID == this.TrialBalanceData[i].noteID){
              n.debitTotal += this.TrialBalanceData[i].cDebit;
              n.creditTotal += this.TrialBalanceData[i].cCredit;
            }

           });
     
         }
        }
         this.app.stopLoaderDark();
         console.log(this.notesList);
      },
      (Error)=>{
        this.app.stopLoaderDark();
        this.msg.WarnNotify('Error Occured')
      }
    )
  
  }
   
    

  }

  getSummary2(param:any){
    if(param == 'sm1'){
      $('#summary1').show();
      $('#summary2').hide();
    }else if(param == 'sm2'){
      $('#summary1').hide();
      $('#summary2').show();
    }
   
  }

  getTotal(note:any){

    this.oDebitTotal = 0;
    this.oCreditTotal = 0;
    this.debitTotal = 0;
    this.creditTotal = 0;
    this.cDebitTotal = 0;
    this.cCreditTotal = 0;
     for(var i=0;i<this.TrialBalanceData.length;i++){
      
 
     }
  }
 



  ///////////////////////////// will get the notes list
  
  getNotes(){
    this.notesList = [];
    this.http.get(environment.mainApi+'acc/GetNote').subscribe(
      (Response:any )=>{
        // console.log(Response);

        Response.forEach((e:any) => {
          this.notesList.push({noteID:e.noteID,noteTitle:e.noteTitle,coaTypeID:e.coaTypeID,debitTotal:0,creditTotal:0,})
        });

        this.notesList.push({noteID:0.2,noteTitle:'Expense',coaTypeID:2,debitTotal:0,creditTotal:0},
        {noteID:0.3,noteTitle:'Income',coaTypeID:3,debitTotal:0,creditTotal:0})

        
      }
      
    )
  }




  PrintTable() {
  
    this.globalData.printData('#printReport');
  
  }

}
