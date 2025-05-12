import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent {


  crudList: any = [];
  companyProfile: any = [];
  companyLogo: any = '';
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';
  logoHeight: any = 100;
  logoWidth: any = 100;
  CompanyNTN = '';
  CompanySTRN = '';


  constructor(
    private http: HttpClient,
    private msg: NotificationService,

    public global: GlobalDataModule,
    private dialogue: MatDialog,
    private route: Router
  ) {
    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
      this.companyLogo = data[0].companyLogo1;
      this.CompanyMobile = data[0].companyMobile;
      this.companyAddress = data[0].companyAddress;
      this.companyName = data[0].companyName;
      this.logoHeight = data[0].logo1Height;
      this.logoWidth = data[0].logo1Width;
      this.CompanyNTN = data[0].ntn;
      this.CompanySTRN = data[0].strn;

    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })



  }




  FeedbackList: any = [
    { id: 1, title: 'ATMOSPHERE', level1: true, level2: false, level3: false, level4: false },
    { id: 2, title: 'Food Quality', level1: false, level2: false, level3: false, level4: false },
    { id: 3, title: 'Value For Money', level1: false, level2: false, level3: false, level4: false },
    { id: 4, title: 'Cleanliness', level1: false, level2: false, level3: false, level4: false },
    { id: 5, title: 'Service', level1: false, level2: false, level3: false, level4: false },
  ]


  onCheckBoxChecked(item: any, level: any) {

    this.FeedbackList.forEach((e: any) => {

      if (e.id == item.id) {
        if (level == 1) {
          e.level1 = true;
          e.level2 = false;
          e.level3 = false;
          e.level4 = false;
        }
        if (level == 2) {
          e.level2 = true;
          e.level1 = false;
          e.level3 = false;
          e.level4 = false;
        }
        if (level == 3) {
          e.level1 = false;
          e.level2 = false;
          e.level3 = true;
          e.level4 = false;
        }
        if (level == 4) {
          e.level1 = false;
          e.level2 = false;
          e.level3 = false;
          e.level4 = true;
        }
      }

    });

    console.log(this.FeedbackList);
  }



}
