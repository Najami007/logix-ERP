import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';




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
  selector: 'app-navigation-menu-bar',
  templateUrl: './navigation-menu-bar.component.html',
  styleUrls: ['./navigation-menu-bar.component.scss']
})
export class NavigationMenuBarComponent {


  constructor(private globalData: GlobalDataModule,
    private msg: NotificationService,
    private http: HttpClient,

  ) {


  }



  ngOnInit(): void {

    // First get modules, then menus
    this.getModules();

  }


  public moduleMenuList: ModuleMenu[] = [];
  tmpMenuList: any = [];

  moduleList: any[] = [];

  public menuList: any[] = [];

  moduleID?: string | null;



  getModules() {

    const userID = this.globalData.getUserID();

    this.http.get(
      environment.mainApi +
      this.globalData.userLink +
      'getusermodule?userid=' + userID
    ).subscribe({

      next: (Response: any) => {
        this.moduleList = Response || [];

        // Clear old tree
        this.moduleMenuList = [];

        if (!this.moduleList.length) {
          return;
        }

        // Get menu for every module
        this.moduleList.forEach((module: any) => {
          this.getMenu(module);
        });

      },

      error: (error) => {

        console.error('Error loading modules:', error);

      }

    });

  }


  getMenu(module: any) {

    const userID = this.globalData.getUserID();
    const moduleID = module.moduleID;

    this.http.get(
      environment.mainApi +
      this.globalData.userLink +
      'getusermenu?userid=' +
      userID +
      '&moduleid=' +
      moduleID
    ).subscribe({

      next: (Response: any) => {

        const menuList = Response || [];

        const tree = this.buildMenuTree(
          menuList,
          module
        );

        this.moduleMenuList.push(tree);

        this.moduleMenuList.sort((a, b) => a.moduleID - b.moduleID);

        // Store complete navigation tree globally
        this.globalData.setModuleMenuList(this.moduleMenuList);

        // Optional: keep existing global menu list
        this.globalData.glbMenulist = [
          ...this.globalData.glbMenulist || [],
          ...menuList
        ];

        // console.log(this.moduleMenuList);

      },

      error: (error) => {

        console.error(
          'Error loading menu for module:',
          moduleID,
          error
        );

      }

    });

  }



  buildMenuTree(menuList: any[], module: any): ModuleMenu {

    const mainMenus: MainMenu[] = [];

    // =========================================================
    // GET TOP-LEVEL PARENT MENUS
    // =========================================================

    const parentMenus = menuList
      .filter((item: any) =>
        item.parentMenuID === 0 &&
        item.isParentMenu === true
      )
      .sort((a: any, b: any) =>
        Number(a.serialNo || 0) - Number(b.serialNo || 0)
      );


    // =========================================================
    // BUILD MAIN MENU + SUB MENU
    // =========================================================

    parentMenus.forEach((parent: any) => {

      const children = menuList
        .filter((item: any) =>
          item.parentMenuID === parent.menuID
        )
        .sort((a: any, b: any) =>
          Number(a.serialNo || 0) - Number(b.serialNo || 0)
        );


      mainMenus.push({

        menuID: parent.menuID,

        parentMenuID: parent.parentMenuID,

        menuTitle: parent.menuTitle,

        menuLink: parent.menuLink,

        moduleID: parent.moduleID,

        moduleLink: parent.moduleLink,

        isParentMenu: parent.isParentMenu,

        menus: children

      });

    });


    // =========================================================
    // DIRECT MENUS WITHOUT SUBMENUS
    // =========================================================

    const directMenus = menuList
      .filter((item: any) =>
        item.parentMenuID === 0 &&
        item.isParentMenu === false
      )
      .sort((a: any, b: any) =>
        Number(a.serialNo || 0) - Number(b.serialNo || 0)
      );


    directMenus.forEach((menu: any) => {

      mainMenus.push({

        menuID: menu.menuID,

        parentMenuID: menu.parentMenuID,

        menuTitle: menu.menuTitle,

        menuLink: menu.menuLink,

        moduleID: menu.moduleID,

        moduleLink: menu.moduleLink,

        isParentMenu: menu.isParentMenu,

        menus: []

      });

    });


    // =========================================================
    // IMPORTANT:
    // SORT COMPLETE MAIN MENU AGAIN
    // =========================================================

    mainMenus.sort((a: any, b: any) => {

      const menuA = menuList.find(
        (x: any) => x.menuID === a.menuID
      );

      const menuB = menuList.find(
        (x: any) => x.menuID === b.menuID
      );

      return Number(menuA?.serialNo || 0) -
        Number(menuB?.serialNo || 0);

    });


    // =========================================================
    // RETURN MODULE TREE
    // =========================================================

    return {

      moduleID: module.moduleID,

      moduleTitle:
        module.moduleTitle ||
        module.moduleName ||
        module.title,

      moduleLink:
        module.moduleLink ||
        module.link ||
        '',

      menus: mainMenus

    };

  }



  haveChildMenu(item: any) {
    var checkMenuList = this.tmpMenuList.filter((e: any) => e.parentMenuID == item.menuID);
    return checkMenuList.length;
  }




}
