import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';


// SERVICE
import { AuthenticationService } from '../services';


import { SnackBar } from '../common/shared'

// const errorLog = new Logger('ErrorHandlerInterceptor');
@Injectable({
    providedIn: 'root'
  })
  
export class ErrorInterceptor implements HttpInterceptor {
    private readonly notifier: NotifierService;

    constructor(public notifierService: NotifierService, private authenticationService: AuthenticationService, private snackBar: SnackBar) {
    this.notifier = notifierService;
     }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(map(response =>
                this.successHandler(response)
            ),
            catchError(error => this.errorHandler(error))
        )
    }
  
    private successHandler(response: HttpEvent<any>): HttpEvent<any> {
        
        if (response instanceof HttpResponse) {
            if(response.body.message){
                this.notifier.notify(response.body.type, response.body.message);
            }
            // this.snackBar.snackbars(response.body.message);

        }
          return response;
    }

    private errorHandler(error: HttpEvent<any>): Observable<HttpEvent<any>> {
        
        if(error instanceof HttpErrorResponse){
            if(error.status == 500){
            this.notifier.notify( "error", "Backend process in progress. Please try after sometime!");
        }
            return throwError(error);
        }
    }
   
}