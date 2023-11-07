import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { GlobalDataModule } from '../global-data/global-data.module';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr :ToastrService,private http:HttpClient,private route:Router ) { }

  success(message :any,title:any){
    this.toastr.success(message,title)
  }
  Error(message :any,title:any){
    this.toastr.error(message,title)
  }
  Info(message :any,title:any){
    this.toastr.info(message,title)
  }
  Warning(message :any,title:any){
    this.toastr.warning(message,title)
  }


 /////////////////////////////////////////////////////////// 
//////////////// warning Notification/////////////////////
//////////////////////////////////////////////////////////

  WarnNotify =(Text:string)=> Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    showLoaderOnConfirm:true,
   
   
    
   willOpen : (toast)=> {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
   },
    
  }).fire({
    showConfirmButton:true,
    width:500,
    confirmButtonColor:'green',
    text:Text,
    icon:'error',
    iconColor:'red',
    preConfirm(inputValue) {
      'ok';
    },
   
    
  })

/////////////////////////////////////////////////////////// 
//////////////// Success Notification/////////////////////
//////////////////////////////////////////////////////////

  SuccessNotify =(Text:string)=> Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    showLoaderOnConfirm:true,

   willOpen : (toast)=> {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
   },
    
  }).fire({
    showConfirmButton:true,
    confirmButtonColor:"green",
    text:Text,
    width:500,
    icon:"success",
    iconColor:"Green",
    preConfirm(inputValue) {
      
    },
   
    
  })





}
