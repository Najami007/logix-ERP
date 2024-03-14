import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent {

  
  constructor(
    private http:HttpClient,
    private dialogRef: MatDialogRef<AddExpenseComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
  ){}

  ngOnInit(): void {
    this.getSupplier();
    setTimeout(() => {
      $('#type').trigger('focus');
    }, 500);
  }

  supplierBalance = 0;
  amount = 0;
  discount = 0;
  customerList:any = [];
  coaList:any = [];
  coaID = 0;
  remarks = '';
  partyID = 0;

  paymentTypeList = [{value:'income',title:'Income'},{value:'exp',title:'Expense'},];

  paymentType = '';


  getSupplier(){
    this.global.getCustomerList().subscribe(
      (Response)=>{
        this.customerList = Response;
      }
    )
  }


  ////////////////////////////////////////////

  getCoaList() {

    var type = '';
    if(this.paymentType == 'cash'){
      type = 'CRV';
    }
    if(this.paymentType == 'bank'){
      type = 'BRV';
    }

    this.global.getCashBankCoa(type).subscribe(
      (Response: any) => {
        this.coaList = Response;
      },
      (Error) => {
      
      }
    )
  }




  closeDialog(){
    this.dialogRef.close();
  }

}
