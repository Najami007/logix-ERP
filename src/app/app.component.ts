import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from './Shared/global-data/global-data.module';







@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ERP';
constructor( private route:Router,private global:GlobalDataModule){

}
  

  ngOnInit(){
    
    // if(localStorage.getItem('curVal') == null || localStorage.getItem('curVal') == '' ){
    //   this.route.navigate(['']);
    // }
   
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

  

}
