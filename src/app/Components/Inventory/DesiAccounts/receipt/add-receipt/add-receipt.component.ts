import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AddrecipeCategoryComponent } from 'src/app/Components/Restaurant-Core/recipe-category/addrecipe-category/addrecipe-category.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-add-receipt',
  templateUrl: './add-receipt.component.html',
  styleUrls: ['./add-receipt.component.scss']
})
export class AddReceiptComponent {

  
  constructor(
    private http:HttpClient,
    private dialogRef: MatDialogRef<AddrecipeCategoryComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
  ){}

  ngOnInit(): void {
    this.getSupplier();
    setTimeout(() => {
      $('#customer').trigger('focus');
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

  paymentTypeList = [{value:'cash',title:'Cash'},{value:'bank',title:'Bank'},];

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
        this.coaID = Response[0].coaID;
      },
      (Error) => {
      
      }
    )
  }



    //////////////////////////////////////////

    Save(){
      if(this.partyID == 0 || this.partyID == undefined){
        this.msg.WarnNotify('Select Supplier')
      }else if(this.paymentType == '' || this.paymentType == undefined){
        this.msg.WarnNotify('Select Payment Type')
      }else if(this.coaID == 0 || this.coaID == undefined){
        this.msg.WarnNotify('Select COA')
      }else if(this.amount == 0 || this.amount == undefined){
  
      }else{
  
  
        
      }
    }


  closeDialog(){
    this.dialogRef.close();
  }



}
