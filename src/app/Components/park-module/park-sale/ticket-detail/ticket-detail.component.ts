
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent{

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef:MatDialogRef<TicketDetailComponent>,
    private global:GlobalDataModule,


  ){


    

  this.http.get(environment.mainApi+this.global.parkLink+'PrintTicket?ticketno='+this.editData.ticketNo).subscribe(
    (Response:any)=>{
     this.printDetails = Response;

    }
    
  )

  }



 



  printDetails:any =[];






}
