import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { post } from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {


  @Output() saveEmitter = new EventEmitter();


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
  ngOnInit(): void {
  this.getFeedbackCaptions();
  }

  mobileMask = [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ];

  @Input() invBillNo:any = '';

CusContactNo:any = ''
CusName:any = '';
Comments:any = '';
Suggestions:any = '';


  FeedBackDetail: any = []

  getSavedData(invBillNo:any){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetComments?reqType=Holded'+'&BillNo='+invBillNo).subscribe(
      (Response:any)=>{

        if(Response.length > 0){
        this.CusName = Response[0].cusName;
        this.CusContactNo = Response[0].cusContactNo;
        this.Comments = Response[0].comments;
        this.Suggestions = Response[0].suggestions;
        this.getSavedComments(invBillNo);
        }

      }
    )
  }

  getSavedComments(invBillNo:any){
     this.http.get(environment.mainApi+this.global.restaurentLink+'GetCommentsDetail?BillNo='+invBillNo).subscribe(
      (Response:any)=>{
        this.FeedBackDetail = Response;

      }
    )
  }


  getFeedbackCaptions(){
    this.http.get(environment.mainApi+this.global.restaurentLink+'GetFeedBackCaption').subscribe(
      (Response:any)=>{
        this.FeedBackDetail = Response;

      }
    )
  }


  onCheckBoxChecked(item: any, level: any) {

    this.FeedBackDetail.forEach((e: any) => {

      if (e.feedBackID == item.feedBackID) {
        if (level == 1) {
          e.excellent = true;
          e.good = false;
          e.fair = false;
          e.bad = false;
        }
        if (level == 2) {
          e.good = true;
          e.excellent = false;
          e.fair = false;
          e.bad = false;
        }
        if (level == 3) {
          e.excellent = false;
          e.good = false;
          e.fair = true;
          e.bad = false;
        }
        if (level == 4) {
          e.excellent = false;
          e.good = false;
          e.fair = false;
          e.bad = true;
        }
      }

    });

  }


  reset(){

    this.CusName = '';
    this.CusContactNo = '';
    this.Comments = '';
    this.Suggestions = '';
    this.getFeedbackCaptions();
  }



  save(){


    var postData = {
      HoldInvNo:this.invBillNo,
      CusContactNo:this.CusContactNo,
      CusName:this.CusName,
      Comments:this.Comments,
      Suggestions:this.Suggestions || '-',
      FeedBackDetail:JSON.stringify(this.FeedBackDetail),
      UserID:this.global.getUserID()
    }


    if(this.invBillNo == ''){
      this.msg.WarnNotify('Bill No Required');
      return;
    }

    if(this.CusName == ''){
      this.msg.WarnNotify('Enter Customer Name');
      return;
    }
    if(this.CusContactNo == ''){
      this.msg.WarnNotify('Enter Customer Contact No');
      return;
    }

    if(this.Comments == ''){
      this.msg.WarnNotify('Enter Comments')
      return;
    }


    this.http.post(environment.mainApi+this.global.restaurentLink+'InsertComments',postData).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){

          this.msg.SuccessNotify(Response.msg);
          this.saveEmitter.emit();
        }else{
          this.msg.WarnNotify(Response.msg);
        }

      }
    )
  }


  


}
