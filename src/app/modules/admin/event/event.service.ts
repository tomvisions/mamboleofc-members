import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import {InventoryPagination, Event, EventPagination } from 'app/modules/admin/event/event.types';
import {SharedModule} from "../../../shared/shared.module";

@Injectable({
    providedIn: 'root'
})
export class EventService
{
    private _pagination: BehaviorSubject<EventPagination | null> = new BehaviorSubject(null);
    private _event: BehaviorSubject<Event | null> = new BehaviorSubject(null);
    private _events: BehaviorSubject<Event[] | null> = new BehaviorSubject(null);

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
    get event$(): Observable<Event>
    {
        return this._event.asObservable();
    }

    /**
     * Getter for products
     */
    get events$(): Observable<Event[]>
    {
        return this._events.asObservable();
    }

    /**
     * Get product by id
     */
    getEventId(id: string): Observable<Event>
    {
        return this._events.pipe(
            take(1),
            map((events) => {

                // Find the product
                const event = events.find(item => item.id === id) || null;

                // Update the product
                this._event.next(event);

                // Return the product
                return event;
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
    getEvents(page: number = 0, size: number = 10, sort: string = 'identifier', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: EventPagination; events: Event[] }>
    {
        console.log('the url');
        console.log(`${this._sharedModule.apiLocation}/api/v1/event`);
        return this._httpClient.get<{ pagination: EventPagination; events: Event[] }>(`${this._sharedModule.apiLocation}/api/v1/event`, {
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
                this._events.next(response.events);
            })
        );
    }

    /**
     * Create product
     */
    createEvent(): Observable<Event>
    {
        return this.events$.pipe(
            take(1),
            switchMap(events => this._httpClient.post<Event>(`${this._sharedModule.apiLocation}/api/v1/event`, {
                "new": true
            }).pipe(
                map((newEvent) => {

                    // Update the products with the new product
                    this._events.next([newEvent, ...events]);

                    // Return the new product
                    return newEvent;
                })
            ))
        );
    }

    /**
     * Update Event
     *
     * @param identifier
     * @param event
     */
    updateEvent(identifier: string, event: Event): Observable<Event>
    {
        console.log('event');
        console.log({
            identifier,
            event
        });
        return this.events$.pipe(
            take(1),
            switchMap(events => this._httpClient.patch<Event>(`${this._sharedModule.apiLocation}/api/v1/event`, {
                identifier,
                event
            }).pipe(
                map((updatedTeam) => {

                    // Find the index of the updated product
                    const index = events.findIndex(item => item.identifier === identifier);

                    // Update the product
                    events[index] = updatedTeam;

                    // Update the products
                    this._events.next(events);

                    // Return the updated product
                    return updatedTeam;
                }),
                switchMap(updatedTeam => this.event$.pipe(
                    take(1),
                    filter(item => item && item.identifier === identifier),
                    tap(() => {

                        // Update the product if it's selected
                        this._event.next(updatedTeam);

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
        return this.events$.pipe(
            take(1),
            switchMap(teams => this._httpClient.delete('api/apps/ecommerce/inventory/product', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted product
                    const index = teams.findIndex(item => item.id === id);

                    // Delete the product
                    teams.splice(index, 1);

                    // Update the products
                    this._events.next(teams);

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
