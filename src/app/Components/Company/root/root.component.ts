import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';

import { PincodeComponent } from '../../User/pincode/pincode.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent  implements OnInit{
  crudList:any = {c:true,r:true,u:true,d:true};

  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    private route:Router
    
    ){

      this.globaldata.getMenuList().subscribe((data)=>{
        this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
      })

    }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Rout');
    this.get();
  }


  
  routTitle:any;
  routID:any;
  description:any;
  actionbtn = 'Save';
  txtSearch:any;

  departmentList:any = [];






  





  save(){

    if(this.routTitle == '' || this.routTitle == undefined){
      this.msg.WarnNotify('Enter Rout Name')
    }else{
      if(this.actionbtn == 'Save'){
        this.insert();
      }else if(this.actionbtn == 'Update'){
        
        this.globaldata.openPinCode().subscribe(pin=>{
        
          if(pin != ''){
            this.update(pin);
          }
        }

        )
      }
    }
  }


  insert(){
    $(".loaderDark").show()
    this.http.post(environment.mainApi+this.globaldata.companyLink+'insertrout',{
      RoutTitle: this.routTitle,
      RoutDescription:this.description,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.get();
          this.reset();
          $(".loaderDark").fadeOut(500);
  
        }else{
          this.msg.WarnNotify(Response.msg);
          $(".loaderDark").fadeOut(500);
        }
      }
    )

  }
  
  update(pin:any){
    $(".loaderDark").show()
    this.http.post(environment.mainApi+this.globaldata.companyLink+'updaterout',{
      PinCode:pin,
     RoutID : this.routID,
     RoutTitle: this.routTitle,
     RoutDescription:this.description,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.get();
          this.reset();
          $(".loaderDark").fadeOut(500);
          
        }else{
          this.msg.WarnNotify(Response.msg);
          $(".loaderDark").fadeOut(500);
        }
      }
    )
  }


  reset(){
    this.routTitle = '';
    this.description = '';
    this.actionbtn = 'Save';
  }


  



  get(){
    this.http.get(environment.mainApi+this.globaldata.companyLink+'getrout').subscribe(
      (Response)=>{
        this.departmentList = Response;
      },
      (Error)=>{
        this.msg.WarnNotify('Error Occured')
      }
    )
  }


  edit(row:any){
  this.routID = row.routID
  this.routTitle = row.routTitle;
  this.description = row.routDescription;
  this.actionbtn = 'Update';
  }


  delete(row:any){

    this.globaldata.openPinCode().subscribe(pin=>{
      if(pin != ''){


        Swal.fire({
          title:'Alert!',
          text:'Confirm to Delete the Data',
          position:'center',
          icon:'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
        }).then((result)=>{
          if(result.isConfirmed){
        this.app.startLoaderDark();    
          this.http.post(environment.mainApi+this.globaldata.companyLink+'deleterout000',{
            PinCode:pin,
            RoutID:row.routID,
            UserID:this.globaldata.getUserID(),
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Deleted Successfully'){
                this.msg.SuccessNotify(Response.msg);
                
                this.get();
                this.app.stopLoaderDark();
              }else{
                this.msg.WarnNotify(Response.msg);
                this.app.stopLoaderDark();
              }
            }
          )

          }})
        

        
      }
    })


  }

}
