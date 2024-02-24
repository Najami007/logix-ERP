import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { Chart } from 'angular-highcharts';
import { Highcharts } from 'highcharts/highcharts-more.src';


import * as $ from 'jquery';
import * as highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  

  constructor(private globalData :GlobalDataModule,
        private http:HttpClient,
    
    ){

  }

  expenseIcon = '../../assets/Images/expIcon.png';
  shopIcon ='../../assets/Images/shopIcons.png'
  incomeIcon = '../../assets/Images/incomeIcon.png';


  income_expense_chart:Chart |undefined;
  Acounts_Chart:Chart |undefined;

  profit_loss_chart:Chart |undefined;

  budget_Chart:Chart | undefined;
  Income_Detail_Chart:Chart | undefined;
  prvious_Income_Detail_Chart:Chart | undefined;
  room_Booking_Chart:Chart | undefined;

  
  credentials :any;
  ngOnInit(): void {
    this.getCardsData();
    this.getBudget();
    this.GetIncExp();
    this.getIncome();
    this.getPrviousMonthIncome();
    this.getBookings();
    this.globalData.setHeaderTitle('Finance DashBoard');
  

  
   //this.getbudgetChart();
   
  
  }

  budgetData:any;
  budgetMonth = new Date();
  titleList:any = [];
  budgetAmountList:any = [];
  consumedAmountList:any = [];

   IncomeList:any = [];
  ExpenseList:any = [];
  MonthList:any = []

  MonthNameList:any = ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'];



   date = new Date(Date.now());
   
   firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
   lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

   priviousMonthFirstDay = new Date(this.date.getFullYear(), this.date.getMonth()-1, 1);
   priviousMonthLastDay = new Date(this.date.getFullYear(), this.date.getMonth(), 0);

   IncomeHeadsList:any = [];
   IncomeHeadsAmountList:any = [];

   prevMonthIncomeHeadsList:any = [];
   prevMonthIncomeAmountList:any = []
   
  
   cardsData:any = [{totalRooms:0,mappedRooms:0,totalExpense:0,totalIncome:0}]

  //////////////////////////////////
  getCardsData(){

    this.http.get(environment.mainApi+'acc/GetTotals').subscribe(
      (Response:any)=>{
        console.log(Response)
       if(Response != null){
        this.cardsData = Response;
       }
        //console.log(Response);

      }
    )
  }




  ////////////////////////////////////////////////

  GetIncExp(){
    this.http.get(environment.mainApi+'acc/GetIncExp').subscribe(
      (Response:any)=>{
       
        Response.forEach((e:any) => {

          if(e.coaTypeID == 2){
            this.ExpenseList.push(e.amount);
          }

          if(e.coaTypeID == 3){
            this.IncomeList.push(e.amount);
          }

        
          this.MonthList.push(this.MonthNameList[e.month-1]);

          this.incomeExpenseChart();
          

        });

        this.incomeExpenseChart();
      }
    )
  }
  

  
  incomeExpenseChart() {
      let chart =new Chart({
        chart: {
          type: 'column',
        },
        title: {
          text: 'INCOME VS EXPENSE',
        },
        subtitle: {
          text: 'CURRENT MONTH',
        },
        xAxis: {
          categories: this.MonthList,
          crosshair: true,
        },
        yAxis: {
        min: 0,
        title: {
          text: 'Amount',
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} Rs</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: 'Income',
          type: 'column',
          
          

          data: this.IncomeList,
        },
        {
          name: 'Expense',
          type: 'column',
         
          data: this.ExpenseList,
        },
      ],
    });
    this.income_expense_chart = chart;
  }


  ////////////////////////////////////////////

  getBudget(){
    

    this.http.get(environment.mainApi+'acc/GetMonthlyBudget?BudgetDate='+this.globalData.dateFormater(this.budgetMonth,'-')).subscribe(
      (Response:any)=>{
        this.budgetData = Response;
        

        Response.forEach((e:any) => {
          this.titleList.push(e.coaTitle);
          this.budgetAmountList.push(e.budgetAmount);
          this.consumedAmountList.push(e.consumedAmount);          
        });

        this.getbudgetChart();

      }
    )

  }



  getbudgetChart(){
    var chart = new Chart( {
      data: {
          table: 'datatable'
      },
      chart: {
          type: 'column'
      },
      title: {
          text: 'BUDGET COMPARISON'
      },
      subtitle: {
          text: 'CURRENT MONTH'
             
      },
      xAxis: {
          categories: this.titleList,
          
      },
      yAxis: {
        min : 0,
          allowDecimals: false,
          title: {
              text: 'Amount'
          }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} Rs</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: 'Budget Amount',
          type: 'column',
          color:'green',
         

          data: this.budgetAmountList
          ,
        },
        {
          name: 'Consumed',
          type: 'column',
          color:'red',
          data:  this.consumedAmountList,
          
        },
      ],
  });
  this.budget_Chart = chart;
  
  }
 

  ////////////////////////////////////////////////////////


  getIncome(){
   
    this.IncomeHeadsList = [];
    this.IncomeHeadsAmountList = [];
  

    this.http.get(environment.mainApi+'acc/GetProfitDetailRpt?fromdate='+this.globalData.dateFormater(this.firstDay,'-')+'&todate='
      +this.globalData.dateFormater(this.lastDay,'-')).subscribe(
        (Response:any)=>{

         // console.log(Response);


          // this.IncomeHeadsList = [
          //   'salaries',
          //   'medical',
          //   'entertainment',
          //   'stationary',
          //   'printing',
          // ]

          // this.IncomeHeadsAmountList = [
          //   ['salaries', 29.9, false],
          //   ['medical', 71.5, false],
          //   ['entertainment', 106.4, false],
          //   ['stationery', 129.2, true, true],
          //   ['printing', 144.0, false],
          // ]

        if(Response != null){
          Response.forEach((obj:any) => {

            var amount = (obj.credit - obj.debit).toFixed();
            this.IncomeHeadsList.push(obj.coaTitle);
            var tmpArry:any = [];
            tmpArry.push(obj.coaTitle, parseFloat(amount), false);
            this.IncomeHeadsAmountList.push(tmpArry);
            
          });
        }
          
            this.IncomeDetailPieChart();

        },
        (Error)=>{
          
          this.IncomeDetailPieChart();
        }
      )
  }


  IncomeDetailPieChart() {
    let chart = new Chart({
      chart: {
        styledMode: false,
      },

      title: {
        text: 'INCOME ANALYSIS',
      },
      subtitle:{
        text:'CURRENT MONTH',
      },
      xAxis: {
        categories: this.IncomeHeadsList,
      },

      series: [
        {
          type: 'pie',
          allowPointSelect: true,
          
          keys: ['name', 'y', 'selected', 'sliced'],
          //keys: ['y', 'selected', 'sliced'],
          data: this.IncomeHeadsAmountList ,   
           showInLegend: true,
        },
      ],
    });
    this.Income_Detail_Chart = chart;
  }

  ///////////////////////////////////////////////////////


  getPrviousMonthIncome(){
   
    this.prevMonthIncomeHeadsList = [];
    this.prevMonthIncomeAmountList = [];
    


    this.http.get(environment.mainApi+'acc/GetProfitDetailRpt?fromdate='+this.globalData.dateFormater(this.priviousMonthFirstDay,'-')+'&todate='
      +this.globalData.dateFormater(this.priviousMonthLastDay,'-')).subscribe(
        (Response:any)=>{

          // this.IncomeHeadsList = [
          //   'salaries',
          //   'medical',
          //   'entertainment',
          //   'stationary',
          //   'printing',
          // ]

          // this.IncomeHeadsAmountList = [
          //   ['salaries', 29.9, false],
          //   ['medical', 71.5, false],
          //   ['entertainment', 106.4, false],
          //   ['stationery', 129.2, true, true],
          //   ['printing', 144.0, false],
          // ]

         if(Response != null){
           Response.forEach((obj:any) => {


            var amount = (obj.credit - obj.debit).toFixed();
            this.prevMonthIncomeHeadsList.push(obj.coaTitle);
            var tmpArry:any = [];
            tmpArry.push(obj.coaTitle, parseFloat(amount), false);
            this.prevMonthIncomeAmountList.push(tmpArry);
            
          });
          
         }
            this.previousIncomeDetailPieChart();

        },
        (Error)=>{
          this.previousIncomeDetailPieChart();
        }
      )
  }

  previousIncomeDetailPieChart() {
    let chart = new Chart({
      chart: {
        styledMode: false,
      },

      title: {
        text: 'INCOME ANALYSIS',
      },
      subtitle: {
        text: 'PREVIOUS MONTH'
           
    },

      xAxis: {
        categories: this.prevMonthIncomeHeadsList,
      },

      series: [
        {
          type: 'pie',
          allowPointSelect: true,
          
          keys: ['name', 'y', 'selected', 'sliced'],
          //keys: ['y', 'selected', 'sliced'],
          data: this.prevMonthIncomeAmountList ,   
           showInLegend: true,
        },
      ],
    });
    this.prvious_Income_Detail_Chart = chart;
  }


  /////////////////////////////////////////////////////////////

 roomBookingsData = [
    { roomNo: 1, bookings: 10 },
    { roomNo: 2, bookings: 20 },
    { roomNo: 3, bookings: 30 },
    { roomNo: 4, bookings: 40 },
    { roomNo: 5, bookings: 50 }
  ];

  getRoomsBooking(){
   
    const chart = new Chart( {
      chart: {
        type: 'columnrange'
      },
      title: {
        text: 'Room Bookings Between 2023-10-01 and 2023-10-07'
      },
      xAxis: {
        title: {
          text: 'Room No.'
        }
      },
      yAxis: {
        title: {
          text: 'Bookings'
        }
      },
      series: []
    });
  }


  getBookingBarChart(){

  //   const chart = new Chart( {

  //     chart: {
  //         type: 'columnrange',
  //         inverted: true
  //     },
  
     
  
  //     title: {
  //         text: 'Temperature variation by month'
  //     },
  
  //     subtitle: {
  //         text: 'Observed in Vik i Sogn, Norway, 2021 | ' +
  //             'Source: <a href="https://www.vikjavev.no/ver/" target="_blank">Vikjavev</a>'
  //     },
  
  //     xAxis: {
  //         categories: ['01', '02', '03', '04', '05', '06',
  //             '07', '08', '09', '10', '11', '12']
  //     },
  
  //     yAxis: {
  //         title: {
  //             text: 'Temperature ( °C )'
  //         }
  //     },
  
  //     tooltip: {
  //         valueSuffix: '°C'
  //     },
  
  //     plotOptions: {
  //         columnrange: {
  //             borderRadius: '50%',
  //             dataLabels: {
  //                 enabled: true,
  //                 format: '{y}°C'
  //             }
  //         }
  //     },
  
  //     legend: {
  //         enabled: false
  //     },
  
  //     series: [{
  //         type:'bar',
  //         name: 'Temperatures',
  //         data: [
  //             [13.9, 5.2],
  //             [16.7, 10.6],
  //             [4.7, 11.6],
  //             [4.4, 16.8],
  //             [2.1, 27.2],
  //             [5.9, 29.4],
  //             [6.5, 29.1],
  //             [4.7, 25.4],
  //             [4.3, 21.6],
  //             [3.5, 15.1],
  //             [9.8, 12.5],
  //             [11.5, 8.4]
  //         ]
  //     }]
  
  // });

  // const chart = new Chart(
  //    {   
  //     chart : {
  //        type: 'columnrange',
  //        inverted:true
  //     },
  //     title : {
  //        text: 'Temperature variation by month'   
  //     },
  //     subtitle : {
  //        text: 'Observed in Vik i Sogn, Norway, 2009'   
  //     },
  //     xAxis : {
  //        categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']      
  //     },
  //     yAxis : {     
  //        title: {
  //           text: 'Temperature ( \xB0C )'         
  //        }      
  //     },
  //     tooltip: {
  //        headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
  //           pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
  //           '<td style = "padding:0"><b>{point.y:.1f} mm</b></td></tr>',
  //           footerFormat: '</table>',
  //        shared: true,
  //        useHTML: true
  //     },
  //     plotOptions : {
  //        columnrange: {
  //           dataLabels: {
  //              enabled: true,
  //              formatter: function () {
  //                 return this.y + '\xB0C';
  //              }
  //           }
  //        }
  //     },
  //     credits : {
  //        enabled: false
  //     },
  //     series : [{
  //       type:'columnrange',
  //        name: 'Temperatures',
  //        data: [
  //           [-9.7, 9.4],
  //           [-8.7, 6.5],
  //           [-3.5, 9.4],
  //           [-1.4, 19.9],
  //           [0.0, 22.6],
  //           [2.9, 29.5],
  //           [9.2, 30.7],
  //           [7.3, 26.5],
  //           [4.4, 18.0],
  //           [-3.1, 11.4],
  //           [-5.2, 10.4],
  //           [-13.5, 9.8]
  //        ]
  //     }]
  //  })

  let chart = new Chart({
    chart: {
      type: 'columnrange',
      inverted: true
    },

    title: {
      text: 'Booking Table'
    },

    subtitle: {
      text: 'Current Month'
    },

    xAxis: {
      categories: [this.BookingsList.roomTitle]
    },

    yAxis: {
      opposite: true,
    type: "datetime",
    tickmarkPlacement: "on",
    tickInterval: 3600 * 1000,
    // dateTimeLabelFormats: {
    //   day: "%H:%M:%S",
    //   // week: "%H:%M:%S",
    //   month: "%H:%M:%S",
    //   year: "%H:%M:%S"
    // },

      title: {
        text: 'Date'
      },
      
    },

    // tooltip: {
    //   valueSuffix: '°C'
    // },

    // plotOptions: {
    //   columnrange: {
    //     dataLabels: {
    //       enabled: true,
    //       format: '{y}'
    //     }
    //   }
    // },

    legend: {
      enabled: false
    },

    series: [{
      type:'columnrange',
      name: 'Date',
      data: [
       this.BookingsList.dateOfArrival,this.BookingsList.dateOfDeparture


      ]
    }]
  });
    
   
  this.room_Booking_Chart = chart;
  
  }


  
  BookingsList:any = [];

  getBookings(){
    this.http.get(environment.mainApi+'acc/agetbooking').subscribe(
    (Response:any)=>{
      

      this.BookingsList =Response.filter((e:any)=>e.bookingStatus == 'Confirmed');
      // console.log(this.BookingsList);
      this.getBookingBarChart();
    }
    )
  }

}
