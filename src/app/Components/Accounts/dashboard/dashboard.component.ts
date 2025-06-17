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
export class DashboardComponent implements OnInit {


  constructor(private globalData: GlobalDataModule,
    private http: HttpClient,

  ) {

  }

  expenseIcon = '../../assets/Images/expIcon.png';
  shopIcon = '../../assets/Images/shopIcons.png'
  incomeIcon = '../../assets/Images/incomeIcon.png';


  income_expense_chart: Chart | undefined;
  Acounts_Chart: Chart | undefined;

  profit_loss_chart: Chart | undefined;
  profit_Line_Chart: Chart | undefined;

  budget_Chart: Chart | undefined;
  Income_Detail_Chart: Chart | undefined;
  Expense_Detail_Chart: Chart | undefined;
  room_Booking_Chart: Chart | undefined;


  credentials: any;
  ngOnInit(): void {
    this.getCardsData();
    this.getBudget();
    this.GetIncExp();
    this.getIncome();
    this.getExpense();
    // this.getBookings();
    this.globalData.setHeaderTitle('Finance DashBoard');


    this.getAnuualProfit();

    //this.getbudgetChart();


  }

  budgetData: any;
  budgetMonth = new Date();
  titleList: any = [];
  budgetAmountList: any = [];
  consumedAmountList: any = [];

