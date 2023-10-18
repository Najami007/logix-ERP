import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import {FormControl} from '@angular/forms';
import { environment } from 'src/environments/environment.development';
import { DateAdapter,MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import * as moment_1 from 'moment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-budgetting',
  templateUrl: './budgetting.component.html',
  styleUrls: ['./budgetting.component.scss']
})
export class BudgettingComponent implements OnInit {
  


  logo:any;
  logo1:any;
  CompanyName :any;
  CompanyName2:any;
  companyAddress :any;
  companyPhone :any;
  constructor (
    private http:HttpClient,
    private msg:NotificationService,
    private globalData:GlobalDataModule,
    private app:AppComponent,

  ){

  }

  ngOnInit(): void {
    this.globalData.setHeaderTitle('Budgetting');
    this.GetChartOfAccount();
    this.getSaved();
    this.logo = this.globalData.Logo;
    this.logo1 = this.globalData.Logo1;
    this.CompanyName = this.globalData.CompanyName;
    this.CompanyName2 = this.globalData.CompanyName2;
    this.companyAddress = this.globalData.Address;
    this.companyPhone = this.globalData.Phone;
  
  }


  btnText = 'Save';
  coaSearch:any;
  CoaID:any;
  amount:any;
  TotalAmount = 0;
  description:any;
  budgetID:any;

  

  BudgetMonth:Date = new Date();

  ExpenseList:any = [];
  budgetData:any = [];
  savedData:any = [];

 
  TabIndex:any;

  /////////////////////////////////////

  lblBudgetID:any;
  lblBudgetDate:any;
  lblBudgetTotal:any;
  lblBudgetData:any = [];




  ////////////////////////////////



   //////////////////////////////////////////////////////////
   GetChartOfAccount(){
    this.ExpenseList = [];
    this.app.startLoaderDark();
    this.http.get(environment.mainApi+'GetChartOfAccount').subscribe(
      
        (Response:any)=>{

    
          Response.forEach((e:any) => {
            if(e.coaTypeID == 2){
              this.ExpenseList.push(e);
            }
          });
          
          this.app.stopLoaderDark();
         
        },
        (Error)=>{
          console.log(Error);
          this.app.stopLoaderDark();
        }
      
    )
  }

//////////////////////////////////////////////////

  getSaved(){
    this.http.get(environment.mainApi+'GetBudget').subscribe(
      (Response:any)=>{
      
        this.savedData = Response;
      }
    )
  }


  //////////////////////////////////////////////////////////////////////////
//////////////////// Temporarily save the data in Budget Array /////////////////
///////////////////////////////////////////////////////////////////////////

  save(){
    if(this.CoaID == "" || this.CoaID == undefined){
      this.msg.WarnNotify('Select Charts')
    }else if(this.amount == '' || this.amount == undefined){
      this.msg.WarnNotify('Enter The Amount')
    }else{

      //////////////// find the row by coaID to Insert coaTitle Name///////////////////////////

      var coaTitleRow = this.ExpenseList.find((obj:any)=> obj.coaID  == this.CoaID);

      //////////////////////// find the row whether selected caoID already Exist in budget array or not//////////////

      var curRow = this.budgetData.find((obj:any)=>obj.coaID == this.CoaID);

      if(curRow == undefined){
        this.budgetData.push({coaID:this.CoaID,coaTitle:coaTitleRow.coaTitle,budgetAmount:this.amount});
        this.getTotal();
      }else{
        this.msg.WarnNotify('Coa Title Already Entered');
      }

      this.CoaID = '';
      this.amount = '';

   
    }
  }


////////////////////////// will Delete the row from budget array ///////////////////////////////

  delRow(item: any) {
    var index = this.budgetData.indexOf(item);
    this.budgetData.splice(index, 1);
    this.getTotal();
  }


  /////////////////////////// will get total to budget array amount//////////////////////////

  getTotal(){

    this.TotalAmount = 0;

    this.budgetData.forEach((e:any) => {
      this.TotalAmount += e.budgetAmount;
    });
  }





