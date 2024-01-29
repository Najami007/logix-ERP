import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-active-member-rpt',
  templateUrl: './active-member-rpt.component.html',
  styleUrls: ['./active-member-rpt.component.scss']
})
export class ActiveMemberRptComponent implements OnInit {
  companyProfile:any= [];
  crudList:any = [];
  constructor(
    private http:HttpClient,
    private global:GlobalDataModule,
    private app:AppComponent,
    private route:Router
  ){
    this.global.getCompany().subscribe((data)=>{
      this.companyProfile = data;
    });

    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })
  }


  ngOnInit(): void {
    this.global.setHeaderTitle('Active Member List')
    this.getActiveTickets();
  }


  activeMemberList:any = [];
  getActiveTickets(){
    this.app.startLoaderDark();
    this.http.get(environment.mainApi+this.global.parkLink+'GetActiveSwingQtyTotal').subscribe(
      (Response:any) =>{
        this.activeMemberList = Response;
       // console.log(Response);
        this.app.stopLoaderDark();
      }
    )
  }


  print(){
    this.global.printData('#PrintDiv');
  }


}
