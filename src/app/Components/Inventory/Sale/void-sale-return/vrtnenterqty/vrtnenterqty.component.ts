import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-vrtnenterqty',
  templateUrl: './vrtnenterqty.component.html',
  styleUrls: ['./vrtnenterqty.component.scss']
})
export class VrtnenterqtyComponent implements OnInit {

  
  constructor(
    private http:HttpClient,
    private dialogRef: MatDialogRef<VrtnenterqtyComponent>,
    public global:GlobalDataModule,
    private msg:NotificationService,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ){}
  ngOnInit(): void {
    this.tempQty = this.data;
     setTimeout(() => {
     $('#qty').trigger('select');
    $('#qty').trigger('focus');
   }, 200);
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
