import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MyFormField } from '../../Interfaces/myFormField';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})



export class SharedFieldValidationModule { 



  constructor(
    private toastr: ToastrService

  ){}







// api response send error msg rather than data
apiErrorResponse(errorMsg: string) {
  this.toastr.error(errorMsg);
}

apiSuccessResponse(msg: string) {
  this.toastr.success(msg);
}

apiInfoResponse(msg: string) {
  this.toastr.info(msg);
}



resetFormFields(formFields: MyFormField[]) : MyFormField[] {
  for (let i = 0; i < formFields.length; i++) {
    if (formFields[i].required == true) {
      formFields[i].value = '';
    }
  }
  return formFields;
}



validateName(nameStr: string, msg: string): boolean {
  // var regEx = /^[a-z][a-z\s]*$/;
  var regEx = /^[A-Za-z ]+$/;
  if (nameStr.match(regEx)) {
    return true;
  } else {
    this.showMsg(msg, 'invalid');
    return false;
  }
}

validateEmail(email: string, msg: string): boolean {
  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  if (!filter.test(email)) {
    this.showMsg(msg, 'invalid');
    return false;
  } else {
    return true;
  }
}


validateNTN(ntn: string, msg: string): boolean {
  if (ntn.length == 9) {
    return true;
  } else {
    this.showMsg(msg, 'invalid');
    return false;
  }
}

validateMobile(mobile: string, msg: string): boolean {
  if (mobile.length == 12 && !this.validateMaskFieldCharacter(mobile)) {
    return true;
  } else {
    this.showMsg(msg, 'invalid');
    return false;
  }
}

validatePhone(phone: string, msg: string): boolean {
  if (phone.length == 11 && !this.validateMaskFieldCharacter(phone)) {
    return true;
  } else {
    this.showMsg(msg, 'invalid');
    return false;
  }
}

validateCNIC(cnic: string, msg: string): boolean {
  if (cnic.length == 15 && !this.validateMaskFieldCharacter(cnic)) {
    return true;
  } else {
    this.showMsg(msg, 'invalid');
    return false;
  }
}

validPasswordStrength(password: string, msg: string): boolean {
  var letterNumber = /^[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;

  if (password.length > 7) {
    if (password.match(letterNumber)) {
      return true;
    } else {
      this.showMsg(msg, 'alphabets, special character and digit allowed in ');
      return false;
    }
  } else {
    this.showMsg(msg, 'minimum 8 characters in ');
    return false;
  }
}



showMsg(msg: string, rep: string) {
  this.toastr.info(msg.replace('enter', rep));
}

validateMaskFieldCharacter(val: string): boolean {
  // alert(val);
  // alert(val.includes('_'));
  return val.includes('_');
}






}
