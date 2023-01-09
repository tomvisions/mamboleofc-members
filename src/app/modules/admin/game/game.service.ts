import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { InventoryBrand, InventoryCategory, GamePagination, InventoryTag, InventoryVendor, Game} from 'app/modules/admin/game/game.types';
import { Team} from 'app/modules/admin/team/team.types';

@Injectable({
    providedIn: 'root'
})
export class GameService
{
    // Private
    private _pagination: BehaviorSubject<GamePagination | null> = new BehaviorSubject(null);
    private _game: BehaviorSubject<Game | null> = new BehaviorSubject(null);
    private _games: BehaviorSubject<Game[] | null> = new BehaviorSubject(null);
    private _teams: BehaviorSubject<Team[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    /**
     * Getter for pagination
     */
    get pagination$(): Observable<GamePagination>
    {
        return this._pagination.asObservable();
    }

    /**
     * Getter for product
     */
    get teams$(): Observable<Team[]>
    {
        return this._teams.asObservable();
    }


    /**
     * Getter for product
     */
    get game$(): Observable<Game>
    {
        return this._game.asObservable();
    }

    /**
     * Getter for products
     */
    get games$(): Observable<Game[]>
    {
        return this._games.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
    getGames(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: GamePagination; games: Game[] }>
    {
        return this._httpClient.get<{ pagination: GamePagination; games: Game[] }>('https://4rcpk8ka4h.execute-api.us-east-1.amazonaws.com/prod/api/v1/game', {
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
                this._games.next(response.games);
            })
        );
    }

    /**
     * Get product by id
     */
    getGameById(id: string): Observable<Game>
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
    }

    /**
     * Create game
     */
    createGame(): Observable<Game>
    {
        const params = {'name':'New Game Name'};
        return this.games$.pipe(
            take(1),
            switchMap(games => this._httpClient.post<Game>('https://4rcpk8ka4h.execute-api.us-east-1.amazonaws.com/prod/api/v1/game',
                params
            ).pipe(
                map((newGame) => {
                    // Update the products with the new product
                    this._games.next([newGame, ...games]);

                    // Return the new product
                    return newGame;
                })
            ))
        );
    }

    /**
     * Update product
     *
     * @param id
     * @param product
     */
    updateGame(id: string, game: Game): Observable<Game>
    {
        return this.games$.pipe(
            take(1),
            switchMap(games => this._httpClient.patch<Game>('https://4rcpk8ka4h.execute-api.us-east-1.amazonaws.com/prod/api/v1/game', {
                id,
                game
            }).pipe(
                map((updatedGame) => {

                    // Find the index of the updated product
                    const index = games.findIndex(item => item.id === id);

                    // Update the product
                    games[index] = updatedGame;

                    // Update the products
                    this._games.next(games);

                    // Return the updated product
                    return updatedGame;
                }),
                switchMap(updatedGame => this.game$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the product if it's selected
                        this._game.next(updatedGame);

                        // Return the updated product
                        return updatedGame;
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
    deleteGame(id: string): Observable<boolean>
    {
        return this.games$.pipe(
            take(1),
            switchMap(games => this._httpClient.delete('https://4rcpk8ka4h.execute-api.us-east-1.amazonaws.com/prod/api/v1/game', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted product
                    const index = games.findIndex(item => item.id === id);

                    // Delete the product
                    games.splice(index, 1);

                    // Update the products
                    this._games.next(games);

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
