import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { MainComponent } from '../main/main.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';


interface SubMenu {
  menuID: number;
  parentMenuID: number;
  menuTitle: string;
  menuLink: string;
  moduleID: number;
  moduleLink: string;
  isParentMenu: boolean;
}


interface MainMenu {
  menuID: number;
  parentMenuID: number;
  menuTitle: string;
  menuLink: string;
  moduleID: number;
  moduleLink: string;
  isParentMenu: boolean;
  menus: SubMenu[];
}


interface ModuleMenu {
  moduleID: number;
  moduleTitle: string;
  moduleLink: string;
  menus: MainMenu[];
}


@Component({
  selector: 'app-side-navigation-bar2',
  templateUrl: './side-navigation-bar2.component.html',
  styleUrls: ['./side-navigation-bar2.component.scss']
})
export class SideNavigationBar2Component implements OnInit, OnDestroy {

  clickEventSubscription!: Subscription;

  // Complete tree
  moduleMenuList: ModuleMenu[] = [];

  // Currently selected module
  currentModule!: ModuleMenu | undefined;

  moduleID: string | null = null;

  // Track opened menus
  expandedMenus: { [key: number]: boolean } = {};

  constructor(
    private msg: NotificationService,
    private http: HttpClient,
    private route: Router,
    private dialogue: MatDialog,
    private app: AppComponent,
    private m: MainComponent,
    private global: GlobalDataModule
  ) {

    /*
     * Whenever module changes from Top Navigation
     */
    this.clickEventSubscription = this.global
      .getMenuItem()
      .subscribe((value: any) => {

        this.moduleID = value;

        this.moduleMenuList =
          this.global.getModuleMenuList();

        this.setCurrentModule();

      });

  }


  ngOnInit(): void {

    this.moduleID = localStorage.getItem('mid');

    this.clickEventSubscription =
      this.global.moduleMenuList$
        .subscribe((menus: any[]) => {

          this.moduleMenuList = menus;

          this.setCurrentModule();

        });

  }



  loadNavigation() {

    this.moduleMenuList =
      this.global.getModuleMenuList();

    this.setCurrentModule();

  }

  /*
   * ============================================================
   * GET MODULES
   * ============================================================
   */

  getModules(): void {

    const userID = this.global.getUserID();

    this.http.get(
      this.global.userLink +
      'getusermodule?userid=' +
      userID
    ).subscribe({

      next: (response: any) => {

        const modules = response || [];

        this.getAllMenus(modules);

      },

      error: (error) => {

        console.error(
          'Error loading modules:',
          error
        );

      }

    });

  }


  /*
   * ============================================================
   * GET MENU FOR ALL MODULES
   * ============================================================
   */

  getAllMenus(modules: any[]): void {

    this.moduleMenuList = [];

    modules.forEach((module: any) => {

      this.getMenu(module);

    });

  }


  /*
   * ============================================================
   * GET MENU
   * ============================================================
   */

  getMenu(module: any): void {

    const userID = this.global.getUserID();

    const moduleID = module.moduleID;

    this.http.get(
      this.global.userLink +
      'getusermenu?userid=' +
      userID +
      '&moduleid=' +
      moduleID
    ).subscribe({

      next: (response: any) => {

        const menuList = response || [];

        const moduleTree: ModuleMenu = {

          moduleID: module.moduleID,

          moduleTitle:
            module.moduleTitle ||
            module.moduleName ||
            module.title,

          moduleLink:
            module.moduleLink ||
            module.link ||
            '',

          menus: this.buildMenuTree(menuList)

        };


        this.moduleMenuList.push(moduleTree);


        /*
         * Keep global menu list updated
         */
        this.global.glbMenulist = [
          ...(this.global.glbMenulist || []),
          ...menuList
        ];


        /*
         * Set selected module
         */
        this.setCurrentModule();

      },

      error: (error) => {

        console.error(
          'Error loading menu:',
          error
        );

      }

    });

  }


  /*
   * ============================================================
   * BUILD MENU TREE
   * ============================================================
   */

  buildMenuTree(menuList: any[]): MainMenu[] {

    const result: MainMenu[] = [];


    /*
     * Main menus
     */
    const parentMenus = menuList.filter(
      (item: any) =>
        item.parentMenuID === 0
    );


    parentMenus.forEach((parent: any) => {

      const children: SubMenu[] = menuList
        .filter(
          (item: any) =>
            item.parentMenuID === parent.menuID
        );


      result.push({

        menuID: parent.menuID,

        parentMenuID:
          parent.parentMenuID,

        menuTitle:
          parent.menuTitle,

        menuLink:
          parent.menuLink,

        moduleID:
          parent.moduleID,

        moduleLink:
          parent.moduleLink,

        isParentMenu:
          parent.isParentMenu,

        menus: children

      });

    });


    return result;

  }


  /*
   * ============================================================
   * SET CURRENT MODULE
   * ============================================================
   */

  setCurrentModule(): void {

    if (!this.moduleID) {
      this.currentModule = undefined;
      return;
    }

    const id = Number(this.moduleID);

    this.currentModule =
      this.moduleMenuList.find(
        (module: any) =>
          Number(module.moduleID) === id
      );

    // console.log('Selected Module ID:', id);
    // console.log('Available Modules:', this.moduleMenuList);
    // console.log('Current Module:', this.currentModule);

  }


  /*
   * ============================================================
   * TOGGLE MENU
   * ============================================================
   */

  toggleMenu(menuID: number): void {

    this.expandedMenus[menuID] =
      !this.expandedMenus[menuID];

  }


  /*
   * ============================================================
   * CHECK MENU
   * ============================================================
   */

  isExpanded(menuID: number): boolean {

    return !!this.expandedMenus[menuID];

  }


  /*
   * ============================================================
   * NAVIGATION
   * ============================================================
   */

  navigate(menu: any): void {

    this.route.navigate([
      '/',
      menu.moduleLink,
      menu.menuLink
    ]);

  }


  /*
   * ============================================================
   * CLEANUP
   * ============================================================
   */

  ngOnDestroy(): void {

    if (this.clickEventSubscription) {

      this.clickEventSubscription.unsubscribe();

    }

  }

}