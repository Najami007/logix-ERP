import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-subscription-key-generator',
  templateUrl: './subscription-key-generator.component.html',
  styleUrls: ['./subscription-key-generator.component.scss']
})
export class SubscriptionKeyGeneratorComponent {

 constructor(

    public global:GlobalDataModule,
    public http:HttpClient,
    private msg:NotificationService
  ){}

  ngOnInit(): void {
    }


  SubscriptionDate = new Date();
  code:any = '';

  token = '';



  getCode(){
    this.token =  this.global.encodeSubscriptionDate(this.SubscriptionDate,this.code);
    }



}