  IncomeList: any = [];
  ExpenseList: any = [];
  MonthList: any = []

MonthNameList: any = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];



  date = new Date(Date.now());

  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  priviousMonthFirstDay = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
  priviousMonthLastDay = new Date(this.date.getFullYear(), this.date.getMonth(), 0);

  IncomeHeadsList: any = [];
  IncomeHeadsAmountList: any = [];

  expenseHeadList: any = [];
  ExpenseAmountList: any = []


  cardsData: any = [{ totalRooms: 0, mappedRooms: 0, totalExpense: 0, totalIncome: 0 }]

  //////////////////////////////////
  getCardsData() {

    this.http.get(environment.mainApi + 'acc/GetTotals').subscribe(
      (Response: any) => {
        //console.log(Response)
        if (Response != null) {
          this.cardsData = Response;
        }
        //console.log(Response);

      }
    )
  }




  ////////////////////////////////////////////////

  GetIncExp() {
    this.http.get(environment.mainApi + 'acc/GetIncExp').subscribe(
      (Response: any) => {
        //console.log(Response);



        if (Response.length > 0) {
          Response.forEach((e: any) => {

            if (e.coaTypeID == 2) {
              this.ExpenseList.push(Math.round(e.amount));
            }

            if (e.coaTypeID == 3) {
              this.IncomeList.push(Math.round(e.amount));
            }

            this.incomeExpenseChart();
          });
          var monthList = this.globalData.filterUniqueValuesByKey(Response, 'month');
          monthList.forEach((e: any) => {
            this.MonthList.push(this.MonthNameList[e.month - 1]);
          })
        }


        this.incomeExpenseChart();
      }
    )
  }



  incomeExpenseChart() {
    let chart = new Chart({
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
          text: 'AMOUNT',
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
          name: 'INCOME',
          type: 'column',



          data: this.IncomeList,
        },
        {
          name: 'EXPENSE',
          type: 'column',

          data: this.ExpenseList,
        },
      ],
    });
    this.income_expense_chart = chart;
  }


  ////////////////////////////////////////////

  getBudget() {

    var projectID = this.globalData.getProjectID();
    var date = this.globalData.dateFormater(this.budgetMonth,'');
    var url = `acc/GetMonthlyBudget?BudgetDate=${date}&projectid=${projectID}`;

    this.http.get(environment.mainApi + url).subscribe(
      (Response: any) => {
        this.budgetData = Response;

        console.log(Response);
        Response.forEach((e: any) => {
          this.titleList.push(e.coaTitle);
          this.budgetAmountList.push(Math.round(e.budgetAmount));
          this.consumedAmountList.push(Math.round(e.consumedAmount));
        });

        this.getbudgetChart();

      }
    )

  }



  getbudgetChart() {
    var chart = new Chart({
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
        min: 0,
        allowDecimals: false,
        title: {
          text: 'AMOUNT'
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
          name: 'BUDGET AMOUNT',
          type: 'column',
          color: 'green',


          data: this.budgetAmountList
          ,
        },
        {
          name: 'CONSUMED',
          type: 'column',
          color: 'red',
          data: this.consumedAmountList,

        },
      ],
    });
    this.budget_Chart = chart;

  }


  ////////////////////////////////////////////////////////


  getIncome() {

    this.IncomeHeadsList = [];
    this.IncomeHeadsAmountList = [];


    this.http.get(environment.mainApi + 'acc/GetProfitRpt?fromdate=' + this.globalData.dateFormater(this.firstDay, '-') + '&todate='
      + this.globalData.dateFormater(this.lastDay, '-')).subscribe(
        (Response: any) => {

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

          if (Response != null) {
            Response.forEach((obj: any) => {

              var amount = (obj.credit - obj.debit).toFixed();
              this.IncomeHeadsList.push(obj.coaTitle);
              var tmpArry: any = [];
              tmpArry.push(obj.coaTitle, Math.round(parseFloat(amount)), false);
              this.IncomeHeadsAmountList.push(tmpArry);

            });
          }

          this.IncomeDetailPieChart();

        },
        (Error) => {

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
      subtitle: {
        text: 'CURRENT MONTH',
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
          data: this.IncomeHeadsAmountList,
          showInLegend: true,
        },
      ],
    });
    this.Income_Detail_Chart = chart;
  }

  ///////////////////////////////////////////////////////


  getExpense() {

    this.expenseHeadList = [];
    this.ExpenseAmountList = [];



    this.http.get(environment.mainApi + 'acc/GetLossRpt?fromdate=' + this.globalData.dateFormater(this.firstDay, '-') + '&todate='
      + this.globalData.dateFormater(this.lastDay, '-')).subscribe(
        (Response: any) => {
          //  console.log(Response);
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

          if (Response != null) {
            Response.forEach((obj: any) => {


              var amount = (obj.debit - obj.credit).toFixed();
              this.expenseHeadList.push(obj.coaTitle);
              var tmpArry: any = [];
              tmpArry.push(obj.coaTitle, Math.round(parseFloat(amount)), false);
              this.ExpenseAmountList.push(tmpArry);


            });

          }
          //console.log(this.ExpenseAmountList)
          this.ExpenseDetailChart();

        },
        (Error) => {
          this.ExpenseDetailChart();
        }
      )
  }

  ExpenseDetailChart() {
    let chart = new Chart({
      chart: {
        styledMode: false,
      },

      title: {
        text: 'EXPENSE ANALYSIS',
      },
      subtitle: {
        text: 'CURRENT MONTH'

      },

      xAxis: {
        
        categories: this.expenseHeadList,
        
      },

      series: [
        {
          type: 'pie',
          allowPointSelect: true,
          
          keys: ['name', 'y', 'selected', 'sliced'],
          //keys: ['y', 'selected', 'sliced'],
          data: this.ExpenseAmountList,
          showInLegend: true,
        },
      ],
    });
    this.Expense_Detail_Chart = chart;
  }


  /////////////////////////////////////////////////////////////

  roomBookingsData = [
    { roomNo: 1, bookings: 10 },
    { roomNo: 2, bookings: 20 },
    { roomNo: 3, bookings: 30 },
    { roomNo: 4, bookings: 40 },
    { roomNo: 5, bookings: 50 }
  ];




  BookingsList: any = [];



  //////////////////////////////////////////////////


  profitMonthList:any = [];
  profitAmountList:any = [];

  getAnuualProfit(){
    this.http.get(environment.mainApi+this.globalData.accountLink +'GetMonthProfitChartData').subscribe(
      (Response:any)=>{
        if(Response.length > 0){


          Response.forEach((e:any) => {

            this.profitAmountList.push(Math.round(e.amount));
            this.profitMonthList.push(this.MonthNameList[e.month - 1]);
          });
          //  var monthList = this.globalData.filterUniqueValuesByKey(Response, 'month');
          // monthList.forEach((e: any) => {
          //   this.profitMonthList.push(this.MonthNameList[e.month - 1]);
          // })
        }



        this.AnnualProfitLoss();
      }
    )
  }


  AnnualProfitLoss() {
    let chart = new Chart({
      chart: {
        type: 'line',
      },
      title: {
        text: 'ANALYSIS PROFIT & LOSS (ANNUAL)',
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        categories: this.profitMonthList,
      },
      yAxis: {
        title: {
          text: 'AMOUNT ',
        },
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
          },
          enableMouseTracking: false,
        },
      },
      series: [
        {
          name: 'PROFIT / LOSS',
          type: 'line',
          data: this.profitAmountList,
        },
      ],
    });
    this.profit_Line_Chart = chart;
  }

}
