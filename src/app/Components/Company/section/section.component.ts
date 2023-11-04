import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { error } from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {


  constructor(private http:HttpClient,
    private msg:NotificationService,
    private dialogue: MatDialog,
    private globaldata:GlobalDataModule,
    private app:AppComponent,
    
    ){}
  ngOnInit(): void {
    this.getDepartment();
    this.getSection();;
  }

    txtSearch:any;
    btnType= 'Save';
    sectionID:any;
  depSearch:any;
  departmentID:any;
  sectionTitle:any;
  sectionDescription:any;




 
  
  departmentList:any = [];
  sectionList:any = [];


  getDepartment(){
    this.http.get(environment.mainApi+'cmp/getdepartment').subscribe(
      (Response)=>{
        this.departmentList = Response;
      },
      (Error)=>{
        this.msg.WarnNotify('Error Occured')
      }
    )
  }


  getSection(){
    this.http.get(environment.mainApi+'cmp/getsection').subscribe(
      (Response)=>{
        this.sectionList = Response;
        //console.log(Response);
      },
      (Error)=>{
        this.msg.WarnNotify('Error Occured')
      }
    )
  }




  save(){
    if(this.departmentID == '' || this.departmentID == undefined){
      this.msg.WarnNotify('Select Department')
    }else if(this.sectionTitle == '' || this.sectionTitle == undefined){
      this.msg.WarnNotify('Enter Section Title')
    }else {
      
      if(this.sectionDescription == '' || this.sectionDescription == undefined){
        this.sectionDescription = '-';
      }

      if(this.btnType == 'Save'){
        this.insert()
      }else if(this.btnType == 'Update'){
        this.dialogue.open(PincodeComponent,{
          width:'30%'
        }).afterClosed().subscribe(pin=>{
          if(pin!= ''){
            this.update(pin);
          }
        })
      }
    }

  }


  insert(){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+'cmp/insertsection',{
      DepartmentID: this.departmentID,
      SectionTitle: this.sectionTitle,
      SectionDescription: this.sectionDescription,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getSection();
          this.reset()
          this.app.stopLoaderDark();
        }else {
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
    // alert(this.sectionID);
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+'cmp/updatesection',{
      SectionID:this.sectionID,
      DepartmentID: this.departmentID,
      SectionTitle: this.sectionTitle,
      SectionDescription: this.sectionDescription,
      PinCode:pin,
      UserID: this.globaldata.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getSection();
          this.reset()
          this.app.stopLoaderDark();
        }else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error:any)=>{
        this.app.stopLoaderDark();
      }
    )
  }


  editSection(row:any){
    this.departmentID = row.departmentID;
    this.sectionID = row.sectionID;
    this.sectionTitle = row.sectionTitle;
    this.sectionDescription = row.sectionDescription;
    this.btnType = 'Update';

  }


  deleteSection(row:any){

    this.dialogue.open(PincodeComponent,{
      width:'30%'
    }).afterClosed().subscribe(pin=>{
      if(pin!= ''){
       
        this.app.startLoaderDark();
        this.globaldata.deleteConfirmation(
          this.http.post(environment.mainApi+'cmp/deletesection',{
            SectionID: row.sectionID,
           PinCode:pin,
           UserID: this.globaldata.getUserID()
          }).subscribe(
            (Response:any)=>{
              if(Response.msg == 'Data Deleted Successfully'){
                this.msg.SuccessNotify(Response.msg);
                this.getSection();
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
        )


      }
    })

  }

  reset(){
    this.departmentID = '';
    this.sectionTitle = '';
    this.sectionDescription = '';
    this.btnType = 'Save';

  }

}
