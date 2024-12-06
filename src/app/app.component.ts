import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd  } from '@angular/router';
import { GlobalDataModule } from './Shared/global-data/global-data.module';

import { gsap } from 'gsap/all';
import { Title } from '@angular/platform-browser';

import { filter, map } from 'rxjs/operators';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  ////////////// will Log OUt all Tabs When user LogOUt /////////////
  @HostListener('document:visibilitychange', ['$event'])

  appVisibility() {
    if (document.hidden ) { 

     } 
     else {
    
     if(localStorage.getItem('curVal') == null || localStorage.getItem('curVal') == '' ){
      this.route.navigate(['']);
    }
     }
 }


 loaderAnimation():void{
 const tl = gsap.timeline({ repeat: -1, yoyo: true });
  
  tl.from($('.one'), {
    // transform: "rotate(85deg)",
    rotation:85,
    duration: 0.5,
    ease: "power2.inOut",
    // y:-20,
  })
    .to($('.one'), {
      transform: "rotate(-10deg)",
      duration: -0.2,
      ease: "power2.inOut",
    })
    .to($('.two'), {
      duration: 0.1,
      transform: "rotate(-10deg)",
      ease: "power2.inOut",
      delay: -0.1,
    })
    .to($('.three'), {
      duration: 0.2,
      transform: "rotate(-10deg)",
      ease: "power2.inOut",
      delay: -0.1,
    })
    .to($('.four'), {
      duration: 0.2,
      transform: "rotate(-10deg)",
      ease: "power2.inOut",
      delay: -0.1,
    })
    .to($('.five'), {
      duration: 0.2,
      transform: "rotate(-10deg)",
      ease: "power2.inOut",
      delay: -0.1,
    })
    .to($('.six'), {
      duration: 0.2,
      transform: "rotate(-10deg)",
      ease: "power2.inOut",
      delay: -0.1,
    })
    .to($('.seven'), {
      duration: 0.2,
      transform: "rotate(-10deg)",
      ease: "power2.inOut",
      delay: -0.1,
    })
    .to($('.eight'), {
      duration: 0.3,
      transform: "rotate(-84deg)",
      ease: "power2.inOut",
      delay: -0.1,
    });

 }



  
  title = 'ERP';
constructor(
   private route:Router,
   private global:GlobalDataModule,
   private titleService: Title,
   private activatedRoute: ActivatedRoute
  ){
    this.route.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data['title'];
        })
      )
      .subscribe((title: string) => {
        if (title) {
          this.titleService.setTitle('ERP: '+title);
        }
      });

}
  

  ngOnInit(){
    
    this.global.getCompany();
    setTimeout(() => {
      this.stopLoaderDark();  
    }, 500);
    if(localStorage.getItem('curVal') == null || localStorage.getItem('curVal') == '' ){
      this.route.navigate(['']);
    }
   
  }


  startLoaderDark() {
    $(".loaderDark").show();

  }

  stopLoaderDark() {
    $(".loaderDark").fadeOut(500);
  }

  startLoaderLight() {
    $(".loaderLight").show();
    //$(".btnLoader").show();
  }

  stopLoaderLight() {
    $(".loaderLight").hide();
    //$(".btnLoader").hide(1000);
  }

  appMenuList:any = [];

  tstUserName: any = "Adnan";
  
  public glbMenulist:any = [];

}
