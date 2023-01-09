import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { EventService } from 'app/modules/admin/event/event.service';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, EventPagination, InventoryTag, InventoryVendor, Event } from 'app/modules/admin/event/event.types';


@Injectable({
    providedIn: 'root'
})

export class EventResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _eventService: EventService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: EventPagination; events: Event[] }>
    {
        return this._eventService.getEvents();
    }
}

@Injectable({
    providedIn: 'root'
})

export class EventsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _eventService: EventService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: EventPagination; events: Event[] }>
    {
        return this._eventService.getEvents();
    }
}
