import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Host, HostBinding, Inject, OnInit, Output, Renderer2, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { ChangePasswordComponent } from '../../User/change-password/change-password.component';
import { ChangePINComponent } from '../../User/change-pin/change-pin.component';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { MainComponent } from '../main/main.component';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from 'ngx-toastr';
import { UpdateSubscriptionComponent } from '../../User/update-subscription/update-subscription.component';


@Component({
  selector: 'app-navigation-menu-bar2',
  templateUrl: './navigation-menu-bar2.component.html',
  styleUrls: ['./navigation-menu-bar2.component.scss']
})
export class NavigationMenuBar2Component {

  clickEventSubscription: Subscription;

  public menuList?: any = [];
  moduleID?: string | null;

  NotificationFeature = this.globalData.NotificationFeature;


  subscriptionFeature = this.globalData.getFeature('')


  @Output() toggleMySideBar: EventEmitter<any> = new EventEmitter();
  toggleControl: any;
  constructor(private globalData: GlobalDataModule,
    private msg: NotificationService,
    private http: HttpClient,
    private route: Router,
    private dialogue: MatDialog,
    private app: AppComponent,
    private m: MainComponent,
    private overlay: OverlayContainer,

    private render: Renderer2,
  ) {

    this.clickEventSubscription = this.globalData
      .getMenuItem()
      .subscribe((value: any) => {
        this.moduleID = this.globalData.getModuleID() || value; // value;
        this.getMenu();

      });

    // this.moduleID = this.globalData.getModuleID();
    // this.getMenu();

  }


  ngOnInit(): void {

    this.moduleID = this.globalData.getModuleID();
    this.getMenu();


  }









  tmpMenuList: any = [];


  moduleList: any = []
  getModules() {
    this.http.get(environment.mainApi + this.globalData.userLink + 'getusermodule?userid=' + this.globalData.getUserID()).subscribe(
      (Response: any) => {
        this.moduleList = Response;
      }
    )
  }


  getMenu() {

    if (
      this.moduleID != null &&
      (typeof this.moduleID == 'string' || typeof this.moduleID == 'number')
    ) {



      this.http.get(environment.mainApi + this.globalData.userLink + 'getusermenu?userid=' + this.globalData.getUserID() + '&moduleid=' + this.moduleID).subscribe(
        (Response: any) => {

          this.tmpMenuList = Response;
          this.menuList = Response.map((e: any) => {
            if (e.isParentMenu) {
              e.childCount = this.haveChildMenu(e);
            }
            return e;
          })
          this.globalData.glbMenulist = Response;

        }
      )

    }


  }


  haveChildMenu(item: any) {
    var checkMenuList = this.tmpMenuList.filter((e: any) => e.parentMenuID == item.menuID);
    return checkMenuList.length;
  }





  setMenu(item: any) {

    this.route.navigate(['home']);
    localStorage.setItem('mid', JSON.stringify(item.moduleID));
    this.globalData.setMenuItem(item.moduleID);
    // window.location.reload();


  }


}
