import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
/*
The JWT interceptor intercepts the incoming requests from the application/user and
adds JWT token to the request's Authorization header, only if the user is logged in.
This JWT token in the request header is required to access the SECURE END API POINTS on the server
*/

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log('this.authenticationService.currentUserValue : ', localStorage.getItem('currentUser'));
        const currentUser = localStorage.getItem('currentUser');
        // console.log('currentUser IN JWT INTERCEPTOR', currentUser);
        if (currentUser) {
            // clone the incoming request and add JWT token in the cloned request's Authorization Header
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser}`
                }
            });
        }

        // handle any other requests which went unhandled
        return next.handle(request);
    }
}
