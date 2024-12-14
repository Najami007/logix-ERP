import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as dayjs from 'dayjs';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';



// import "hotel-datepicker/dist/css/hotel-datepicker.css";

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss']
})
export class AddReservationComponent implements OnInit {

  currency = this.global.Currency;
 

  constructor(
    private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<AddReservationComponent>,
    public global:GlobalDataModule,
    private msg:NotificationService,
  ){

  }
  ngOnInit(): void {
   this.getPropertyList();

   if(this.editData.type == 'insert'){
      this.PropertyID = this.editData.data.propertyID;
      this.propertyCode = this.editData.data.propertyCode;
      this.propertyTitle = this.editData.data.propertyTitle;
   }

  }


  myFilteredDates = (d: Date | null | any): boolean => {
    const date = (d || new Date()).getDate();
    // Prevent Saturday and Sunday from being selected.
    return date >= 1 && date <= 25;
  };

  minDate = new Date();


  today = new Date();

  PropertyID:any;
  propertyTitle = '';
  propertyCode ='';
  partyID:any;
  bookingDate:any = new Date();
  rentPerDay = 0;
  arrivalDate:any = this.today;
  arrivalTime:any = this.today.getHours() + ":" + this.today.getMinutes() ;
  DepartureDate:any = this.today;
  DepartureTime:any = this.today.getHours() + ":" + this.today.getMinutes() ;
  TotalNights:any;
  bookingThrough:any;
  bookingDescription:any;
  refrenceName:any;
  numberOfPersons:any;

  listOfGuestNo:any = [
    {title:'1 Guest', id:1},
    {title:'2 Guest', id:2},
    {title:'3 Guest', id:3},
    {title:'4 Guest', id:4},
    {title:'5 Guest', id:5},
    {title:'6 Guest', id:6},
    {title:'7 Guest', id:7},
    {title:'8 Guest', id:8},
    {title:'9 Guest', id:9},
    {title:'10 Guest', id:10},
    {title:'11 Guest', id:11},
    {title:'12 Guest', id:12},
    {title:'13 Guest', id:13},
    {title:'14 Guest', id:14},
  ]

  clearDate(){
    this.arrivalDate = new Date();
    this.DepartureDate = new Date();
  }

  RoomList:any = [];
  partyList:any = [];

  actionbtn = 'Save';


  closeDialogue(){
    this.dialogRef.close();
  }


  


   //////////////////////////////////////
    PropertyList:any = [];
    getPropertyList(){
      this.http.get(environment.mainApi+this.global.propertyLink+'GetProperty').subscribe(
        (Response:any)=>{
          this.PropertyList = Response;
        }
      )
  
    }


    save(){

    }

    insert(){
      this.http.post(environment.mainApi+this.global.propertyLink+'InsertBooking',{
        PropertyID: this.PropertyID,
        BookerID: 1,
        BookingChannelID: 1,
        BookingStatusID: 1,
        BookingDate: this.global.dateFormater(this.bookingDate,'-'),
        DateOfArrival: this.global.dateFormater(this.arrivalDate,'-'),
        TimeOfArrival: "13:15:11",
        DateOfDeparture: this.global.dateFormater(this.DepartureDate,'-'),
        TimeOfDeparture: "11:11:00",
        RentPerDay: this.rentPerDay,
        TotalDays: this.TotalNights,
        BookingDescription: this.bookingDescription,
        Reference: this.refrenceName,
        Persons: this.numberOfPersons,
        UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.dialogRef.close('Update');

          }else{
            this.msg.WarnNotify(Response.msg);
          }
        }
      )
    }
    update(){
      this.http.post(environment.mainApi+this.global.propertyLink+'UpdateBooking',{
        PropertyID: this.PropertyID,
        BookerID: 1,
        BookingChannelID: 1,
        BookingStatusID: 1,
        BookingDate: this.global.dateFormater(this.bookingDate,'-'),
        DateOfArrival: this.global.dateFormater(this.arrivalDate,'-'),
        TimeOfArrival: "13:15:11",
        DateOfDeparture: this.global.dateFormater(this.DepartureDate,'-'),
        TimeOfDeparture: "11:11:00",
        RentPerDay: this.rentPerDay,
        TotalDays: this.TotalNights,
        BookingDescription: this.bookingDescription,
        Reference: this.refrenceName,
        Persons: this.numberOfPersons,
        UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Updated Successfully'){
            this.msg.SuccessNotify(Response.msg);
            this.dialogRef.close('Update');

          }else{
            this.msg.WarnNotify(Response.msg);
          }
        }
      )
    }


  getTotalDays(){
    var totalHours:any =  this.global.getHours(this.global.dateFormater(this.arrivalDate,'-')
     ,this.arrivalTime,this.global.dateFormater(this.DepartureDate,'-'),this.DepartureTime);
 
     var days:any = totalHours / 24 ;
 
     var firstNumber = parseInt(days);
     var secondNumber = parseFloat(days);
  
     var differce:any = (secondNumber - firstNumber).toString().substring(2,4) ;
  
     if(differce < '5' && differce > '0'){
      this.TotalNights = Math.round(days) + 1;
     }else {
      this.TotalNights = Math.round(days);
     }
     console.log(this.TotalNights);
   }
  
/////////////////// will give the difference of arrival and departure date

getHours(date1:any, Time1:any, date2:any, Time2:any) {
  const DateTime1 = new Date(Date.parse(date1 + ' ' + Time1));
  const DateTime2 = new Date(Date.parse(date2 + ' ' + Time2));

  // Check if the dates and times are valid.
  if (isNaN(DateTime1.getTime()) || isNaN(DateTime2.getTime())) {
    return false;
  }

  // Calculate the difference in seconds.
  const differenceInSeconds = (DateTime2.getTime() - DateTime1.getTime()) / 1000;

  // Calculate the difference in hours.
  const differenceInHours = differenceInSeconds / 3600;

  // Return the difference in hours.
  return differenceInHours;
}

  /////////////////////////////////////////


}
