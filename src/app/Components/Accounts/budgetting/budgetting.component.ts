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
import { MatDialog } from '@angular/material/dialog';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-budgetting',
  templateUrl: './budgetting.component.html',
  styleUrls: ['./budgetting.component.scss']
})
export class BudgettingComponent implements OnInit {
  
  companyProfile:any = [];
  crudList:any;

  constructor (
    private http:HttpClient,
    private msg:NotificationService,
    private globalData:GlobalDataModule,
    private app:AppComponent,
    private dialogue:MatDialog,
    private route:Router

  ){

    // this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe(
    //   (Response:any)=>{
    //     this.companyProfile = Response;
    //     //console.log(Response)  
        
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
    this.globalData.setHeaderTitle('Budgetting');
    this.getProject();
    this.GetChartOfAccount();
    this.getSaved();

  
  }


  btnText = 'Save';
  coaSearch:any;
  CoaID:any;
  amount:any;
  TotalAmount = 0;
  description:any;
  budgetID:any;
  projectName:any;
  
  projectSearch:any;
  coaID:any;
  projectID:number = 0;
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
  projectList:any = [];





    
  // getCrud(){
  //   this.http.get(environment.mainApi+'user/getusermenu?userid='+this.globalData.getUserID()+'&moduleid='+this.globalData.getModuleID()).subscribe(
  //     (Response:any)=>{
  //       this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
  //     }
  //   )
  // }


 
  getProject(){
    this.http.get(environment.mainApi+this.globalData.companyLink+'getproject').subscribe(
      (Response:any)=>{
        this.projectList = Response;
      }
    )
  }
 



   //////////////////////////////////////////////////////////
   GetChartOfAccount(){
    this.ExpenseList = [];
    this.app.startLoaderDark();
    this.http.get(environment.mainApi+this.globalData.accountLink+'GetChartOfAccount').subscribe(
      
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
    this.http.get(environment.mainApi+this.globalData.accountLink+'GetBudget').subscribe(
      (Response:any)=>{
      
        this.savedData = Response;
        //console.log(Response);
      }
    )
  }


  //////////////////////////////////////////////////////////////////////////
//////////////////// Temporarily save the data in Budget Array /////////////////
///////////////////////////////////////////////////////////////////////////

  save(){
    if(this.CoaID == "" || this.CoaID == undefined){
      this.msg.WarnNotify('Select Expense Head')
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
    }else if(this.projectID == 0){
      this.msg.WarnNotify('Select Project')
    }
    else{

      if(this.description == '' || this.description == undefined){
        this.description = '-';
      }
      
      if(this.btnText == 'Save'){
        this.insertBudget();
      }else if(this.btnText == 'Update'){
        this.globalData.openPinCode().subscribe(pin=>{
          if(pin != ''){
            this.updateBudget(pin);
          }
        })
        
      }
    }
  }


  /////////////////////////////////////

  editBudget(row:any){

    this.projectID = row.projectID; 
    this.budgetID = row.budgetID;
    this.BudgetMonth = new Date(row.budgetDate);
    this.description = row.description;



    this.http.get(environment.mainApi+this.globalData.accountLink+'getbudgetdetail?budgetID='+row.budgetID).subscribe(
      (Response)=>{
        this.budgetData = Response;
     
      }
    )

    this.TotalAmount = row.budgetAmount;
    this.TabIndex = 0;
   
    this.btnText = 'Update';
    
    
  }



  ////////////////////////////////////////////////////
  
  insertBudget(){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+this.globalData.accountLink+'InsertBudget',{
      BudgetDate: this.globalData.dateFormater(this.BudgetMonth,'-'),
      Description: this.description,
      BudgetDetail: JSON.stringify(this.budgetData) ,
      ProjectID:this.projectID,
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

  updateBudget(pin:any){
    
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+this.globalData.accountLink+'updateBudget',{
      BudgetID: this.budgetID,
      BudgetDate:this.globalData.dateFormater(this.BudgetMonth,'-'),
      Description: this.description,
      ProjectID:this.projectID,
      PinCode:pin,
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

    this.globalData.openPinCode().subscribe(pin=>{
      if(pin != ''){
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
            this.http.post(environment.mainApi+this.globalData.accountLink+'DeleteBudget',{
              BudgetID: row.budgetID,
              PinCode:pin,
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
    })

  
   
  }


  ////////////////////////////////////////////

  approveBudget(row:any){

    this.globalData.openPinCode().subscribe(pin=>{
      if(pin != ''){
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
            this.http.post(environment.mainApi+this.globalData.accountLink+'ApproveBudget',{
              BudgetID: row.budgetID,
              PinCode:pin,
            UserID: this.globalData.getUserID(),
            }).subscribe(
              (Response:any)=>{
                if(Response.msg =='Budget Approved Successfully'){
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
    })

   


    
  }



  /////////////////////////////////////////////////////

  printBudget(row:any){
    this.app.startLoaderDark();
    this.lblBudgetTotal = 0;
    this.projectName = row.projectTitle;


    this.lblBudgetDate = row.budgetDate;
    this.lblBudgetID = row.budgetID;

    this.http.get(environment.mainApi+this.globalData.accountLink+'getbudgetdetail?budgetID='+row.budgetID).subscribe(
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
    this.projectID = 0;
    
  }

  resetIndex(){
    this.TabIndex = '';
  }



  changeTabHeader(tabNum: any) {
    this.TabIndex = tabNum;
  }
 

}
