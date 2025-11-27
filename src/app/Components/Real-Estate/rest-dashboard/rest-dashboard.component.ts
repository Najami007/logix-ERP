import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-rest-dashboard',
  templateUrl: './rest-dashboard.component.html',
  styleUrls: ['./rest-dashboard.component.scss']
})
export class RestDashboardComponent implements OnInit {
  date = new Date();
  curMonth = this.date.getMonth();
  curYear = this.date.getFullYear();
  curDay = this.date.getDay();
  listOfYear: any = [];
  monthDaysList: any = [];
  today = new Date();
  totalDays = 0;
  firstDayOfMonth = 0;
  lastDayOfMonth = 0;
  tmpPropertyData: any = [];
  tmpPropertyRate = '';

  monthsList = [
    { name: "January", id: 0 },
    { name: "Feburary", id: 1 },
    { name: "March", id: 2 },
    { name: "April", id: 3 },
    { name: "May", id: 4 },
    { name: "June", id: 5 },
    { name: "July", id: 6 },
    { name: "August", id: 7 },
    { name: "September", id: 8 },
    { name: "October", id: 9 },
    { name: "November", id: 10 },
    { name: "December", id: 11 },

  ]

  WeekDaysList = [

    { name: 'Monday', value: 1 },
    { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 },
    { name: 'Thursday', value: 4 },
    { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 },
    { name: 'Sunday', value: 7 },

  ];

  propertyID = 0;

  PropertyList: any = [];

  constructor(
    public global: GlobalDataModule,
    public http: HttpClient,
    private msg: NotificationService
  ) {

  }

  ngOnInit(): void {



    this.getMonthDays();
    this.getListOfYears(this.curYear);
    this.getPropertyList();
  }



  getPropertyRates() {
    $('.loaderDark').show();
    this.http.get(environment.mainApi + this.global.propertyLink + 'GetAdditionalRates?PropertyID=' + this.propertyID + '&AdditionalRateDate=' + (this.curYear + '-' + (this.curMonth + 1) + '-' + '01')).subscribe(
      (Response: any) => {

        
      if(Response != '' || Response != null){
        Response.forEach((j:any) => {

          this.monthDaysList.forEach((e:any) => {
            if(this.global.dateFormater(new Date(j.additionalRateDate),'-') == e.fullDate){
              e.additionalRate = j.additionalRate;
            }
          
        });
          
        });
      }
      $('.loaderDark').fadeOut(200);
       
      }
    )
  }


  getDaysInMonth = function (year: any, month: any) {
    return new Date(year, month, 0).getDate();
  };





  getPropertyList() {
    this.http.get(environment.mainApi + this.global.propertyLink + 'GetProperty').subscribe(
      (Response: any) => {
        this.PropertyList = Response;
      }
    )

  }


  getMonthDays() {
    this.monthDaysList = [];
    this.firstDayOfMonth = new Date(this.curYear, this.curMonth, 0).getDay();
    for (var i = 1; i <= this.firstDayOfMonth; i++) {

      this.monthDaysList.push(
        {
          date: ''
        }
        //   {
        //     date:this.getLastDateOfPrevMonth(this.curYear,this.curMonth) - this.firstDayOfMonth + i,
        //     fullDate:this.getyearOfPrevMonth(this.curYear,this.curMonth)+'-'
        //     +(this.getMonthOfPrevMonth(this.curYear,this.curMonth) + 1) +'-'+ 
        //     (this.getLastDateOfPrevMonth(this.curYear,this.curMonth) - this.firstDayOfMonth + i)
        // }
      );
    }
    this.totalDays = new Date(this.curYear, this.curMonth + 1, 0).getDate();
    for (let i = 1; i <= this.totalDays; i++) {
      var newDate = '';
      if(i < 10 ){
        newDate= '0' + i;
      }else{
        newDate = i.toString();
      }

   
      

      this.monthDaysList.push({ date: i, fullDate: this.curYear + '-' +( (this.curMonth + 1) < 10 ? '0'+(this.curMonth + 1) : this.curMonth + 1) + '-' + newDate, additionalRate: '' });
    }

    this.lastDayOfMonth = new Date(this.curYear, this.curMonth + 1, 0).getDay();
    if (this.lastDayOfMonth > 0) {
      var date = 0;
      for (var i = this.lastDayOfMonth; i < 7; i++) {
        date += 1;
        this.monthDaysList.push({ date: '' });
        // this.monthDaysList.push({ date:date ,fullDate:this.curYear+'-'+(this.curMonth + 2) +'-'+ date,propertyRate:''});

      }
    }
  }

  getLastDateOfPrevMonth(y: any, m: any) {
    return new Date(y, m, 0).getDate()
  }
  getyearOfPrevMonth(y: any, m: any) {
    return new Date(y, m, 0).getFullYear()
  }
  getMonthOfPrevMonth(y: any, m: any) {
    return new Date(y, m, 0).getMonth()
  }

  getListOfYears(year: any) {
    this.listOfYear = [];
    for (var i = 3; i > 0; i--) {

      this.listOfYear.push({ year: year - i })
    }
    for (var i = 0; i < 4; i++) {
      this.listOfYear.push({ year: year + i })
    }
  }


  showRateModal(item: any) {
    // $('#PropertyRateModal').show();
    if (item.date != '' && this.propertyID > 0) {
  
      this.global.openBootstrapModal('#PropertyRateModal',true);
      this.tmpPropertyData = item;
      sessionStorage.setItem('data',item);
      setTimeout(() => {
        $('#tmpPropRate').trigger('focus');
      }, 500);
    }
    // bootstrap.modal.getOrCreateInstance('#PropertyRateModal').show();


  }

  insertAdditionalRate() {
    if (this.propertyID == 0) {
      this.msg.WarnNotify('Select Property')
    } else {
      $('.loaderDark').show();
      this.http.post(environment.mainApi + this.global.propertyLink + 'InsertAdditionalRates', {

        PropertyID: this.propertyID,
        AdditionalRate: this.tmpPropertyRate,
        AdditionalRateDate: this.tmpPropertyData.fullDate,
        AdditionalRateDescription: "",
        UserID: this.global.getUserID()
      }).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
            this.getPropertyRates();
            this.msg.SuccessNotify(Response.msg);
            this.tmpPropertyData = [];
            this.tmpPropertyRate = '';
            this.global.closeBootstrapModal('#PropertyRateModal',true);

          } else {
            this.msg.WarnNotify(Response.msg);
          }

          $('.loaderDark').fadeOut(200);
        }
      )
    }
  }
}
