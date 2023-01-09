import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import {InventoryPagination, Team, TeamPagination } from 'app/modules/admin/team/team.types';
import {SharedModule} from "../../../shared/shared.module";

@Injectable({
    providedIn: 'root'
})
export class TeamService
{
    private _pagination: BehaviorSubject<TeamPagination | null> = new BehaviorSubject(null);
    private _team: BehaviorSubject<Team | null> = new BehaviorSubject(null);
    private _teams: BehaviorSubject<Team[] | null> = new BehaviorSubject(null);
    private _apiLocation;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private _sharedModule: SharedModule)
    {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------


    /**
     * Getter for pagination
     */
    get pagination$(): Observable<InventoryPagination>
    {
        return this._pagination.asObservable();
    }

    /**
     * Getter for products
     */
    get team$(): Observable<Team>
    {
        return this._team.asObservable();
    }

    /**
     * Getter for products
     */
    get teams$(): Observable<Team[]>
    {
        return this._teams.asObservable();
    }

    /**
     * Get product by id
     */
    getTeamById(id: string): Observable<Team>
    {
        return this._teams.pipe(
            take(1),
            map((teams) => {

                // Find the product
                const team = teams.find(item => item.id === id) || null;

                // Update the product
                this._team.next(team);

                // Return the product
                return team;
            }),
            switchMap((product) => {

                if ( !product )
                {
                    return throwError('Could not found product with id of ' + id + '!');
                }

                return of(product);
            })
        );
    }

    /**
     * Get products
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getTeams(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: TeamPagination; teams: Team[] }>
    {
        return this._httpClient.get<{ pagination: TeamPagination; teams: Team[] }>(`${this._sharedModule.apiLocation}/api/v1/team`, {
            params: {
                page: '' + page,
                size: '' + size,
                sort,
                order,
                search
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._teams.next(response.teams);
            })
        );
    }

    /**
     * Create product
     */
    createTeam(): Observable<Team>
    {
        return this.teams$.pipe(
            take(1),
            switchMap(teams => this._httpClient.post<Team>(`${this._sharedModule.apiLocation}/api/v1/team`, {}).pipe(
                map((newTeam) => {

                    // Update the products with the new product
                    this._teams.next([newTeam, ...teams]);

                    // Return the new product
                    return newTeam;
                })
            ))
        );
    }

    /**
     * Update product
     *
     * @param id
     * @param team
     */
    updateTeam(id: string, team: Team): Observable<Team>
    {
        return this.teams$.pipe(
            take(1),
            switchMap(teams => this._httpClient.patch<Team>('api/apps/ecommerce/inventory/product', {
                id,
                team
            }).pipe(
                map((updatedTeam) => {

                    // Find the index of the updated product
                    const index = teams.findIndex(item => item.id === id);

                    // Update the product
                    teams[index] = updatedTeam;

                    // Update the products
                    this._teams.next(teams);

                    // Return the updated product
                    return updatedTeam;
                }),
                switchMap(updatedTeam => this.team$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the product if it's selected
                        this._team.next(updatedTeam);

                        // Return the updated product
                        return updatedTeam;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the product
     *
     * @param id
     */
    deleteTeam(id: string): Observable<boolean>
    {
        return this.teams$.pipe(
            take(1),
            switchMap(teams => this._httpClient.delete('api/apps/ecommerce/inventory/product', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted product
                    const index = teams.findIndex(item => item.id === id);

                    // Delete the product
                    teams.splice(index, 1);

                    // Update the products
                    this._teams.next(teams);

                    // Return the deleted gallery
                    return isDeleted;
                })
            ))
        );
    }

    /**
     * Update the avatar of the given contact
     *
     * @param id
     * @param avatar
     */
    /*uploadAvatar(id: string, avatar: File): Observable<Contact>
    {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.post<Contact>('api/apps/contacts/avatar', {
                id,
                avatar
            }, {
                headers: {
                    'Content-Type': avatar.type
                }
            }).pipe(
                map((updatedContact) => {

                    // Find the index of the updated contact
                    const index = contacts.findIndex(item => item.id === id);

                    // Update the contact
                    contacts[index] = updatedContact;

                    // Update the contacts
                    this._contacts.next(contacts);

                    // Return the updated contact
                    return updatedContact;
                }),
                switchMap(updatedContact => this.contact$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the contact if it's selected
                        this._contact.next(updatedContact);

                        // Return the updated contact
                        return updatedContact;
                    })
                ))
            ))
        );
    }*/
}
