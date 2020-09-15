import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    
    constructor(private authenticationService: AuthenticationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = this.authenticationService.currentUserValue;
        const isLoggedIn = currentUser && currentUser['jwt'];
        const isApiUrl = req.url.includes(environment.apiUrl);

        if (isLoggedIn && isApiUrl) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser['jwt']}`
                }
            });
        }
        return next.handle(req);
    }

}