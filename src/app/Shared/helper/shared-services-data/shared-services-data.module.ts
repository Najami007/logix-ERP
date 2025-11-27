import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment.development';
import { Observable, Subject, catchError, retry, takeUntil, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SharedFieldValidationModule } from '../shared-field-validation/shared-field-validation.module';
import { NotificationService } from '../../service/notification.service';
import { ToastrService } from 'ngx-toastr';




@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})



export class SharedServicesDataModule { 

  private baseURL = environment.mainApi;

  destroy$: Subject<boolean> = new Subject<boolean>();

  error = '';
  result:any = [];



  constructor(
    private http:HttpClient,
    private valid:SharedFieldValidationModule,
    private msg:NotificationService,
    private toastr: ToastrService
  

  ){}


  
  //Http GET
  public getRequest(functionName: string, params: any): Observable<any> {
    return this.http
      .get(this.baseURL + functionName + params)
      .pipe(retry(3), catchError(this.handleError));
  }

  // Http POST
  public createRequest(functionName: string, data: any): Observable<any> {
    return this.http
      .post(this.baseURL + functionName, data)
      .pipe(retry(3), catchError(this.handleError));
  }

  // Http PUT
  public updateRequest(functionName: string, data: any) {
    return this.http
      .put(this.baseURL + functionName, data)
      .pipe(retry(3), catchError(this.handleError));
  }

  // HttpDelete
  public deleteRequest(functionName: string, params: string) {
    return this.http
      .delete(this.baseURL + functionName + '?' + params)
      .pipe(retry(3), catchError(this.handleError));
  }
  // http Error Handling
  handleError(error: HttpErrorResponse) {
    // alert('catch error');

    let errorMessage = 'Unknown Error!';

    if (error.error instanceof ErrorEvent) {
      // client side error
      errorMessage = "Error:" + error.error.message;
    } else {
      // server side error
      errorMessage = 'Error Code: '+ error.status +'\nMessage: '+ error.message;
    }

    //this.valid.apiErrorResponse(errorMessage);
    console.log(errorMessage);
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }
  
  



    //////////////////////////////////
  // CRUD Operation
  //////////////////////////////////

  // get Function
  public getHttp(url: string, param: any): any {
    this.result = [];
    return this.getRequest(url, param).pipe(takeUntil(this.destroy$));
  }


  public saveHttp(url: string,credentials: any): any {
     
        return this.createRequest(url, credentials).pipe(
          takeUntil(this.destroy$)
        );
      
    }
  


    public deleteHttp(url: string,credentials: any,): any {
          return this.createRequest(url, credentials).pipe(
            takeUntil(this.destroy$)
          );  
      }




}
