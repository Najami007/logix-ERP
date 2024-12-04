import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { AddReservationComponent } from './add-reservation/add-reservation.component';


@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit{
  today = new Date();

  loadingBar = 'start';

  page:number = 1;
  count: number = 0;

  tableSize: number = this.global.paginationDefaultTalbeSize;
  tableSizes : any = this.global.paginationTableSizes;



  onTableDataChange(event:any){

    this.page = event;
    this.filterBookings();
  }

  onTableSizeChange(event:any):void{
    this.tableSize = event.target.value;
    this.page =1 ;
    this.filterBookings();
  }

  logo:any;
  logo1:any;
  CompanyName :any;
   CompanyName2:any;
   companyAddress :any;
   companyPhone :any;
   companyMobileno:any;
   companyEmail:any;


  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private global:GlobalDataModule,
    private dialogue: MatDialog,
    
    
  ){

  }



  ngOnInit(): void {

    this.global.setHeaderTitle('Booking');
    this.getRoom();
    this.getParty();
    this.getBookings();
    this.global.numberOnly();

  


    
  }


  

  /////////////////////////////////////////////////////////

  searchRoom:any;
  searchParty:any;
  searchBooking:any;

  RoomID:any;
  partyID:any;
  bookingDate:any = new Date();
  rentPerDay:any;
  arrivalDate:any = this.today;
  arrivalTime:any = this.today.getHours() + ":" + this.today.getMinutes() ;
  DepartureDate:any = this.today;
  DepartureTime:any = this.today.getHours() + ":" + this.today.getMinutes() ;
  TotalDays:any;
  bookingThrough:any;
  bookingDescription:any;
  refrenceName:any;
  numberOfPersons:any;

  ////////////////////////////////////////////////


  lblVoucherPrintDate = new Date();
  lblBookingNo:any;
  lblBookingDate:any;
  lblAdvanceJvNo:any;
  lblRefundJvNo:any;
  lblBookingStatus:any
  lblBookingRemarks:any;
  lblBookingChannel:any;
  lblCustomerName:any;
  lblRentPerDay:any;
  lblRoomTitle:any; //
  lblTotalDays:any; //
  lblPaidAmount:any; //
  lblArrivalDate:any;
  lblDepartureDate:any;
  lblConfirmationDate:any;
  lblPartyCNIC:any;
  lblArrivalTime:any;
  lblDepartureTime:any;
  lblReference:any;
  lblPersons:any;

/////////////////////////////////////////////////////////

  bookingID:any;
  cancelRemarks:any;


