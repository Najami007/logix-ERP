import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { error } from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  crudList:any = [];

  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private global:GlobalDataModule,
    private app:AppComponent,
    private dialogue:MatDialog,
    private route:Router

  ){
    this.global.getMenuList().subscribe((data)=>{
      this.crudList = data.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
    })

  }

  ngOnInit(): void {
    this.global.setHeaderTitle('Project');
    this.getProject();
    
  }


  txtSearch:any;
  actionbtn = 'Save'
  projectTitle:any;
  projectID:any;
  description:any;

  projectList:any = [];



  // getCrud(){
  //   this.http.get(environment.mainApi+'user/getusermenu?userid='+this.global.getUserID()+'&moduleid='+this.global.getModuleID()).subscribe(
  //     (Response:any)=>{
  //       this.crudList =  Response.find((e:any)=>e.menuLink == this.route.url.split("/").pop());
  //     }
  //   )
  // }



  getProject(){
    this.http.get(environment.mainApi+'cmp/getproject').subscribe(
      (Response:any)=>{
        this.projectList = Response;
      }
    )
  }


  save(){

  if(this.projectTitle == '' || this.projectTitle == undefined){
    this.msg.WarnNotify('Enter Project Title')
  }else {

    if(this.description == '' || this.description == undefined){
      this.description = '-';
    }

    if(this.actionbtn == 'Save'){
      this.insert()
    }else if(this.actionbtn == 'Update'){
      this.dialogue.open(PincodeComponent,{
        width:'30%'
      }).afterClosed().subscribe(pin=>{
        if(pin != ''){
          this.update(pin);
        }
      })
    }
  }

}



insert(){
  this.app.startLoaderDark();
  this.http.post(environment.mainApi+'cmp/insertproject',{
    ProjectTitle: this.projectTitle,
    ProjectDescription: this.description,
    UserID: this.global.getUserID()
  }).subscribe(
    (Response:any)=>{
      if(Response.msg == 'Data Saved Successfully'){
        this.msg.SuccessNotify(Response.msg);
        this.getProject();
        this.reset();
        this.app.stopLoaderDark();
      }else{
        this.msg.WarnNotify(Response.msg);
        this.app.stopLoaderDark();
      }
    },
    (error:any)=>{
      this.app.stopLoaderDark();
    }
  )
}


update(pin:any){
  this.app.startLoaderDark();
  this.http.post(environment.mainApi+'cmp/updateproject',{
    ProjectID:this.projectID,
    ProjectTitle: this.projectTitle,
    ProjectDescription: this.description,
    PinCode:pin,
    UserID: this.global.getUserID()
  }).subscribe(
    (Response:any)=>{
      if(Response.msg == 'Data Updated Successfully'){
        this.msg.SuccessNotify(Response.msg);
        this.getProject();
        this.reset();
        this.app.stopLoaderDark();
      }else{
        this.msg.WarnNotify(Response.msg);
        this.app.stopLoaderDark();
      }
    },
    (error:any)=>{
      this.app.stopLoaderDark();
    }
  )
}




reset(){
  this.actionbtn = 'Save';
  this.projectID = '';
  this.projectTitle = '';
  this.description = '';

}


edit(row:any){
  this.actionbtn = 'Update';
  this.projectTitle = row.projectTitle;
  this.description = row.projectDescription;
  this.projectID = row.projectID;

}

delete(row:any){

  this.dialogue.open(PincodeComponent,{
    width:'30%'
  }).afterClosed().subscribe(pin=>{
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
    
    this.http.post(environment.mainApi+'cmp/deleteproject',{
      ProjectID: row.projectID,
      PinCode:pin,
      UserID: this.global.getUserID()
      }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Deleted Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getProject();
          this.app.stopLoaderDark();
        }else{
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      }
      )
    }
  })
   

      

      

    
      
    }
  })


}



}
