import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, filter, map, Observable, of, ReplaySubject, switchMap, take, tap, throwError} from 'rxjs';
import {UserPagination, User} from 'app/modules/admin/user/user.types';
import {Team} from 'app/modules/admin/team/team.types';
import {SharedModule} from "../../../shared/shared.module";
import {resolve} from "@angular/compiler-cli";
import {AuthService} from "../../../core/auth/auth.service";


@Injectable({
    providedIn: 'root'
})
export class UserService {
    // Private
    private _pagination: BehaviorSubject<UserPagination | null> = new BehaviorSubject(null);
    private _user: BehaviorSubject<User | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
    private _teams: BehaviorSubject<Team[] | null> = new BehaviorSubject(null);
    private _authService: AuthService

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, authService: AuthService, private _sharedModule: SharedModule) {
        this._authService = authService;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    /**
     * Getter for pagination
     */
    get pagination$(): Observable<UserPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for product
     */
    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    /**
     * Getter for product
     */
    get users$(): Observable<User[]> {
        return this._users.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get Users
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getUsers(page: number = 0, size: number = 10, sort: string = 'username', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: UserPagination; users: User[] }> {

        console.log('the access token');
        console.log(this._authService);
        console.log('url');
        console.log(`${this._sharedModule.apiLocation}/api/v1/user`);
        return this._httpClient.get<{ pagination: UserPagination; users: User[] }>(`${this._sharedModule.apiLocation}/api/v1/user`, {
            params: {
                page: '' + page,
                size: '' + size,
                sort,
                order,
                search
            },
            headers: {
                Authorization: `Bearer ${this._authService.accessToken}`
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._users.next(response.users);

            })
        );
    }

    /**
     * Get product by id
     */
    getUserById(id: string): Observable<User> {
        return this._users.pipe(
            take(1),
            map((users) => {

                // Find the product
                const user = users.find(item => item.id === Number(id)) || null;

                // Update the product
                this._user.next(user);

                // Return the product
                return user;
            }),
            switchMap((user) => {

                if (!user) {
                    return throwError('Could not found user with id of ' + id + '!');
                }

                return of(user);
            })
        );
    }

    /**
     * Create product
     */
    createUser(): Observable<User> {
        return this.users$.pipe(
            take(1),
            switchMap(users => this._httpClient.post<User>(`${this._sharedModule.apiLocation}/api/v1/user/api/v1/user`, {}).pipe(
                map((newUser) => {

                    // Update the products with the new product
                    this._users.next([newUser, ...users]);

                    // Return the new product
                    return newUser;
                })
            ))
        );
    }

    /**
     * Update product
     *
     * @param id
     * @param user
     * @param avatar
     */
    updateUser(id: number, user: User, avatar: null | string): Observable<User> {
        console.log('update user');
        console.log({
            id,
            user
        });
        console.log('here we go');
        console.log(avatar);
        if (avatar) {
            const formData = new FormData()
            formData.append('file', avatar)
            formData.append('id', id.toString());
            formData.append('user', JSON.stringify(user));

            return this.users$.pipe(
                take(1),
                switchMap(users => this._httpClient.post<User>(`${this._sharedModule.apiLocation}/api/v1/user/avatar`, formData).pipe(
                    (map)((updatedUser) => {


                        // Find the index of the updated product
                        const index = users.findIndex(item => item.id === id);

                        // Update the product
                        users[index] = updatedUser;

                        // Update the products
                        this._users.next(users);

                        // Return the updated product
                        return updatedUser;
                    }),
                    switchMap(updatedUser => this.user$.pipe(
                        take(1),
                        filter(item => item && item.id === id),
                        tap(() => {

                            // Update the product if it's selected
                            this._user.next(updatedUser);

                            // Return the updated product
                            return updatedUser;
                        })
                    ))
                ))
            )
        } else {

            return this.users$.pipe(
                take(1),
                switchMap(users => this._httpClient.post<User>(`${this._sharedModule.apiLocation}/api/v1/user`, {
                    id,
                    user,


                }).pipe(
                    map((updatedUser) => {

                        // Find the index of the updated product
                        const index = users.findIndex(item => item.id === id);

                        // Update the product
                        users[index] = updatedUser;

                        // Update the products
                        this._users.next(users);

                        // Return the updated product
                        return updatedUser;
                    }),
                    switchMap(updatedUser => this.user$.pipe(
                        take(1),
                        filter(item => item && item.id === id),
                        tap(() => {

                            // Update the product if it's selected
                            this._user.next(updatedUser);

                            // Return the updated product
                            return updatedUser;
                        })
                    ))
                ))
            );
        }
    }

    /**
     * Delete the product
     *
     * @param id
     */
    deleteUser(id: number): Observable<boolean> {
        return this.users$.pipe(
            take(1),
            switchMap(users => this._httpClient.delete(`${this._sharedModule.apiLocation}/api/v1/user`, {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted product
                    const index = users.findIndex(item => item.id === id);

                    // Delete the product
                    users.splice(index, 1);

                    // Update the products
                    this._users.next(users);

                    // Return the deleted gallery
                    return isDeleted;
                })
            ))
        );
    }

    arrayBufferToBase64(buffer) {
        console.log('buffer');
        console.log(buffer);
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        console.log('the len');
        console.log(len);
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const ff = window.btoa(binary);
        console.log('ff');
        console.log(ff);
        return ff;
        //console.log(ff);
    }

    enabledToBase64(avatar) {
        const reader = new FileReader();
        reader.readAsDataURL(avatar);
        //  reader.onload = () => {
        //      console.log('the hello')
        //      return reader.result;
        //  };

        return reader.result;


    }

    convertFile(file: File): Observable<string> {
        const result = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (event) => result.next(btoa(event.target.result.toString()));
        return result;
    }


    /**
     * Update the avatar of the given contact
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<User> {
        const the = this.convertFile(avatar);
        console.log('the');
        console.log(the);
        /*
        const encodeBased64 = async(image) => {
   //         console.log("Downloading image...");
     //       var res = await fetch(url);
       //     var blob = await res.blob();
            return btoa(
                new Uint8Array(image.arrayBuffer)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            */
        //    return btoa(String.fromCharCode(...new Uint8Array(image.arrayBuffer())));
        //   var blob = await image.arrayBuffer();
        //  console.log('arrived');
        //  console.log(await blob);
        //  return blob
        /*            const result = await new Promise((resolve, reject) => {
                        var reader = new FileReader();
                        reader.addEventListener("load", function () {
                            resolve(reader.result);
                        }, false);

                        reader.onerror = () => {
                            return reject(this);
                        };
                        reader.readAsDataURL(blob);
                    }) */

        //       return result
        /*    const encodeBased64 = async (buffer) => {
                //   return await buffer.arrayBuffer();
                console.log('array buff');
                console.log(buffer.arrayBuffer());

                //return this.arrayBufferToBase64(await buffer.arrayBuffer());
                const ff = this.arrayBufferToBase64(await buffer.arrayBuffer());
                console.log('the ff');
                console.log(ff);
                console.log(typeof ff);
                return ff;
            } */

        //      const the = encodeBased64(avatar);

//        console.log('avatar er');
//        console.log(btoa(await avatar.arrayBuffer());
        //       console.log('bo')
        //     btoa(avatar.);
        //   console.log({
        //      id: id,
        //     avatar: btoa(avatar)
        // });
        return this.users$.pipe(
            take(1),
            switchMap(users => this._httpClient.post<User>(`${this._sharedModule.apiLocation}/api/v1/user/avatar`, {
                id: id,
                avatar: avatar
            }, {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': "application/json"
                }
            }).pipe(
                map((updatedContact) => {

                    console.log('go go');
                    console.log(users);
                    // Find the index of the updated contact
                    const index = users.findIndex(item => item.id === id);

                    // Update the contact
                    users[index] = updatedContact;

                    // Update the contacts
                    this._users.next(users);

                    // Return the updated contact
                    return updatedContact;
                }),
                switchMap(updatedContact => this.user$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the contact if it's selected
                        this._user.next(updatedContact);

                        // Return the updated contact
                        return updatedContact;
                    })
                ))
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
