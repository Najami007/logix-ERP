import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';

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

  ngOnInit(){
  
    
  }

  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }


}
