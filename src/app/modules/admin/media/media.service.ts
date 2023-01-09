import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, filter, map, Observable, of, ReplaySubject, switchMap, take, tap, throwError} from 'rxjs';
import {UserPagination, User} from 'app/modules/admin/user/user.types';
import {Gallery, GalleryPagination, Image} from 'app/modules/admin/media/media.types';
import {SharedModule} from "../../../shared/shared.module";
import {resolve} from "@angular/compiler-cli";
//import { uuid } from 'uuidv4';
import * as uuid from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class MediaService {
    // Private
    private _pagination: BehaviorSubject<UserPagination | null> = new BehaviorSubject(null);
    private _galleries: BehaviorSubject<Gallery[] | null> = new BehaviorSubject(null);
    private _gallery: BehaviorSubject<Gallery | null> = new BehaviorSubject(null);
    private _images: BehaviorSubject<Image[] | null> = new BehaviorSubject(null);
    private _image: BehaviorSubject<Image | null> = new BehaviorSubject(null);

    private _apiLocation;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
        const shared = new SharedModule();
        shared.ngOnInit();
        this._apiLocation = shared.apiLocation;
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
    get image$(): Observable<Image> {
        return this._image.asObservable();
    }

    /**
     * Getter for product
     */
    get images$(): Observable<Image[]> {
        return this._images.asObservable();
    }

    /**
     * Getter for product
     */
    get gallery$(): Observable<Gallery> {
        return this._gallery.asObservable();
    }

    /**
     * Getter for product
     */
    get galleries$(): Observable<Gallery[]> {
        return this._galleries.asObservable();
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
     *//*
    getImages(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: UserPagination; users: Image[] }> {
        return this._httpClient.get<{ pagination: UserPagination; users: User[] }>(`${this._apiLocation}/api/v1/gallery/image`, {
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
                this._images.next(response.users);
            })
        );
    } */

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
    getGalleries(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: UserPagination; users: Gallery[] }> {
        return this._httpClient.get<{ pagination: GalleryPagination; users: Gallery[] }>(`${this._apiLocation}/api/v1/gallery`, {
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
                this._galleries.next(response.users);
            })
        );
    }

    /**
     * Get product by id
     *//*
    getUserById(id: string): Observable<User> {
        return this._media.pipe(
            take(1),
            map((users) => {

                // Find the product
                const user = users.find(item => item.id === id) || null;

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
    createGallery(gallery): Observable<Gallery> {
        console.log('placing new gallery');
        console.log(gallery);
        return this.galleries$.pipe(
            take(1),
            switchMap(galleries => this._httpClient.post<Gallery>('https://api-stage.mamboleofc.ca/api/v1/gallery', gallery).pipe(
                map((newGallery) => {

                    // Update the products with the new product
                    this._galleries.next([newGallery, ...galleries]);

                    // Return the new product
                    return newGallery;
                })
            ))
        );
    }

    DataURIToBlob(dataURI: string)  {
        const splitDataURI = dataURI.split(',')
        const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
        const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

        const ia = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i)

        return new Blob([ia], { type: mimeString })
    }

    /**
     * Update product
     *
     * @param id
     * @param user
     * @param avatars
     */
    AddMedia(id: string, gallery: Gallery, avatars): Observable<Image> {
      //  for (let avatar of avatars) {
         //   const file = this.DataURIToBlob(avatar)
            const formData = new FormData();
            console.log('the avatar');
            console.log(avatars);
            const imageName = uuid.v4();
            formData.append('files', JSON.stringify(avatars));
            formData.append('id', imageName)
            formData.append('gallery', 'after-party');

/*            this._httpClient.post<Image>('http://127.0.0.1:3000/api/v1/gallery/images', formData).subscribe((res) => {
//            this._httpClient.post<Image>('https://api-stage.mamboleofc.ca/api/v1/gallery/images', formData).subscribe((res) => {
                console.log('the rest2');
                console.log(res);
                //       console.log(res)
                //     this.multipleInput.nativeElement.value = ""
                //   console.log(res.path)
                // this.displayMultipleImages = true
                //this.displayMultipleImageArray = res.path

            }) */
        //}
     //   const formData = new FormData()
  //      console.log('stringify');
    //    console.log(JSON.stringify(avatar));

//        for (let i = 0; i < avatar.length; i++) {
      //      console.log('the avatar single');
    //        console.log(avatar[i]);
           // const imageName = uuid.v4();
          //  formData.append('file', avatar);
  //      }
//        formData.append('file', avatar[i]);
  //      formData.append('caption', id);
   //     formData.append('id',  imageName);
     //   formData.append('gallery', 'after-party');


  /*      if (avatar) {
            const formData = new FormData()
            formData.append('file', avatar);
            formData.append('id', id);
            formData.append('name', 'Team Photos');

            this._httpClient.post<Gallery>('https://api-stage.mamboleofc.ca/api/v1/gallery', formData).subscribe((res) => {
                console.log(res);
             //       console.log(res)
               //     this.multipleInput.nativeElement.value = ""
                 //   console.log(res.path)
                   // this.displayMultipleImages = true
                    //this.displayMultipleImageArray = res.path

                })
        }*//*
        this._httpClient.post<Image>('https://api-stage.mamboleofc.ca/api/v1/gallery/images', {}).subscribe((res) => {
            console.log('the rest');
            console.log(res);
            //       console.log(res)
            //     this.multipleInput.nativeElement.value = ""
            //   console.log(res.path)
            // this.displayMultipleImages = true
            //this.displayMultipleImageArray = res.path

        }) */

      //  return;
        return this.images$.pipe(
            take(1),
      //      switchMap(images => this._httpClient.post<Image>('https://ez7jfpb055.execute-api.us-east-1.amazonaws.com/stage/api/v1/gallery/images', {}).pipe(
                switchMap(images => this._httpClient.post<Image>('http://127.0.0.1:3000/api/v1/gallery/images', formData).pipe(


                map((updatedImage) => {
                    console.log('let us go');
                    console.log(updatedImage);
                    console.log('the image');
                    console.log(images);
                    // Find the index of the updated product
              //      const index = images.findIndex(item => item.id === id);

                    // Update the product
                //    images[index] = updatedImage;

                    // Update the products
                    this._images.next(images);

                    // Return the updated product
                    return updatedImage;
                }),
                switchMap(updatedImage => this.image$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the product if it's selected
                        this._image.next(updatedImage);

                        // Return the updated product
                        return updatedImage;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the product
     *
     * @param id
     *//*
    deleteUser(id: string): Observable<boolean> {
        return this.users$.pipe(
            take(1),
            switchMap(users => this._httpClient.delete('https://4rcpk8ka4h.execute-api.us-east-1.amazonaws.com/prod/api/v1/user', {params: {id}}).pipe(
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

    convertFile(file : File) : Observable<string> {
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
     *//*
    uploadAvatar(id: string, avatar: File): Observable<User> {
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
    // /*
    /*
        return this.users$.pipe(
            take(1),
            switchMap(users => this._httpClient.post<User>(`${this._apiLocation}/api/v1/user/avatar`, {
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