/////////////////////////////////////////////////////////

  RoomList:any;
  partyList:any;



  ///////////////////////////////////////////

  savedBookingsData:any;
  bookingStaus:any = 'Pending';

  SavedData:any = [];


  //////////////////////////////////////////


  bookingChannelList:any[] =[
    {name:'WhatsApp'},
    {name:'Website'},
    {name:'Application'},
    {name:'Walk In'}
  ]

  StatusList = [
    {title:'Pending'},
    {title:'Cancelled'},
    {title:'Confirmed'},
    {title:'Refunded'},
    {title:'Visited'},
    {title:'All'},
  ]


  addReservation(){
    this.dialogue.open(AddReservationComponent,{
      width:'80%',
    }).afterClosed().subscribe(()=>{
      
    })
  }
  


  onRoomSelected(){
    var curRoom = this.RoomList.find((e:any)=> e.roomID == this.RoomID );
    this.rentPerDay = curRoom.rentPerDay;
  }


  getTotalDays(){
   var totalHours:any =  this.global.getHours(this.global.dateFormater(this.arrivalDate,'-')
    ,this.arrivalTime,this.global.dateFormater(this.DepartureDate,'-'),this.DepartureTime);

    var days:any = totalHours / 24 ;

    var firstNumber = parseInt(days);
    var secondNumber = parseFloat(days);
 
    var differce:any = (secondNumber - firstNumber).toString().substring(2,4) ;
 
    if(differce < '5' && differce > '0'){
     this.TotalDays = Math.round(days) + 1;
    }else {
     this.TotalDays = Math.round(days);
    }
 

  }


  ///////////////////// will Filter out the data from Data Received From Api//////////////

  filterBookings(){
  if(this.bookingStaus != 'All'){
    
    this.SavedData = this.savedBookingsData.filter((e:any)=>e.bookingStatus == this.bookingStaus);
          
  }else{
    this.SavedData = this.savedBookingsData;
  }

  }
  


  //////////////////////////////////////
  
  getRoom(){
    this.http.get(environment.mainApi+'GetRoom').subscribe(
      (Response:any)=>{
        this.RoomList = Response;
      }
    )

  }



  //////////////////////////////////////////
  
  getParty(){
    this.http.get(environment.mainApi+'getparty').subscribe(
    {
      next:value =>{
        this.partyList = value;
        
      
      },
      error: error=>{
        this.msg.WarnNotify('Error Occured While Loading Data')
       
      }        
      
      
    }
    )
  }


  ////////////////////////////////////////////

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

  getBookings(){
    this.http.get(environment.mainApi+'getbooking').subscribe(
    (Response:any)=>{
      this.savedBookingsData = Response;
      if(Response != ''){
        this.SavedData =Response.filter((e:any)=>e.bookingStatus == 'Pending');
      }

      this.loadingBar = 'stop';
     
    }
    )
  }


  //////////////////////////////////////////

  save(){

    var curValue:any = this.getHours(this.global.dateFormater(this.arrivalDate,'-'),this.arrivalTime,
    this.global.dateFormater(this.DepartureDate,'-'),this.DepartureTime);

    if(this.RoomID == '' || this.RoomID == undefined){
      this.msg.WarnNotify('Select Room Number')
    }else if(this.partyID == '' || this.partyID == undefined){
      this.msg.WarnNotify('Select Customer Name')
    }else if(this.rentPerDay == '' || this.rentPerDay == undefined){
      this.msg.WarnNotify('Enter The Amount of Rent')
    }
    else if(this.arrivalDate == '' || this.arrivalDate == undefined){
      this.msg.WarnNotify('Select Date Of Arrival')
    }else if(this.arrivalTime == '' || this.arrivalTime == undefined){
      this.msg.WarnNotify('Enter The Arrival Time')
    }
    else if(this.DepartureDate == '' || this.DepartureDate == undefined){
      this.msg.WarnNotify('Select Date Of Departure')
    }
    else if( this.DepartureTime == '' || this.DepartureTime == undefined ){
      this.msg.WarnNotify('Enter The Departure Time')
    }
    else if(this.refrenceName == '' || this.refrenceName == undefined){
      this.msg.WarnNotify('Enter The Refrence Name')
    }
    else if(this.numberOfPersons == '' || this.numberOfPersons == undefined){
      this.msg.WarnNotify('Enter The Number Of Persons')
    }
    else if(this.TotalDays == '' || this.TotalDays == undefined){
      this.msg.WarnNotify('Enter The Days of Stay')
    }
    else if(this.bookingThrough == '' || this.bookingThrough == undefined){
      this.msg.WarnNotify('Select the Channel of Booking')
    }else if(this.global.dateFormater(this.arrivalDate,'-') + ' '+this.arrivalTime > this.global.dateFormater(this.DepartureDate,'-') +' '+ this.DepartureTime){
      this.msg.WarnNotify('Departure Date is Not Valid');

    }else if(curValue < 6 ){
      this.msg.WarnNotify('Departure Time must be more than 6 Hour');
      
    }else { 


      if(this.bookingDescription == '' || this.bookingDescription == undefined){
        this.bookingDescription = '-';
      }

      this.app.startLoaderDark();

      this.http.post(environment.mainApi+'insertbooking',{
        RoomID:this.RoomID,
      PartyID:this.partyID,
      BookingDate: this.global.dateFormater(this.bookingDate,'-'),
      DateOfArrival: this.global.dateFormater(this.arrivalDate,'-'),
      TimeOfArrival: this.arrivalTime,
      DateOfDeparture:this.global.dateFormater(this.DepartureDate,'-'),
      TimeOfDeparture:this.DepartureTime,
      RentPerDay: this.rentPerDay,
      TotalDays:this.TotalDays,
      BookingDescription: this.bookingDescription,
      BookingThrough: this.bookingThrough,
      Reference:this.refrenceName,
      Persons:this.numberOfPersons,
  
      UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify('Booking Done');
            this.getBookings();

         

            this.reset();
            this.app.stopLoaderDark();
          }else{
            this.msg.WarnNotify(Response.msg);
            this.app.stopLoaderDark();
          }
        },
        (Error)=>{
          this.app.stopLoaderDark();
        }
      )

      }
  
  }

  ////////////////////////////////////////

  confirmBooking(row:any){
    // this.dialogue.open(ConfirmBookingComponent,{
    //   width:"40%",
    //   data:row

    // }).afterClosed().subscribe(val=>{
    //   if(val == 'Update'){
    //     this.getBookings();
            
    //   }
      
    // })
  }



  //////////////////////////////////

  reset(){
    this.RoomID = '';
    this.partyID = '';
    this.bookingDate = new Date();
    this.rentPerDay = '';
    this.arrivalDate='';
    this.arrivalTime ='';
    this.DepartureDate='';
    this.DepartureTime='';
    this.TotalDays = '';
    this.bookingThrough = '';
    this.bookingDescription = '';
    this.refrenceName = '';
    this.numberOfPersons = '';
  }




  ///////////////////// will open the model window of cancellation Remarks

  cancel(row:any){

    this.bookingID = row.bookingID;

  }



