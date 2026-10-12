import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { error } from 'jquery';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

export interface Mine {
  id: number;
  mineName: string;
  description: string;
}

@Component({
  selector: 'app-add-mine',
  templateUrl: './add-mine.component.html',
  styleUrls: ['./add-mine.component.scss']
})
export class AddMineComponent implements OnInit {


  public global = inject(GlobalDataModule);
  public http = inject(HttpClient);
  public app = inject(AppComponent);
  public msg = inject(NotificationService)


  page: number = 1;
  count: number = 0;

  tableSize: number = 0;
  tableSizes: any = [];
  jumpPage: any = 0;
  tmpPage: number = 0;

  onTableDataChange(event: any) {

    this.page = event;
    this.getSavedData();

  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getSavedData();

  }



  onProdSearchKeyup(e: any, value: any) {

    if (e.target.value.length == 0 && this.tmpPage == 0) {
      this.tmpPage = this.page;
      this.page = 1;
    }
    if (e.key == 'Backspace') {
      if (value.length == 1) {
        this.page = this.tmpPage;
        this.tmpPage = 0;
      }
    }


  }




  ngOnInit(): void {
    this.global.setHeaderTitle('Mine');
    this.getSavedData();
      this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;
  }


  model = this.blankModel();

  blankModel() {
    return { mineID: 0, mineName: '', description: '' };
  }

  get editMode():boolean{
    return this.model.mineID > 0;
  }

  savedMines: any = [];
  searchText = '';



  getSavedData() {
    var url = `${environment.mainApi + this.global.miningLink}GetMine`;
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.savedMines = Response;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }


  onSubmit(): void {

    if (this.model.mineName == '') {
      this.msg.WarnNotify("Enter Mine Name");
      return;
    }


    var payload = {
      MineID: this.model.mineID,
      MineName: this.model.mineName,
      Description: this.model.description || '-',
      PinCode: '',
      UserId: this.global.getUserID(),

    }


    if (this.model.mineID > 0) {
      this.global.openPinCode().subscribe(pin => {
        if (pin != '') {
          payload.PinCode = pin;
          this.saveMine('update', payload);
        }
      })
    } else {
      this.saveMine('insert', payload)
    }

    // TODO: call your service here instead of using the local array

  }


  saveMine(type: any, payload: any) {


    const insertType = {
      insert: 'InsertMine',
      update: 'UpdateMine',
      delete: 'DeleteMine',
      status: 'ActiveMine'
    }[type];


    var url = `${environment.mainApi + this.global.miningLink}${insertType}`;

    console.log(url, payload);
    this.app.startLoaderDark();
    this.http.post(url, payload).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully'
            || Response.msg == 'Data Updated Successfully'
            || Response.msg == 'Data Deleted Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.getSavedData();
            this.resetForm();

          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
        },
        error: (error) => {
          console.log(error);
          this.app.stopLoaderDark();
        }
      }
    )

  }


  editMine(mine: any): void {
    this.model = { mineID: mine.mineID, mineName: mine.mineName, description: mine.description };
  }

  deleteMine(id: number): void {
    var payload = {
      MineID: this.model.mineID,
      PinCode: '',
      UserId: this.global.getUserID(),
    }

    this.global.openPinCode().subscribe(pin=>{
      if(pin != ''){
        payload.PinCode = pin;
        this.saveMine('delete',payload);
      }
    })

  }

  resetForm(): void {

    this.model = this.blankModel();
  }
}