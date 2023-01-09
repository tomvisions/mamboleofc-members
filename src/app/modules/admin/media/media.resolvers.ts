import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { MediaService } from 'app/modules/admin/media/media.service';
import { GalleryPagination, Gallery } from 'app/modules/admin/media/media.types';

@Injectable({
    providedIn: 'root'
})
export class MediaResolver// implements Resolve<any>
{
    /**
     * Constructor
     *//*
    constructor(
        private _mediaService: MediaService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     *//*
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User>
    {
        return this._mediaService.getUserById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested product is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    } */
//}
/*
@Injectable({
    providedIn: 'root'
})

export class Media1Resolver implements Resolve<any>
{
    /**
     * Constructor
     *//*
    constructor(private _mediaService: MediaService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     *//*
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: UserPagination; users: User[] }>
    {
        return this._mediaService.getUsers();
    } */
}
