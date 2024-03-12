import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from './Shared/global-data/global-data.module';
import { TimelineLite, Back, Power1,  } from 'gsap'

import { gsap } from 'gsap/all';







@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


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
constructor( private route:Router,private global:GlobalDataModule){

}
  

  ngOnInit(){
    
    this.global.getCompany();
 
    // if(localStorage.getItem('curVal') == null || localStorage.getItem('curVal') == '' ){
    //   this.route.navigate(['']);
    // }
   
  }


  startLoaderDark() {
    $(".loaderDark").show();
   this.loaderAnimation();
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
