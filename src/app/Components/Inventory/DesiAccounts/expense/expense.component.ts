import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { environment } from 'src/environments/environment.development';
import { VoucherDetailsComponent } from 'src/app/Components/Accounts/voucher/voucher-details/voucher-details.component';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent {


  crudList:any = {c:true,r:true,u:true,d:true};

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router
    
    ){
     

      this.globaldata.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      })

    }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Expense');
    this.getSavedData();
   
  }


  savedDataList:any = [];
  

  add(){
    this.dialogue.open(AddExpenseComponent,{
      width:'30%',
    }).afterClosed().subscribe(value =>{
      if(value == 'update'){
          this.getSavedData();
      }
    })
  }



  edit(item:any){
    this.dialogue.open(AddExpenseComponent,{
      width:'30%',
      data:item,
    }).afterClosed().subscribe(value =>{
      if(value == 'update'){
          this.getSavedData();
      }
    })
  }

  getSavedData(){

      this.http.get(environment.mainApi+this.globaldata.accountLink+'GetPayRec?reqType=EXP').subscribe(
        (Response:any)=>{
          this.savedDataList = Response;
         
        }
      )
  }



  
  delete(row:any){


    this.globaldata.openPinCode().subscribe(pin=>{
      if(pin!= ''){

        //////on confirm button pressed the api will run
        this.http.post(environment.mainApi+this.globaldata.accountLink+'DeleteVoucher',{
          InvoiceNo: row.invoiceNo,
          PinCode:pin,
          UserID: this.globaldata.getUserID(),
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getSavedData();
            }else{
              this.msg.WarnNotify(Response.msg);
            }
          }
        ) 
      
    

  }})

   
  }


  VoucherDetails(row:any){
    this.dialogue.open(VoucherDetailsComponent,{
      width:"40%",
      data:row,
    }).afterClosed().subscribe(val=>{
      
    })
  }


}
