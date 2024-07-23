import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GlobalDataModule } from '../Shared/global-data/global-data.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


companyProfile:any = [];
companyLogo = '';
logoHeight = 0;
logoWidth = 0;

  constructor(private msg:NotificationService,
               private rout : Router,
               private http : HttpClient,
               public global:GlobalDataModule
    ){

      this.global.getCompany().subscribe((data)=>{
        // this.companyProfile = data;
        if(data == '' || data == undefined || data == null){

        }else{
          this.companyLogo = data[0].companyLogo1;
          this.logoHeight = data[0].logo1Height / 2 ;
          this.logoWidth = data[0].logo1Width / 2;
        }
        // console.log(data);
      });
    }



  ngOnInit(): void {
   
  


  }


    
    userEmail :any= '' ;
    userPassword : any = '';

    userData : any = [];

    /////////////////////////////////////
    ////// login funcition //////////////
    //////////////////////////////////////
  login(){
    
    if(this.userEmail == ""){
      this.msg.WarnNotify('Please Enter User Name')
    }else if(this.userPassword == ''){
      this.msg.WarnNotify('Please Enter Password')
    }else{
     
      //console.log(this.userEmail,this.userPassword)


      this.global.login(this.userEmail,this.userPassword);

    }


  }
  
  ///////////////////////////////////////////

}
