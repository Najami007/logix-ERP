import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../pincode/pincode.component';
import { error } from 'jquery';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {


  constructor(
    private http:HttpClient,
    private msg:NotificationService,
    private app:AppComponent,
    private global:GlobalDataModule,
    private dialogue:MatDialog
  ){}


  ngOnInit(): void {

    this.getModules();
    this.getMenuList();
    this.getSavedRoles();
  }


  btnType:any = 'Save';

  txtSearch:any;
  tabIndex:any;
  roleTitle:any;
  roleDescription:any;
  moduleID:any;
  roleID:any;

  rolesList:any = [];
  moduleList:any = [];
  menuList:any = [];
  tempMenyList:any = [];


  selectedModuleMenuList:any = [];
  TempModuleList:any = [];


   /////////////////////////////////////////////////////////////////////////


  getSavedRoles(){
    this.http.get(environment.mainApi+'user/GetRole ').subscribe(

      (Response:any)=>{
        this.rolesList = Response;
        // console.log(Response);
      }
    )
  }


 /////////////////////////////////////////////////////////////////////////

  getModules(){
    this.http.get(environment.mainApi+'user/GetModule').subscribe(
      (Response)=>{
        this.moduleList = Response;
      }
    )
  }


  /////////////////////////////////////////////////////////////////////////


  getMenuList(){
    this.http.get(environment.mainApi+'user/getmenu').subscribe(
      (Response)=>{
        this.menuList = Response;
        // console.log(Response);
      }
    )
  }

  /////////////////////////////////////////////////////////////


  save(){

    var menuStatus = false;

    this.menuList.forEach((e:any) => {
      if(e.c == true || e.r == true || e.u == true || e.d == true){
        menuStatus =  true;
      }
    });

    if(this.roleTitle == '' || this.roleTitle == undefined){
      this.msg.WarnNotify('Enter Role Title');
    }else if(menuStatus == false){
      this.msg.WarnNotify('Select Atleast One Menu');
    }else{

      if(this.roleDescription == '' || this.roleDescription == undefined){
        this.roleDescription = '-'
      }

      if(this.btnType == 'Save'){
        this.insertRole();
      }else if(this.btnType == 'Update'){


        //////////// will open the pin code field and on close call the api
        
        this.dialogue.open(PincodeComponent,{
          width:"30%",
        }).afterClosed().subscribe(pin=>{         
           if(pin !== ''){
            this.updateRole(pin);  
           }
          
        })
      }


    }
  }


  ///////////////////////////////////////////////////////////
  

  insertRole(){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+'user/insertrole',{
      RoleTitle: this.roleTitle,
      RoleDescription: this.roleDescription,
      RoleDetail:  JSON.stringify(this.menuList),
      UserID: this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Saved Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getSavedRoles();
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



  ///////////////////////////////////////////////////////////

  updateRole(pin:any){
    this.app.startLoaderDark();
    this.http.post(environment.mainApi+'user/updaterole',{
      PinCode:pin,
      RoleID: this.roleID,
      RoleTitle: this.roleTitle,
      RoleDescription: this.roleDescription,
      RoleDetail:  JSON.stringify(this.menuList),
      UserID:this.global.getUserID()
    }).subscribe(
      (Response:any)=>{
        if(Response.msg == 'Data Updated Successfully'){
          this.msg.SuccessNotify(Response.msg);
          this.getSavedRoles();
          
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



  //////////////////////////////////////////////////////////////


  addToSelectedModule(item:any,index:any,type:any){
    if(type == 'a'){
      if(item.a == true){
        this.menuList[index].c = true;
        this.menuList[index].r = true;
        this.menuList[index].u = true;
        this.menuList[index].d = true;
      }
  
      if(item.a == false){
        this.menuList[index].c = false;
        this.menuList[index].r = false;
        this.menuList[index].u = false;
        this.menuList[index].d = false;
      }
    
    }



    if(item.c == false || item.r == false || item.u == false || item.d == false){
      item.a = false;

      // var moduleIndex = this.TempModuleList.findIndex((md:any)=>md.moduleID == item.moduleID);
      // var menuIndex = this.TempModuleList[moduleIndex].tempMenuList.findIndex((tm:any)=>tm.menuID == item.menuID);

      // this.TempModuleList[moduleIndex].tempMenuList.splice(menuIndex,1);
      // console.log(this.TempModuleList,menuIndex,moduleIndex);
    }



    if(this.TempModuleList.filter((m:any)=>m.moduleID == item.moduleID).length == 0){

     

      this.TempModuleList.push({
        moduleID : item.moduleID,
        moduleTitle:this.moduleList[this.moduleList.findIndex((mod:any)=>mod.moduleID == item.moduleID)].moduleTitle,
        tempMenuList:[{  menuID:item.menuID,menuTitle:item.menuTitle,c:item.c,r:item.r,u:item.u,d:item.d,}],
      })
    }else{

      ////////////////////will check whether selected menu module is already in tmpmodule list of not//////////////
      
      if(this.TempModuleList.filter((m:any)=>m.moduleID == item.moduleID).length != 0){

        ///////////// will find the index of the selected module from the tmpmodulelist//////////
        var moduleIndex = this.TempModuleList.findIndex((md:any)=>md.moduleID == item.moduleID);

        ////////////////////////////////  will chack wheter the selected menu is already in the selected module menu list or not//////
        if(this.TempModuleList[moduleIndex].tempMenuList.filter((tm:any)=>tm.menuID == item.menuID).length == 0){

          //////////////////// if the meny is not present already will push the new menu /////////////////////
          this.TempModuleList[moduleIndex].tempMenuList.push({
            menuID:item.menuID,
            menuTitle:item.menuTitle,
            c:item.c,
            r:item.r,
            u:item.u,
            d:item.d,
          })
        }else{

          /////////////////////// if the menu is already present than will update the selected meny of the selected Module
          var menuIndex = this.TempModuleList[moduleIndex].tempMenuList.findIndex((tm:any)=>tm.menuID == item.menuID);

          this.TempModuleList[moduleIndex].tempMenuList[menuIndex].c = item.c;
          this.TempModuleList[moduleIndex].tempMenuList[menuIndex].r = item.r;
          this.TempModuleList[moduleIndex].tempMenuList[menuIndex].u = item.u;
          this.TempModuleList[moduleIndex].tempMenuList[menuIndex].d = item.d;
        }

      

        
      }
    }


  }



  ///////////////////////////////////////////////////////


  editRole(row:any){
    // this.getMenuList();
    this.selectedModuleMenuList = [];
    this.TempModuleList = [];

    this.roleTitle = row.roleTitle;
    this.roleDescription = row.roleDescription;
    this.roleID = row.roleID;

    this.http.get(environment.mainApi+'user/getrolemenu?roleid='+row.roleID).subscribe((Response:any)=>{
        //console.log(Response);

        var AllowedRolesList:any = [];
        
        Response.forEach((e:any) => {

          var index = this.menuList.findIndex((obj:any)=>obj.menuID == e.menuID);
          this.menuList[index].c = e.c;
          this.menuList[index].r = e.r;
          this.menuList[index].u = e.u;
          this.menuList[index].d = e.d;
          if(e.c = true && e.r == true && e.u == true && e.d == true){
            this.menuList[index].a = true;
          }

          AllowedRolesList.push(this.menuList.find((j:any)=>j.menuID == e.menuID));

        });


        AllowedRolesList.forEach((e:any) => {
         
    
          if(this.TempModuleList.filter((tmd:any)=>tmd.moduleID == e.moduleID).length == 0){
            
            this.TempModuleList.push({
              moduleID : e.moduleID,
              moduleTitle: this.moduleList[this.moduleList.findIndex((mod:any)=>mod.moduleID == e.moduleID)].moduleTitle,
              tempMenuList:[{menuID:e.menuID,menuTitle:e.menuTitle,c:e.c,r:e.r,u:e.u, d:e.d,}]
            })
    
          }else{
    
            var moduleIndex = this.TempModuleList.findIndex((md:any)=>md.moduleID == e.moduleID);
    
            this.TempModuleList[moduleIndex].tempMenuList.push({
              menuID:e.menuID,
              menuTitle:e.menuTitle,
              c:e.c,
              r:e.r,
              u:e.u,
              d:e.d,
            })
    
          }
          
         
    
        }); 


      }
    )

    

    //console.log(this.TempModuleList); 

    this.btnType = 'Update';
    this.tabIndex = 0;

  }




  ////////////////////////////////////////////////////////


  deleteRole(row:any){


    this.dialogue.open(PincodeComponent,{
      width:"30%",
    }).afterClosed().subscribe(pin=>{         
   
      if(pin !== ''){
        Swal.fire({
          title:'Alert!',
          text:'Confirm To Delete',
          position:'center',
          icon:'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
        }).then((result)=>{
          if(result.isConfirmed){
    
            //////on confirm button pressed the api will run
           
        this.app.startLoaderDark();
        this.http.post(environment.mainApi+'user/deleterole',{
          PinCode: pin,
          RoleID:row.roleID,
          UserID:this.global.getUserID()
        }).subscribe(
          (Response:any)=>{
            if(Response.msg == 'Data Deleted Successfully'){
              this.msg.SuccessNotify(Response.msg);
              this.getSavedRoles();
              this.app.stopLoaderDark()
            }else {
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark()
            }
          }
        )
          }
        });
      }
      
    })



   
  }




  ////////////////////////////////////////////////////////


  changeTabHeader(tabNum: any) {
    this.tabIndex = tabNum;
  }


  ////////////////////////////////////////////////////

  reset(){
    this.roleTitle = '';
    this.roleDescription = '';
    this.getMenuList();
    this.TempModuleList = [];
    this.selectedModuleMenuList = [];

  }

}