////////////////////////////// will Cancel the Booking

  cancelBooking(){

    if(this.cancelRemarks == '' || this.cancelRemarks == undefined){
      this.msg.WarnNotify('Enter The Booking Cancellation Remarks')
    }else{
      this.http.post(environment.mainApi + 'CancelBooking',{
        BookingID:this.bookingID,    
        Remarks: this.cancelRemarks,
        UserID: this.global.getUserID()
      }).subscribe(
        (Response:any)=>{
          if(Response.msg == 'Data Saved Successfully'){
            this.msg.SuccessNotify('Booking Cancelled');
            this.cancelRemarks = '';
            this.getBookings();
           

            
          }else{
            this.msg.WarnNotify(Response.msg);
          }
        }
      )
    }

    
  }


  ///////////////////////////////////////

  printBooking(row:any){

    this.lblBookingNo = row.bookingID;
    this.lblBookingDate = row.bookingDate;
    
    this.lblBookingStatus = row.bookingStatus;
    this.lblAdvanceJvNo = row.invoiceNo;
    this.lblRefundJvNo = row.refundInvNo;
    this.lblBookingRemarks = row.bookingDescription;
    this.lblBookingChannel = row.bookingThrough;
    this.lblCustomerName = row.partyName;
    this.lblRentPerDay = row.rentPerDay;
    this.lblRoomTitle = row.roomTitle;
    this.lblTotalDays = row.totalDays;
    this.lblPaidAmount = row.advancePaid;
    this.lblArrivalDate  = row.dateOfArrival;
    this.lblDepartureDate = row.dateOfDeparture;
    this.lblConfirmationDate = row.confirmationDate;
    this.lblPartyCNIC = row.partyCNIC;
    this.lblArrivalTime = row.dateOfArrival.substring(11,19);
    this.lblDepartureTime = row.dateOfDeparture.substring(11,19);
    this.lblReference = row.reference;
      this.lblPersons = row.persons;



   setTimeout(() => {
    this.global.printData('#printDiv');
   }, 1000);
  }


  getBookingDetail(row:any){
    // this.dialogue.open(BookingDetailsComponent,{
    //   width:"40%",
    //   data:row

    // }).afterClosed().subscribe(val=>{
      
    // })

  }


  addCustomer(){
    // this.dialogue.open(AddCustomerComponent,{
    //   width:"60%",
    //   data: 'booking page'

    // }).afterClosed().subscribe(val=>{
    //   if(val == 'Update'){
    //     this.getParty();

            
    //   }
      
    // })
  }



}
