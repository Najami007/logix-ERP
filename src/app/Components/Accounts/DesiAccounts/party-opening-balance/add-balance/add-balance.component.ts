import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-add-balance',
  templateUrl: './add-balance.component.html',
  styleUrls: ['./add-balance.component.scss']
})
export class AddBalanceComponent {
  
  constructor(
    private http:HttpClient,
    private dialogRef: MatDialogRef<AddBalanceComponent>,
    public global:GlobalDataModule,
    private msg:NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
  ){}

}
