import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Roster, InventoryCategory, GamePagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/roster/roster.types';
import { User } from 'app/modules/admin/user/user.types';
import {SharedModule} from "../../../shared/shared.module";
import {Game} from "../game/game.types";


@Injectable({
    providedIn: 'root'
})
export class RosterService
{
    private _rosters: BehaviorSubject<Roster[] | null> = new BehaviorSubject(null);
    private _roster: BehaviorSubject<Roster | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<InventoryTag[] | null> = new BehaviorSubject(null);
    private _vendors: BehaviorSubject<InventoryVendor[] | null> = new BehaviorSubject(null);
    private _apiLocation;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private _sharedModule: SharedModule)
    {
     //   const shared = new SharedModule();
      //  shared.ngOnInit();
        this._apiLocation = this._sharedModule.apiLocation;
   //     console.log('the location');
     //   console.log(this._apiLocation);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for product
     */
    get rosters$(): Observable<Roster[]>
    {
        return this._rosters.asObservable();
    }

    /**
     * Getter for product
     */
    get roster$(): Observable<Roster>
    {
        return this._roster.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get brands
     */
    getRoster(id): Observable<Roster[]>
    {
        return this._httpClient.get<Roster[]>(`${this._apiLocation}/api/v1/roster?roster=${id}`).pipe(
            tap((roster) => {
                this._rosters.next(roster);
            })
        );
    }

    /**
     * Get product by id
     *//*
    getRosterByGameId2(id: string): Observable<Game>
    {
        return this._games.pipe(
            take(1),
            map((games) => {

                // Find the product
                const game = games.find(item => item.id === id) || null;

                // Update the product
                this._game.next(game);

                // Return the product
                return game;
            }),
            switchMap((game) => {

                if ( !game )
                {
                    return throwError('Could not found game with id of ' + id + '!');
                }

                return of(game);
            })
        );
    } */

    getRosterByGameId(id): Observable<Roster>
    {
        console.log(`${this._apiLocation}/api/v1/roster?game=${id}`);
        return this.roster$.pipe(
            take(1),
            //   switchMap(roster => this._httpClient.get<Roster>(`${apiLocation}/api/v1/roster?roster=${id}`,
            switchMap(roster => this._httpClient.get<Roster>(`${this._apiLocation}/api/v1/roster?game=${id}`,
                { headers: {
                        'Content-Type': 'application/json'
                    }}).pipe(
                map((roster) => {

                    this._roster.next(roster);

                    return roster;
                }),
            ))
        );
    }

/*
    getRoster(id): Observable<Roster[]>
    {
        return this.roster$.pipe(
            take(1),
            switchMap(roster => this._httpClient.get<Roster[]>(`${apiLocation}/api/v1/roster?roster=${id}`,
                { headers: {
                        'Content-Type': 'application/json'
                        }}).pipe(
                map((roster) => {

                    this._roster.next(roster);

                    return roster;
                }),
            ))
        );
    } */

    /**
     * Update roster
     *
     * @param userId
     * @param rosterId
     * @param gameId
     */
    updateRoster(userId: number, rosterId: number, gameId: number): Observable<Roster>
    {
        console.log('the id');
        console.log(userId);
        console.log('the roster');
        console.log(rosterId);

        console.log('object');
        console.log({
            userId,
            rosterId,
            gameId
        });
        return this.rosters$.pipe(
            take(1),
            switchMap(roster => this._httpClient.post<Roster>(`${this._apiLocation}/api/v1/roster`, {
                userId,
                "id": rosterId,
                gameId
            }).pipe(
                map((updatedRoster) => {

                    // Find the index of the updated product
                    const index = roster.findIndex(item => item.id === userId);

                    // Update the product
                    roster[index] = updatedRoster;

                    // Update the products
                    this._rosters.next(roster);

                    // Return the updated product
                    return updatedRoster
                }),
                switchMap(updatedRoster => this.roster$.pipe(
                    take(1),
                    filter(item => item && item.id === userId),
                    tap(() => {

                        // Update the product if it's selected
                        this._roster.next(updatedRoster);

                        // Return the updated product
                        return updatedRoster;
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
    deleteRoster(id: number): Observable<boolean>
    {
        return this.rosters$.pipe(
            take(1),
            switchMap(roster => this._httpClient.delete('api/apps/ecommerce/inventory/product', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted product
                    const index = roster.findIndex(item => item.id === id);

                    // Delete the product
                    roster.splice(index, 1);

                    // Update the products
                    this._rosters.next(roster);

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
