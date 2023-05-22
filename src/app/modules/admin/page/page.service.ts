import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import {InventoryPagination, Page, PagePagination } from 'app/modules/admin/page/page.types';
import {SharedModule} from "../../../shared/shared.module";

@Injectable({
    providedIn: 'root'
})
export class PageService
{
    private _pagination: BehaviorSubject<PagePagination | null> = new BehaviorSubject(null);
    private _page: BehaviorSubject<Page | null> = new BehaviorSubject(null);
    private _pages: BehaviorSubject<Page[] | null> = new BehaviorSubject(null);

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
    get page$(): Observable<Page>
    {
        return this._page.asObservable();
    }

    /**
     * Getter for products
     */
    get pages$(): Observable<Page[]>
    {
        return this._pages.asObservable();
    }

    /**
     * Get product by id
     */
    getPageId(identifier: string): Observable<Page>
    {
        return this._pages.pipe(
            take(1),
            map((pages) => {

                // Find the product
                const page = pages.find(item => item.identifier === identifier) || null;

                // Update the product
                this._page.next(page);

                // Return the product
                return page;
            }),
            switchMap((page) => {

                if ( !page )
                {
                    return throwError('Could not found product with id of ' + identifier + '!');
                }

                return of(page);
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
    getPages(page: number = 0, size: number = 10, sort: string = 'identifier', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: PagePagination; pages: Page[] }>
    {
        return this._httpClient.get<{ pagination: PagePagination; pages: Page[] }>(`${this._sharedModule.apiLocation}/api/v1/page`, {
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
                this._pages.next(response.pages);
            })
        );
    }

    /**
     * Create product
     */
    createPage(): Observable<Page>
    {
        return this.pages$.pipe(
            take(1),
            switchMap(pages => this._httpClient.post<Page>(`${this._sharedModule.apiLocation}/api/v1/page`, {
                "new": true
            }).pipe(
                map((newPage) => {
                    console.log('new page');
                    console.log(newPage);
                    // Update the products with the new product
                    this._pages.next([newPage, ...pages]);

                    // Return the new product
                    return newPage;
                })
            ))
        );
    }


    deployToProductiom() {
        this._httpClient.post(`${this._sharedModule.apiLocation}/api/v1/deploy`, {
            "section":"page"
        });
        //return this.pages$.pipe(
    }
    /**
     * Update Event
     *
     * @param identifier
     * @param page
     */
    updatePage(identifier: string, page: Page): Observable<Page>
    {
        console.log('page');
        console.log({
            identifier,
            page
        });
        return this.pages$.pipe(
            take(1),
            switchMap(pages => this._httpClient.patch<Page>(`${this._sharedModule.apiLocation}/api/v1/page`, {
                identifier,
                page
            }).pipe(
                map((updatedPage) => {

                    // Find the index of the updated product
                    const index = pages.findIndex(item => item.identifier === identifier);

                    // Update the product
                    pages[index] = updatedPage['data'];

                    // Update the products
                    this._pages.next(pages);

                    // Return the updated product
                    return updatedPage;
                }),
                switchMap(updatedTeam => this.page$.pipe(
                    take(1),
                    filter(item => item && item.identifier === identifier),
                    tap(() => {

                        // Update the product if it's selected
                        this._page.next(updatedTeam);

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
    deletePage(id: string): Observable<boolean>
    {
        return this.pages$.pipe(
            take(1),
            switchMap(teams => this._httpClient.delete('api/apps/ecommerce/inventory/page', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted product
                    const index = teams.findIndex(item => item.id === id);

                    // Delete the product
                    teams.splice(index, 1);

                    // Update the products
                    this._pages.next(teams);

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
