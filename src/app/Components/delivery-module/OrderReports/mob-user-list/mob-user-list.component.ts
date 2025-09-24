import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-mob-user-list',
  templateUrl: './mob-user-list.component.html',
  styleUrls: ['./mob-user-list.component.scss']
})
export class MobUserListComponent {

  companyProfile:any= [];
  crudList:any = {c:true,r:true,u:true,d:true};
  constructor(
    private http:HttpClient,
    private global:GlobalDataModule,
    private app:AppComponent,
    private route:Router,
    private msg:NotificationService
  ){
    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })
  }


  ngOnInit(): void {
    this.global.setHeaderTitle('Mobile User List');
    this.getParty();
  }



  partyList:any = [];

  getParty(){
     this.http.get(environment.mainApi + this.global.mobileLink + 'GetMobUser').subscribe(
      {
        next: (Response: any) => {
  
          if (Response.length > 0) {
            this.partyList = Response.filter((e: any) => e.userType == 'Customer');
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
  }


  print(){
    this.global.printData('#PrintDiv');
  }




}

