import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import * as $ from 'jquery';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  constructor(private global:GlobalDataModule,
    private route:Router){
    
  }
  sideBarOpen = false;
  hideFlag = false;

  ngOnInit(){
  
    
  }

  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }



  hideUnhide(){
    this.hideFlag = !this.hideFlag;
   
    // if(this.hideFlag == true){
    //   this.hideFlag = false;
    //   // $('#menubar').show();
    // }
    
    // if(this.hideFlag == false){
    //   this.hideFlag = true;
    //   // $('#menubar').fadeOut();
    // }


  }

}
