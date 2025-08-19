import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AddFinishedItemComponent } from './add-finished-item/add-finished-item.component';


@Component({
  selector: 'app-item-production',
  templateUrl: './item-production.component.html',
  styleUrls: ['./item-production.component.scss']
})
export class ItemProductionComponent {


  crudList: any = { c: true, r: true, u: true, d: true };

  page: number = 1;
  count: number = 0;

  tableSize: number = 0;
  tableSizes: any = [];

  onTableDataChange(event: any) {

    this.page = event;
    this.getSavedData();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getSavedData();
  }

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    private global: GlobalDataModule,
    private app: AppComponent,
    private route: Router

  ) {


    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    });

  }


  ngOnInit(): void {
    this.global.setHeaderTitle('Item Production');

    this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;
  }




  add(){

     this.dialogue.open(AddFinishedItemComponent,{
          width:'90%',
        }).afterClosed().subscribe(value =>{
          if(value == 'update'){
              this.getSavedData();
          }
        })

  }


  savedDataList:any = [];

  getSavedData() {

  }


}