  SaveBudget(){
    if(this.budgetData == ''){
      this.msg.WarnNotify('Table is Empty')
    }else{

      if(this.description == '' || this.description == undefined){
        this.description = '-';
      }
      
      if(this.btnText == 'Save'){
        this.insertBudget();
      }else if(this.btnText == 'Update'){
        this.updateBudget();
      }
    }
  }


  /////////////////////////////////////

  editBudget(row:any){

   
  

    this.http.get(environment.mainApi+'getbudgetdetail?budgetID='+row.budgetID).subscribe(
      (Response)=>{
        this.budgetData = Response;
     
      }
    )

    this.budgetID = row.budgetID;
    this.BudgetMonth = row.budgetDate;
    
    this.description = row.description;
    this.TotalAmount = row.budgetAmount;
    this.TabIndex = 0;
   
    this.btnText = 'Update';
    
    
  }



  ////////////////////////////////////////////////////
  
  insertBudget(){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+'InsertBudget',{
      BudgetDate: this.globalData.dateFormater(this.BudgetMonth,'-'),
      Description: this.description,
      BudgetDetail: JSON.stringify(this.budgetData) ,
      UserID: this.globalData.getUserID(),
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getSaved();
          this.reset();
          this.app.stopLoaderDark();
        }else{
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      }
    )
  }


  /////////////////////////////////////////////

  updateBudget(){
    
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+'updateBudget',{
      BudgetID: this.budgetID,
      BudgetDate: this.BudgetMonth,
      Description: this.description,
      BudgetDetail: JSON.stringify(this.budgetData) ,
      UserID: this.globalData.getUserID(),
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getSaved();
          this.reset();
          this.app.stopLoaderDark();
        }else{
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      }
    )
  }


  ///////////////////////////////////////////
  deleteBudget(row:any){

    Swal.fire({
      title:'Alert!',
      text:'Confirm to Delete the Data',
      position:'center',
      icon:'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result)=>{
      if(result.isConfirmed){

        //////on confirm button pressed the api will run
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+'DeleteBudget',{
          BudgetID: row.budgetID,
        UserID: this.globalData.getUserID(),
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getSaved();
              this.app.stopLoaderDark();
            }else{
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
          }
        )
      }
    });
   
  }


  ////////////////////////////////////////////

  approveBudget(row:any){


    Swal.fire({
      title:'Alert!',
      text:'Confirm to Approve Budget',
      position:'center',
      icon:'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result)=>{
      if(result.isConfirmed){

        //////on confirm button pressed the api will run
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+'ApproveBudget',{
          BudgetID: row.budgetID,
        UserID: this.globalData.getUserID(),
        }).subscribe(
          (Response:any)=>{
            if(Response.msg =='Voucher Approved Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getSaved();
              this.app.stopLoaderDark();
            }else{
              this.msg.WarnNotify(Response.msg);
              this.amount.stopLoaderDark();
            }
            
            
          }
        )
      }
    });


    
  }



  /////////////////////////////////////////////////////

  printBudget(row:any){
    this.app.startLoaderDark();
    this.lblBudgetTotal = 0;


    this.lblBudgetDate = row.budgetDate;
    this.lblBudgetID = row.budgetID;

    this.http.get(environment.mainApi+'getbudgetdetail?budgetID='+row.budgetID).subscribe(
      (Response:any)=>{
        this.lblBudgetData = Response;

        Response.forEach((e:any) => {
          this.lblBudgetTotal += e.budgetAmount;
        });

        if(Response != ''){
          setTimeout(() => {
            this.globalData.printData('#PrintDiv');
          }, 1000);
        }

        this.app.stopLoaderDark();
        
      }
    )




  }

  /////////////////////////////////////////
  reset(){
    this.budgetData = [];
    this.BudgetMonth = new Date();
    this.description = '-';
    this.btnText = 'Save';
    this.CoaID = '';
    this.amount = '';
    this.TotalAmount = 0;
    this.budgetID = 0;
    this.TabIndex = '';
    
  }

  resetIndex(){
    this.TabIndex = '';
  }
 

}
