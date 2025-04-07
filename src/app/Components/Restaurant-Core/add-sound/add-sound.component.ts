import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-sound',
  templateUrl: './add-sound.component.html',
  styleUrls: ['./add-sound.component.scss']
})
export class AddSoundComponent implements OnInit {


  constructor(
    private http:HttpClient,
    private global:GlobalDataModule
  ){}

  ngOnInit(): void {
 
    this.getCookingArea();
  }



  orderTypeList: any = [
    // { val: 'Dine In', title: 'Dine In' },
    { val: 'Take Away', title: 'Take Away' },
    { val: 'Home Delivery', title: 'Home Delivery' },
  ]

  onDocSelected(event: any) {



    let targetEvent = event.target;

    let file: File = targetEvent.files[0];

    let fileReader: FileReader = new FileReader();

    var Sound2:any = '';


    fileReader.readAsDataURL(file);
  
    fileReader.onload = (e) => {
      
      localStorage.setItem('snd', JSON.stringify(fileReader.result));
      
    }
   
    new Audio(Sound2).play()

    // this.beep()



  }


  kotFlag:any = JSON.parse(localStorage.getItem('rKtF') || '0')  || false;

  onKotSelection(value:any){

    localStorage.setItem('rKtF', JSON.stringify(value));

  }



locationID = JSON.parse(localStorage.getItem('odsbdepID') || "0")   || 0;
  onDeparmentSelection(value:any){
    localStorage.setItem('odsbdepID', value);
  }

  orderType = localStorage.getItem('ordtyp') || '';
  onOrderTypeSelection(value:any){
    localStorage.setItem('ordtyp', value);
  }

  cookingAreaList: any = [];

  getCookingArea() {
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetCookingAria').subscribe(
      (Response: any) => {
        this.cookingAreaList = Response;
        
      }
    )
  }


}
