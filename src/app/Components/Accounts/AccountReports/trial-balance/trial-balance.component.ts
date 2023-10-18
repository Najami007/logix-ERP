import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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
export class TrialBalanceComponent {


  logo:any;
  logo1:any;
  CompanyName:any;
  CompanyName2:any;
   companyAddress :any;
   companyPhone :any;
   companyMobileno:any;
   companyEmail:any;
 


  constructor(private globalData: GlobalDataModule,
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent

    ) { }

  ngOnInit(): void {
    this.globalData.setHeaderTitle('Trial Balance');
    this.logo = this.globalData.Logo;
    this.logo1 = this.globalData.Logo1;
    this.CompanyName = this.globalData.CompanyName;
    this.CompanyName2 = this.globalData.CompanyName2;
    this.companyAddress = this.globalData.Address;
    this.companyPhone = this.globalData.Phone;
    this.companyMobileno = this.globalData.mobileNo;
    this.companyEmail = this.globalData.Email;
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


  


  getTrialBalance(){
    $('#summary2').hide();
    $('#summary1').show();
this.TrialBalanceData = [];
    this.app.startLoaderDark();

    this.http.get(environment.mainApi+'GetTrailBalanceRpt?fromdate='
    +this.globalData.dateFormater(this.fromDate,'-')+'&todate='+this.globalData.dateFormater(this.toDate,'-')).subscribe(
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
      },
      (Error)=>{
        this.app.stopLoaderDark();
        this.msg.WarnNotify('Error Occured')
      }
    )
  
   
    

  }

  getSummary2(){
    $('#summary1').hide();
    $('#summary2').show();
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
    this.http.get(environment.mainApi+'GetNote').subscribe(
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
