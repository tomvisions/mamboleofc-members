import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { PageService } from 'app/modules/admin/page/page.service';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, PagePagination, InventoryTag, InventoryVendor, Page } from 'app/modules/admin/page/page.types';


@Injectable({
    providedIn: 'root'
})

export class PageResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _pageService: PageService)
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
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: PagePagination; pages: Page[] }>
    {
        return this._pageService.getPages();
    }
}

@Injectable({
    providedIn: 'root'
})

export class PagesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _pageService: PageService)
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
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: PagePagination; pages: Page[] }>
    {
        return this._pageService.getPages();
    }
}
