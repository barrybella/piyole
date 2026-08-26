import { UserService } from './../services/user.service';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()

export class AuthInterceptor implements HttpInterceptor{
    constructor(private userService: UserService){}
    
    intercept(req: HttpRequest<any>, next:HttpHandler){ 
        const authReq =  req.clone({
            headers: req.headers.set('Authorization', `Bearer ${this.userService.getToken()}`)
        });

        return next.handle(authReq);
    }

}