import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  constructor(private global:GlobalDataModule){}

  ngOnInit(): void {
    this.global.setHeaderTitle('HOME')
  }


  logoUrl:any = '../../../assets/Images/logix2.gif';

}
