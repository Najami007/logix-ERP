import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

@Component({
  selector: 'app-app-home-panel',
  templateUrl: './app-home-panel.component.html',
  styleUrls: ['./app-home-panel.component.scss']
})
export class AppHomePanelComponent {


  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    public global: GlobalDataModule,
    private app: AppComponent,
    private route: Router,
    private titleService: Title

  ) {

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());

    })
  }


  ngOnInit(): void {
    this.global.setHeaderTitle('APP Home Screen');

  }



  openEditModal(){
    this.global.openBootstrapModal('#changeDetail',true)
  }

}
