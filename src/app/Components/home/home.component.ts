import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { ASSETS } from 'src/assets/Constants/assets';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  constructor(
    private global:GlobalDataModule,
    private app:AppComponent
  ){}

  ngOnInit(): void {
    this.global.setHeaderTitle('HOME');
  }


  logoUrl:any = ASSETS.logixAnimation;   //'../../../assets/Images/logix2.gif';

}
