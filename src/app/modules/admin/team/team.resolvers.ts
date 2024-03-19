import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { TeamService } from 'app/modules/admin/team/team.service';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, TeamPagination, InventoryTag, InventoryVendor, Team } from 'app/modules/admin/team/team.types';


@Injectable({
    providedIn: 'root'
})

export class TeamResolver 
{
    /**
     * Constructor
     */
    constructor(private _teamService: TeamService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: TeamPagination; teams: Team[] }>
    {
        return this._teamService.getTeams();
    }
}

@Injectable({
    providedIn: 'root'
})

export class TeamsResolver 
{
    /**
     * Constructor
     */
    constructor(private _teamService: TeamService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: TeamPagination; teams: Team[] }>
    {
        return this._teamService.getTeams();
    }
}
