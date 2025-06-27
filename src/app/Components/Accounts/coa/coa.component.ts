import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { UpdateCoaComponent } from './update-coa/update-coa.component';
import Swal from 'sweetalert2';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import { Route, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AddChartOfAccountComponent } from './add-chart-of-account/add-chart-of-account.component';

@Component({
  selector: 'app-coa',
  templateUrl: './coa.component.html',
  styleUrls: ['./coa.component.scss']
})
export class COAComponent implements OnInit {

  @ViewChild(AddChartOfAccountComponent) addCoa: any;

  modUrl = this.route.url.split("/")[1];

  constructor(private msg: NotificationService,
    private app: AppComponent,
    private route: Router,
    private formBuilder: FormBuilder,
    public globalData: GlobalDataModule,
    private http: HttpClient,
    private dialogue: MatDialog
  ) {

    this.globalData.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })



  }



  filterHaveNoteID = 0;
  filterTransactionType: any = 'all';
  filterCoaType = 0;
  filterNoteID = 0;

  filterCOA(type: any) {

    if (type == 'coaType') {
      this.filterNoteID = 0;
      this.filterTransactionType = 'all';
      this.filterHaveNoteID = 0;

      this.filterCoaType == 0
        ? this.ChartsofAccountsData = this.tmpCoaData
        : this.ChartsofAccountsData = this.tmpCoaData.filter((e: any) => e.coaTypeID == this.filterCoaType);
    }

    if (type == 'transactionAllowed') {
      this.filterNoteID = 0;
      this.filterTransactionType == 'all'
        ? this.ChartsofAccountsData =
        this.filterCoaType > 0
          ? this.tmpCoaData.filter((e: any) => e.coaTypeID == this.filterCoaType) : this.ChartsofAccountsData = this.tmpCoaData
        : this.ChartsofAccountsData =
        this.filterCoaType > 0
          ? this.tmpCoaData.filter((e: any) => e.coaTypeID == this.filterCoaType && e.transactionAllowed == this.filterTransactionType)
          : this.tmpCoaData.filter((e: any) => e.transactionAllowed == this.filterTransactionType);
    }

    if (type == 'note') {
      this.filterTransactionType = 'all';

      this.filterNoteID == 0
        ? this.ChartsofAccountsData =
        this.filterCoaType > 0
          ? this.tmpCoaData.filter((e: any) => e.coaTypeID == this.filterCoaType)
          : this.ChartsofAccountsData = this.tmpCoaData
        : this.filterCoaType > 0
          ? this.ChartsofAccountsData = this.tmpCoaData.filter((e: any) => e.coaTypeID == this.filterCoaType && e.noteID == this.filterNoteID)
          : this.ChartsofAccountsData = this.tmpCoaData.filter((e: any) => e.noteID == this.filterNoteID);

    }

    if (type == 'haveNote') {

      this.filterNoteID = 0;
      this.filterTransactionType = 'all';
      this.filterCoaType = 0;
      if (this.filterHaveNoteID == 0) {
        this.ChartsofAccountsData = this.tmpCoaData
      }
      if (this.filterHaveNoteID == 1) {
        this.ChartsofAccountsData = this.tmpCoaData.filter((e:any)=> e.noteID > 0 && (e.coaTypeID == 1 || e.coaTypeID == 4 || e.coaTypeID == 5))
      }
       if (this.filterHaveNoteID == 2) {
        this.ChartsofAccountsData = this.tmpCoaData.filter((e:any)=> e.noteID == 0 && (e.coaTypeID == 1 || e.coaTypeID == 4 || e.coaTypeID == 5))
      }
      
    }

  }

  ngOnInit(): void {
    this.globalData.setHeaderTitle('Chart Of Account');
    this.getCoaType();
    this.globalData.numberOnly();
    this.getNotes();

  }




  numberOnly(val: any) {
    this.globalData.avoidMinus(val);
  }

  crudList: any = { c: true, r: true, u: true, d: true };
  error: any;
  coaSearch: any;
  actionbtn = 'Save';
  alias: any = 'other';

  CoaType = 0;
  coaLevel: any;
  level1 = '';
  level2 = '';
  level3 = '';
  level4 = '';
  CoaTitle = '';
  TransactionAllowed = false;

  NoteID: any = 0;

  disableNote = true;




  coaTypesList: any = [];
  ChartsofAccountsData: any = [];

  coaLevel1List: any = [];
  coaLevel2List: any = [];
  coaLevel3List: any = [];
  coaLevel4List: any = [];

  LevelList: any = [];
  notesList: any = [];



  Allow = [
    { value: true, text: 'Yes' },

  ]



  //////////////setting the value of account head level above Head Name field/////////////////

  AccountLabelHeadValue: any = '';

  ///////////////////////////////

  sortData(type: any) {
    if (type == 'title') {
      this.ChartsofAccountsData = this.globalData.sortByKey(this.ChartsofAccountsData, 'coaTitle', 'asc')
    }
    if (type == 'code') {
      this.ChartsofAccountsData = this.globalData.sortByKey(this.ChartsofAccountsData, 'accountCode', 'asc')
    }
    if (type == 'type') {
      this.ChartsofAccountsData = this.globalData.sortByKey(this.ChartsofAccountsData, 'coaTypeTitle', 'asc')
    }

  }

  setvalue() {

    if (this.coaLevel == 1) {
      this.AccountLabelHeadValue = this.level1;
    } else if (this.coaLevel == 2) {

      this.AccountLabelHeadValue = this.level1 + '.' + this.level2;
    } else if (this.coaLevel == 3) {

      this.AccountLabelHeadValue = this.level1 + '.' + this.level2 + '.' + this.level3;
    } else if (this.coaLevel == 4) {
      // if(this.levelInput == null){
      //   this.AccountLabelHeadValue = '';
      //  }
      this.AccountLabelHeadValue = this.level1 + '.' + this.level2 + '.' + this.level3 + '.' + this.level4;
    }
  }





  /////////////////////////////

  onCoaTypeChange() {
    this.LevelList = [
      { value: 1, level: 'level 1' },
      { value: 2, level: 'level 2' },
      { value: 3, level: 'level 3' },
      { value: 4, level: 'level 4' },

    ];
    this.getLevel1();
    this.level1 = '';
    this.level2 = '';
    this.level3 = '';
    this.level4 = '';
    this.TransactionAllowed = false;
    this.alias = 'other';
    this.NoteID = 0;


  }

  /////////////////////////////

  onCoaLevelChange() {
    this.level1 = '';
    this.level2 = '';
    this.level3 = '';
    this.level4 = '';


    this.coaLevel2List = [];
    this.coaLevel3List = [];
    this.coaLevel4List = [];
  }


  /////////////////////////////
  onlevel1Change() {
    this.getLevel2();
  }

  /////////////////////////////
  onlevel2Change() {
    this.getLevel3();
  }

  /////////////////////////////
  onlevel3Change() {
    this.getLevel4();
  }



  //////////////////////////////////////////////////



  //////////////////////////// will get the coa main five types///////////////////

  getCoaType() {
    this.http.get(environment.mainApi + this.globalData.accountLink + 'getcoatype').subscribe(
      (Response: any) => {
        this.coaTypesList = Response;
        if (Response.length > 0) {
          this.filterCoaType = Response[0].coaTypeID;
        }
        this.GetChartOfAccount();
      },
      (error: any) => {
        console.log(error);
      }

    )
  }



  ///////////////////////////// will get the notes list

  getNotes() {
    this.http.get(environment.mainApi + this.globalData.accountLink + 'GetNote').subscribe(
      (Response) => {
        this.notesList = Response;

      }

    )
  }


  tmpCoaData: any = [];
  //////////////////////////////////////////////////////////
  GetChartOfAccount() {
    this.http.get(environment.mainApi + this.globalData.accountLink + 'GetChartOfAccount').subscribe(
      {
        next: value => {
          this.tmpCoaData = value;
          this.tmpCoaData.forEach((e: any) => {
            if (e.level1 == null) {
              e.level1 = '';
            }
            if (e.level2 == null) {
              e.level2 = '';
            }
            if (e.level3 == null) {
              e.level3 = '';
            }
            if (e.level4 == null) {
              e.level4 = '';
            }
          });
          setTimeout(() => {
            this.filterCOA('coaType');
          }, 200);
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }


  ///////////////////////////////////////

  getLevel1() {
    this.http.get(environment.mainApi + this.globalData.accountLink + 'getlevel1?level0=' + this.CoaType).subscribe(
      {
        next: value => {
          this.coaLevel1List = value;
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }

  /////////////////////////////////////////////////

  getLevel2() {
    this.http.get(environment.mainApi + this.globalData.accountLink + 'getlevel2?level0=' + this.CoaType + '&level1=' + this.level1).subscribe(
      {
        next: value => {
          this.coaLevel2List = value;
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }


  ////////////////////////////////////
  getLevel3() {
    this.http.get(environment.mainApi + this.globalData.accountLink + 'getlevel3?level0=' + this.CoaType + '&level1=' + this.level1 + '&level2=' + this.level2).subscribe(
      {
        next: value => {
          this.coaLevel3List = value;
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }


  //////////////////////////////
  getLevel4() {
    this.http.get(environment.mainApi + this.globalData.accountLink + 'getlevel4?level0=' + this.CoaType + '&level1=' + this.level1 + '&level2=' + this.level2 + '&level3=' + this.level3).subscribe(
      {
        next: value => {
          this.coaLevel4List = value;
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }


  //////////////////////////save Button Functtion/////////////////////////////

  Save() {

    var postData = {
      CoaTitle: this.CoaTitle,
      Alias: this.alias,
      CoaTypeID: this.CoaType,
      Level1: this.level1.toString(),
      Level2: this.level2.toString(),
      Level3: this.level3.toString(),
      Level4: this.level4.toString(),
      TransactionAllowed: this.TransactionAllowed,
      Editable: false,
      IsService: false,
      noteID: this.NoteID,
      UserID: this.globalData.getUserID(),
    }

    if (this.CoaType == 0 || this.CoaType == undefined) {
      this.msg.WarnNotify('Select the Charts Of Accouts Type')
    } else if (this.coaLevel == '' || this.coaLevel == undefined) {
      this.msg.WarnNotify('Select COA Level')
    } else if (this.coaLevel == 1 && (this.level1 == '' || this.level1 == undefined || this.level1 == null)) {
      this.msg.WarnNotify('Enter Level 1')
    } else if (this.coaLevel == 2 && (this.level1 == "" || this.level1 == undefined)) {
      this.msg.WarnNotify('Select Level 1')
    } else if (this.coaLevel == 2 && (this.level2 == "" || this.level2 == undefined)) {
      this.msg.WarnNotify('Enter Level 2')
    } else if (this.coaLevel == 3 && (this.level1 == "" || this.level1 == undefined)) {
      this.msg.WarnNotify('Select Level 1')
    } else if (this.coaLevel == 3 && (this.level2 == "" || this.level2 == undefined)) {
      this.msg.WarnNotify('Select Level 2')
    } else if (this.coaLevel == 3 && (this.level3 == "" || this.level3 == undefined)) {
      this.msg.WarnNotify('Enter Level 3')
    } else if (this.coaLevel == 4 && (this.level1 == "" || this.level1 == undefined)) {
      this.msg.WarnNotify('Select Level 1')
    } else if (this.coaLevel == 4 && (this.level2 == "" || this.level2 == undefined)) {
      this.msg.WarnNotify('Select Level 2')
    } else if (this.coaLevel == 4 && (this.level3 == "" || this.level3 == undefined)) {
      this.msg.WarnNotify('Select Level 3')
    } else if (this.coaLevel == 4 && (this.level4 == "" || this.level4 == undefined)) {
      this.msg.WarnNotify('Enter Level 4')
    } else if (this.CoaTitle == '' || this.CoaTitle == undefined) {
      this.msg.WarnNotify('COA Title Required');
    } else if (((this.CoaType == 1 || this.CoaType == 4 || this.CoaType == 5) && this.TransactionAllowed == true)
      && (this.NoteID == 0 || this.NoteID == undefined || this.NoteID == '')) {
      this.msg.WarnNotify('Select The Note');
    }
    else {
      this.insertCOA(postData);
    }

  }

  insertCOA(postData: any) {
    this.app.startLoaderDark();
    this.http.post(environment.mainApi + this.globalData.accountLink + 'InsertChartOfAccount', postData).subscribe(
      (Response: any) => {
        if (Response.msg == "Data Saved Successfully") {
          this.msg.SuccessNotify(Response.msg);
          this.GetChartOfAccount();
          this.reset();
          this.app.stopLoaderDark();
          this.globalData.closeBootstrapModal('#addCoaForm', true);
        } else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      }

    )

  }


  saveNewCoa() {
    var postData = {
      CoaTitle: this.addCoa.CoaTitle,
      Alias: this.addCoa.alias,
      CoaTypeID: this.addCoa.CoaType,
      Level1: this.addCoa.level1,
      Level2: this.addCoa.level2,
      Level3: this.addCoa.level3,
      Level4: this.addCoa.level4,
      TransactionAllowed: this.addCoa.TransactionAllowed,
      Editable: false,
      IsService: false,
      noteID: this.addCoa.NoteID,
      UserID: this.globalData.getUserID(),
    }

    if (this.addCoa.CoaTitle == '') {
      this.msg.WarnNotify('Enter Coa Title');
      return;
    }
    if (this.addCoa.alias == '') {
      this.msg.WarnNotify('Enter Alias');
      return;
    }
    if (this.addCoa.coaLevel == 1 && (this.addCoa.level1 == '' || this.addCoa.level1 == undefined)) {
      this.msg.WarnNotify('Enter Level 1');
      return;
    }
    if (this.addCoa.coaLevel == 2 && (this.addCoa.level2 == '' || this.addCoa.level2 == undefined)) {
      this.msg.WarnNotify('Enter Level 2');
      return;
    }
    if (this.addCoa.coaLevel == 3 && (this.addCoa.level3 == '' || this.addCoa.level3 == undefined)) {
      this.msg.WarnNotify('Enter Level 3');
      return;
    }
    if (this.addCoa.coaLevel == 4 && (this.addCoa.level4 == '' || this.addCoa.level4 == undefined)) {
      this.msg.WarnNotify('Enter Level 4');
      return;
    }




    this.insertCOA(postData);

  }



  updateCoa(row: any) {
    if (this.crudList.u == false) {
      this.msg.WarnNotify('Not Allowed to Edit')
    } else {

      this.dialogue.open(UpdateCoaComponent, {
        width: "40%",
        data: row,

      }).afterClosed().subscribe(val => {

        if (val == 'Update') {
          this.GetChartOfAccount();
        }
      })
    }

  }




  insertNewCoa(item: any) {
    this.globalData.openBootstrapModal('#addCoaForm', true);
    this.addCoa.CoaType = item.coaTypeID;
    this.addCoa.level1 = item.level1;
    this.addCoa.level2 = item.level2;
    this.addCoa.level3 = item.level3;
    this.addCoa.level4 = item.level4;
    this.addCoa.CoaTitle = '';
    this.addCoa.NoteID = 0;
    this.addCoa.TransactionAllowed = false;
    this.addCoa.alias = 'other';
    if (item.level1 == '') {
      this.addCoa.coaLevel = 1;
    }
    if (item.level2 == '' && item.level1 != '') {
      this.addCoa.coaLevel = 2;
    }
    if (item.level3 == '' && item.level2 != '') {
      this.addCoa.coaLevel = 3;
    }
    if (item.level4 == '' && item.level3 != '') {
      this.addCoa.coaLevel = 4;
    }
  }






  ///////////////////////////////////////////////////////////////////////////////
  deleteCoa(row: any) {
    this.globalData.openPinCode().subscribe(pin => {
      if (pin != '') {

        //////on confirm button mainApi the api will run
        this.http.post(environment.mainApi + this.globalData.accountLink + 'DeleteChartOfAccount', {
          CoaID: row.coaID,
          PinCode: pin,
          AccountCode: row.accountCode,
          UserID: this.globalData.getUserID(),
        }).subscribe(
          (Response: any) => {
            if (Response.msg == "Data Deleted Successfully") {
              this.msg.SuccessNotify(Response.msg);
              this.GetChartOfAccount();
            } else {
              this.msg.WarnNotify(Response.msg);
            }
          },
          (error: any) => {
            this.error = error;
            // this.msg.WarnNotify(error);
            console.log(this.error);
          }
        )

      }
    })

  }
  //////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////will change the level Input field value if ///////////////////////////
  ////////////////////// value is in minue ///////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  changeValue(val: any) {
    // alert(val.target.value);
    if (val.target.value < '0') {
      val.target.value = '';
    }
  }


  reset() {
    this.CoaType = 0;
    this.coaLevel = '';
    this.alias = 'other';
    this.level1 = '';
    this.level2 = '';
    this.level3 = '';
    this.level4 = '';
    this.AccountLabelHeadValue = '';
    this.CoaTitle = '';
    this.TransactionAllowed = false;
    this.NoteID = 0;

  }







}