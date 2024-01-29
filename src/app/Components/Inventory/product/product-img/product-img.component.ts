import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-product-img',
  templateUrl: './product-img.component.html',
  styleUrls: ['./product-img.component.scss']
})
export class ProductImgComponent {


  
  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private dialogRef: MatDialogRef<ProductImgComponent>,
    private global:GlobalDataModule,
    private msg:NotificationService,
    private dialogue:MatDialog
  ){
    this.productImage = data;
  }



  productImage:any;

  closeDialog(){
    this.dialogRef.close();
  }

}
