
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { GlobalDataModule } from
  'src/app/Shared/global-data/global-data.module';

interface SubMenu {
  menuID: number;
  parentMenuID: number;
  menuTitle: string;
  menuLink: string;
  moduleID: number;
  moduleLink: string;
  isParentMenu: boolean;
}

interface MainMenu extends SubMenu {
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
export class SideNavigationBar2Component
  implements OnInit, OnDestroy {

  moduleMenuList: ModuleMenu[] = [];

  currentModule: ModuleMenu | undefined;

  moduleID: string | null = null;

  expandedMenus: { [key: number]: boolean } = {};

  private subscriptions: Subscription[] = [];

  constructor(
    private global: GlobalDataModule,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.moduleID = localStorage.getItem('mid');

    // Load the menu tree already created by top navigation
    this.loadNavigation();

    // Listen for menu-tree changes
    this.subscriptions.push(
      this.global.moduleMenuList$.subscribe(
        (menus: ModuleMenu[]) => {
          this.moduleMenuList = menus || [];
          this.setCurrentModule();
        }
      )
    );

    // Listen for module changes from top navigation
    this.subscriptions.push(
      this.global.getMenuItem().subscribe((value: any) => {
        this.moduleID = String(value);
        this.setCurrentModule();
      })
    );

    // Update expanded parent when route changes
    this.subscriptions.push(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.expandActiveMenu();
      })
    );
  }

  loadNavigation(): void {
    this.moduleMenuList =
      this.global.getModuleMenuList() || [];

    this.setCurrentModule();
  }

  setCurrentModule(): void {

    if (!this.moduleMenuList.length) {
      this.currentModule = undefined;
      return;
    }

    const storedID =
      this.moduleID || localStorage.getItem('mid');

    const id = Number(storedID);

    this.currentModule = this.moduleMenuList.find(
      module => Number(module.moduleID) === id
    );

    // Fallback if no selected module matches
    if (!this.currentModule && !storedID) {
      this.currentModule = this.moduleMenuList[0];
      this.moduleID = String(this.currentModule.moduleID);
    }

    this.expandActiveMenu();
  }

 

  isExpanded(menuID: number): boolean {
    return !!this.expandedMenus[menuID];
  }

  navigate(menu: SubMenu): void {
    this.router.navigate([
      '/',
      menu.moduleLink,
      menu.menuLink
    ]);
  }

  expandActiveMenu(): void {

    const module = this.currentModule;

    if (!module) {
      return;
    }

    const currentUrl = this.router.url;

    for (const menu of module.menus || []) {

      if (!menu.menus?.length) {
        continue;
      }

      const activeChild = menu.menus.some(sub => {
        const targetUrl =
          `/${sub.moduleLink}/${sub.menuLink}`;

        return currentUrl === targetUrl ||
          currentUrl.startsWith(targetUrl + '/');
      });

      if (activeChild) {
        this.expandedMenus[menu.menuID] = true;
      }
    }
  }

  getModuleIcon(title: string): string {

    const value = (title || '').toLowerCase();

    if (value.includes('inventory')) return 'inventory_2';
    if (value.includes('sale')) return 'point_of_sale';
    if (value.includes('purchase')) return 'shopping_cart';
    if (value.includes('account')) return 'account_balance';
    if (value.includes('report')) return 'analytics';
    if (value.includes('setting')) return 'settings';
    if (value.includes('user')) return 'people';
    if (value.includes('vehicle')) return 'local_shipping';
    if (value.includes('restaurant')) return 'restaurant';

    return 'apps';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
  }






  
expandedModule: number | null = null;


toggleModule(index: number, module: ModuleMenu): void {
  if (this.expandedModule === index) {
    this.expandedModule = null;
    return;
  }

  this.expandedModule = index;

  // Update the selected module across the application
  localStorage.setItem('mid', String(module.moduleID));
  sessionStorage.setItem('mid', String(module.moduleID));

  this.global.setMenuItem(module.moduleID);
  this.global.setModuleTitle(module.moduleTitle.split(' ')[0]);
}

toggleMenu(menuID: number): void {
  this.expandedMenus[menuID] = !this.expandedMenus[menuID];
}




}
