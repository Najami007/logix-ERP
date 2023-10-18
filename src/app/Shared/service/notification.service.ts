import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr :ToastrService ) { }

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


////////////////////////////////////////////


}
