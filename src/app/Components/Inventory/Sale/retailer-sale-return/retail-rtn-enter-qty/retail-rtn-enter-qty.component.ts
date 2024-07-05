import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-retail-rtn-enter-qty',
  templateUrl: './retail-rtn-enter-qty.component.html',
  styleUrls: ['./retail-rtn-enter-qty.component.scss']
})
export class RetailRtnEnterQtyComponent implements OnInit {

  
  constructor(
    private http:HttpClient,
    private dialogRef: MatDialogRef<RetailRtnEnterQtyComponent>,
    public global:GlobalDataModule,
    private msg:NotificationService,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ){}
  ngOnInit(): void {
    this.tempQty = this.data;
  }



  
  tempQty = 1;



  changeQty(e:any){
    if(e.target.value == ''){
      e.target.value = 0;
    }
    this.tempQty = parseFloat(e.target.value);
    if(e.keyCode == 40){
      this.increment('minus',this.tempQty)
    }
    if(e.keyCode == 38){
      this.increment('add',this.tempQty)
    }
  }
  
  increment(type:any,value:any){
    if(type == 'add'){
      this.tempQty += 1;
    }

    if(type == 'minus'){
      if(this.tempQty > 0){
        this.tempQty -= 1;
      }
     
    }
  }

  closeDialog(value:any){
    this.dialogRef.close(value);
  }


}

