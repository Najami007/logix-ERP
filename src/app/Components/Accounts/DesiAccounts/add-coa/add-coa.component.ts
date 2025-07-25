import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-coa',
  templateUrl: './add-coa.component.html',
  styleUrls: ['./add-coa.component.scss']
})
export class AddCoaComponent implements OnInit {

  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    private globaldata: GlobalDataModule,
    private app: AppComponent,
    private route: Router

  ) {


    this.globaldata.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    });

  }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Charts Of Account');
    this.getCoaType();
    this.getSavedData('EXP');



  }

  txtSearch: any;
  coaTitle: any;
  coaID: number = 0;
  btnType: any = 'Save';
  description: any;



  notesList: any = [];
  coaTypesList: any = [];

  savedDataList: any = [];
  CoaTypeID: any = 0;
  level1 = '';
  level2 = '';
  level3 = '';
  level4 = '';
  TransactionAllowed = true;
  NoteID = 0;
  FilterType = 'EXP';

  searchType: any = [{ value: 'EXP', title: 'Expense' }, { value: 'INC', title: 'Income' },]
  ///////////////////////////// will get the notes list

  getNotes() {
    this.http.get(environment.mainApi + this.globaldata.accountLink + 'GetNote').subscribe(
      (Response) => {
        this.notesList = Response;

      }

    )
  }






  //////////////////////////// will get the coa main five types///////////////////

  getCoaType() {
    this.http.get(environment.mainApi + this.globaldata.accountLink + 'getcoatype').subscribe(
      {
        next: value => {
          this.coaTypesList = value;
        },
        error: error => {

        }
      }
    )
  }



  getSavedData(type: any) {
    this.globaldata.getCashBankCoa(type)
      .subscribe(
        (Response: any) => {
          this.savedDataList = Response;
        },
        (Error) => {

        }
      )
  }




  save() {
    if (this.btnType == 'Save' && (this.CoaTypeID == '' || this.CoaTypeID == undefined || this.CoaTypeID == 0)) {
      this.msg.WarnNotify('Select COA Type');
      return;
    }

    if (this.coaTitle == '' || this.coaTitle == undefined) {
      this.msg.WarnNotify('Enter COA Title');
      return;
    }
    var postData = {
      CoaID: this.coaID,
      CoaTitle: this.coaTitle,
      CoaTypeID: this.CoaTypeID,
      Level1: this.level1.toString(),
      Level2: '',
      Level3: '',
      Level4: '',
      TransactionAllowed: this.TransactionAllowed,
      Editable: false,
      IsService: false,
      noteID: this.NoteID,
      UserID: this.globaldata.getUserID(),
    }




    if (this.btnType == 'Save') {
      if (this.CoaTypeID == 2) {
        this.globaldata.getCashBankCoa('EXP').subscribe((Response: any) => {
          var level:any =  parseFloat(Response.sort((a: any, b: any) => b.accountCode - a.accountCode)[0].accountCode.split('.')[1]) + 1;
          postData.Level1 = level.toString();
          // this.level1 = Response.length + 1; 
          this.insert(postData);
        })
      }


      if (this.CoaTypeID == 3) {
        this.globaldata.getCashBankCoa('INC').subscribe((Response: any) => {
           var level:any =  parseFloat(Response.sort((a: any, b: any) => b.accountCode - a.accountCode)[0].accountCode.split('.')[1]) + 1;
               postData.Level1 = level.toString();
          // this.level1 = Response.length + 1;
          this.insert(postData);
        })
      }

    } else if (this.btnType == 'Update') {
      this.update(postData);
    }
  }


  insert(postData: any) {

    this.app.startLoaderDark();
    this.http.post(environment.mainApi + this.globaldata.accountLink + 'InsertChartOfAccount', postData).subscribe(
      (Response: any) => {
        if (Response.msg == "Data Saved Successfully") {
          this.msg.SuccessNotify(Response.msg);
          this.getSavedData(this.FilterType);
          this.reset();
        } else {
          this.msg.WarnNotify(Response.msg);
        }
        this.app.stopLoaderDark();
      },
      (Error:any)=>{
        console.log(Error);
         this.app.stopLoaderDark();
      }

    )
  }

  update(postData: any) {

    this.globaldata.openPinCode().subscribe(pin => {
      if (pin != '') {
        this.app.startLoaderDark();
        postData['PinCode'] = pin;
        this.http.post(environment.mainApi + this.globaldata.accountLink + 'UpdateChartofAccount', postData).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Updated Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getSavedData(this.FilterType);
              this.reset();
            } else {
              this.msg.WarnNotify(Response.msg);
            }
            this.app.stopLoaderDark();
          },
      (Error:any)=>{
        console.log(Error);
         this.app.stopLoaderDark();
      }
        )
      }
    })
  }



  reset() {
    this.coaTitle = '';
    this.coaID = 0;
    this.NoteID = 0;
    this.level1 = '';
    this.level2 = '';
    this.level3 = '';
    this.level4 = '';
    this.CoaTypeID = 0;
    this.description = '';
    this.btnType = 'Save';

  }


  edit(row: any) {
    this.coaID = row.coaID;
    this.NoteID = row.noteID;
    this.CoaTypeID = row.coaTypeID;
    this.coaTitle = row.coaTitle;
    this.btnType = 'Update';
  }


  ///////////////////////////////////////////////////////////////////////////////
  delete(row: any) {
    this.globaldata.openPinCode().subscribe(pin => {
      if (pin != '') {

        this.app.startLoaderDark();
        this.http.post(environment.mainApi + this.globaldata.accountLink + 'DeleteChartOfAccount', {
          CoaID: row.coaID,
          PinCode: pin,
          AccountCode: row.accountCode,
          UserID: this.globaldata.getUserID(),
        }).subscribe(
          (Response: any) => {
            if (Response.msg == "Data Deleted Successfully") {
              this.msg.SuccessNotify(Response.msg);
              this.getSavedData(this.FilterType);

            } else {
              this.msg.WarnNotify(Response.msg);
            }
            this.app.stopLoaderDark();
          },
          (error: any) => {
            this.app.stopLoaderDark();
          }
        )

      }
    })

  }

}

