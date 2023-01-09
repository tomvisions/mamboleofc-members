import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GalleryPagination, Gallery, ImagePagination, Image } from 'app/modules/admin/media/media.types';
import { Team } from 'app/modules/admin/team/team.types';
import { MediaService } from 'app/modules/admin/media/media.service';
import * as _ from 'lodash';
import {User} from "../../user/user.types";

@Component({
    selector       : 'media-gallery',
    templateUrl    : './info.component.html',
    styles         : [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
})
export class ImageComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;

    images$: Observable<Image[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: ImagePagination;
    filteredTeams: Team[];
    searchInputControl: FormControl = new FormControl();
    selectedImage: Image | null = null;
    selectedImageForm: FormGroup;
    selectedBoo: FormGroup
    teams: Team[];
    images: Image[];
    currentUser;
  //  teams$: Observable<Team[]>;
    tagsEditMode: boolean = false;
    imageError: string;
    isImageSaved: boolean = false;
    cardImageBase64: string;
    avatar: File[];


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _mediaService: MediaService,
    )
    {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // Create the selected product form
        this.selectedImageForm = this._formBuilder.group({
            id               : [''],
            name             : [''],
            files            : ['']
        });

        // Get the pagination
        this._mediaService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: ImagePagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the users
      //  this.users$ = this._mediaService.users$;
/*
        // Get the teams
        this._mediaService.media$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((teams: Team[]) => {

                // Update the tags
                this.teams = teams;
                this.filteredTeams = teams;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._mediaService.getMedia(0, 10, 'username', 'asc', query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
*/
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'username',
                start       : 'asc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._mediaService.getGalleries(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    fileChangeEvent(fileInput: any) {
        this.imageError = null;
    //    console.log(fileInput);
      //  console.log('fileInput');
        const images = [];
        if (fileInput.target.files) {
         //   console.log('target files');
           // console.log(fileInput.target.files)
            // Size Filter Bytes
            const max_size = 20971520;
            const allowed_types = ['image/png', 'image/jpeg'];
            const max_height = 15200;
            const max_width = 25600;
            for (let file of fileInput.target.files) {

                if (file.size > max_size) {
                    this.imageError =
                        'Maximum size allowed is ' + max_size / 1000 + 'Mb';

                    return false;
                }

                if (!_.includes(allowed_types, file.type)) {
                    this.imageError = 'Only Images are allowed ( JPG | PNG )';
                    return false;
                }
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    const image = new Image();
                    image.src = e.target.result;
                    image.onload = rs => {
                        const img_height = rs.currentTarget['height'];
                        const img_width = rs.currentTarget['width'];

                        //  console.log(img_height, img_width);


                        if (img_height > max_height && img_width > max_width) {
                            this.imageError =
                                'Maximum dimentions allowed ' +
                                max_height +
                                '*' +
                                max_width +
                                'px';
                            return false;
                        } else {
                            const imgBase64Path = e.target.result;
                            this.cardImageBase64 = e.target.result;
                            this.isImageSaved = true;
                            // this.previewImagePath = imgBase64Path;
                        }
                    };
//                console.log('file component');
                    //              console.log(fileInput.target.files[0]);
                    //            console.log('type');
                    //          console.log(typeof fileInput.target.files[0]);
                //    this.avatar = file;
                    //this.file = fileInput.target.files[0];
                    //      const formData = new FormData();
                    //    formData.append('file', fileInput.target.files[0]);
                    //  console.log('dddo');
                    //ååååconsole.log(reader)

               //     const result = reader.result;
                 //   console.log('result')
                   // console.log(typeof result);
                   // console.log(reader.result);
                    images.push(reader.result);
              //      this.avatar = images;
                //    this.avatar = fileInput.target.files;
                    /*
                      if (result.replace('image/png', '')) {

                      } */
            //        console.log(images);
                    this.avatar = images;
                    document.getElementById('avatar').setAttribute('style', `background: url('${reader.result}') no-repeat;`);
                    document.getElementById('media').setAttribute('value', JSON.stringify(images));
                };

                reader.readAsDataURL(file);
                //      document.getElementById('avatar').src="reader.result;"
            }
        }
    }


    removeImage() {
        this.cardImageBase64 = null;
        this.isImageSaved = false;
    }

    /**
     * Upload avatar
     *
     * @param fileList
     * @param userId
     *//*
    uploadAvatar(fileList: FileList, userId): void
    {
        // Return if canceled
        if ( !fileList.length )
        {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if ( !allowedTypes.includes(file.type) )
        {
            return;
        }

        // Upload the avatar
        this._mediaService.uploadAvatar(userId, file).subscribe();
    } */

    /**
     * Remove the avatar
     *//*
    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.selectedImageForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the contact
        this.user.avatar = null;
    }*/

    /**
     * Toggle product details
     *
     * @param userId
     *//*
    showStatus(userId: string): void
    {
        // If the product is already selected...
        if ( this.selectedImage && this.selectedImage.id === userId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the product by id
        this._mediaService.getUserById(userId)
            .subscribe((user) => {
                // Set the selected product
                this.selectedImage = user;

                const teamIds = [];
                for (const teamObject of this.selectedImage.teams) {
                           teamIds.push(Number(teamObject['TeamId']));
                }

                this.selectedImage.teams = teamIds;

                // Fill the form
                this.selectedImageForm.patchValue(user);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    } */

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedImage = null;
    }

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void
    {
        // Get the image count and current image index
        const count = this.selectedImageForm.get('images').value.length;
        const currentIndex = this.selectedImageForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if ( forward )
        {
            this.selectedImageForm.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else
        {
            this.selectedImageForm.get('currentImageIndex').setValue(prevIndex);
        }
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }

    selectedFile: any = null;

    onFileSelected(event: any): void {
        this.selectedFile = event.target.files[0] ?? null;

    }

    /**
     * Filter teams
     *
     * @param event
     */
    filterTeams(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTeams = this.teams.filter(team => team.name.toLowerCase().includes(value));
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void
    {
        // Return if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }


        // If there is a tag...
  //      const team = this.filteredTeams[0];
    //    const isTagApplied = this.selectedImage.teams.find(id => id === team.id);

        // If the found tag is already applied to the product...
      /*  if ( isTagApplied )
        {
            // Remove the tag from the product
            this.removeTeamFromUser(team);
        }
        else
        {
            // Otherwise add the tag to the product
            this.addTeamToUser(team);
        } */
    }


    /**
     * Toggle product tag
     *
     * @param team
     * @param change
     */
    toggleUserTeam(team: Team, change: MatCheckboxChange): void
    {
        if ( change.checked )
        {
       //     this.addTeamToUser(team);
        }
        else
        {
         //   this.removeTeamFromUser(team);
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean
    {
        return !!!(inputValue === '' || this.teams.findIndex(team => team.name.toLowerCase() === inputValue.toLowerCase()) > -1);
    }

    /**
     * Create product
     *//*
    createUser(): void
    {
        // Create the product
        this._mediaService.createUser().subscribe((newUser) => {

            // Go to new product
            this.selectedImage = newUser;

            // Fill the form
            this.selectedImageForm.patchValue(newUser);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    } */

    /**
     * Update the selected product using the form data
     */
    AddMedia(): void
    {
        // Get the product object
        const user = this.selectedImageForm.getRawValue();
   //     console.log('user');
     //   console.log(user);
        // Remove the currentImageIndex field
     //   delete user.currentImageIndex;


     //   console.log('update file');
       // console.log(this.avatar);
        // Update the product on the server
        const avatar = this.avatar || null;
        this._mediaService.AddMedia(user.id, user, avatar).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        });
    }

    /**
     * Delete the selected product using the form data
     *//*
    deleteSelectedUser(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete product',
            message: 'Are you sure you want to remove this product? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {

                // Get the product object
                const product = this.selectedImageForm.getRawValue();

                // Delete the product on the server
                this._mediaService.deleteUser(product.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
        });
    } */

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void
    {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
