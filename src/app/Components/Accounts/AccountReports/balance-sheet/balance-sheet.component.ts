import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import * as $ from 'jquery';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent implements OnInit {


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
    private app:AppComponent,
    ){

  }
  ngOnInit(): void {
    this.logo = this.globalData.Logo;
    this.logo1 = this.globalData.Logo1;
    this.CompanyName = this.globalData.CompanyName;
    this.CompanyName2 = this.globalData.CompanyName2;
    this.companyAddress = this.globalData.Address;
    this.companyPhone = this.globalData.Phone;
    this.companyMobileno = this.globalData.mobileNo;
    this.companyEmail = this.globalData.Email;
    this.globalData.setHeaderTitle('Balance Sheet');
    $('#printRpt').hide();
    $('#balanceSheet2').hide();
  }

  toDate = new Date();


  BsData:any;

  assetList:any= [];
  liabilityList:any =[];
  capitalList:any = [];
  accumulatedPL:any = [];

  currentYear:any;
  previousYear:any;

  assetTotal:any = 0;
  liabilityTotal:any = 0;
  capitalTotal:any = 0;
  accumulatedTotal:any = 0;

  oAssetTotal:any = 0;
  oLiabilityTotal:any = 0;
  oCapitalTotal:any = 0;
  oAccumulatedTotal:any = 0;
  

  PrintTable(){
    this.globalData.printData('#printRpt');
  }

  getBalanceSheet(){

    this.currentYear = this.getYear();
   
    this.previousYear = this.currentYear-1

    this.http.get(environment.mainApi+'GetMainBalanceSheet?todate='+this.globalData.dateFormater(this.toDate,'-')).subscribe(
      (Response:any)=>{
        this.assetList = [];
        this.liabilityList = [];
        this.capitalList = [];
        this.accumulatedPL = [];
        this.assetTotal =0;
        this.liabilityTotal = 0;
        this.capitalTotal = 0;
        this.accumulatedTotal=0;
        this.oAssetTotal = 0;
        this.oLiabilityTotal = 0;
        this.oCapitalTotal= 0;
        this.oAccumulatedTotal = 0;

        $('#printRpt').show();

        Response.forEach((e:any) => {
      
          if(e.coaTypeID == 1){
            this.assetList.push(e);

          this.assetTotal += e.nTotal;
          this.oAssetTotal += e.oTotal;
          }
    
          if(e.coaTypeID == 4){
            this.liabilityList.push(e);
            this.liabilityTotal += e.nTotal;
            this.oLiabilityTotal += e.oTotal;
          }
          if(e.coaTypeID == 5){
            this.capitalList.push(e);
            this.capitalTotal += e.nTotal;
            this.oCapitalTotal += e.oTotal;
          }

          if(e.noteID == 0.2){
            this.accumulatedTotal -= e.nTotal;
            this.oAccumulatedTotal -= e.oTotal;
          }

          if(e.noteID == 0.3){
            this.accumulatedTotal += e.nTotal;
            this.oAccumulatedTotal += e.oTotal;
          }

      
      }
    )
  }
    
    )
  
  }

  getYear(){
    
      var year = this.toDate.getFullYear();
      var month = this.toDate.getMonth();
      if(month < 6){
        return year - 1;
      }else{
        return year;
      }
    
  }


  Summary1(){
    $('#balanceSheet2').hide();
    $('#balanceSheet1').show();
  }

  summary2(){
    $('#balanceSheet1').hide();
    $('#balanceSheet2').show();
  }

 




    


}