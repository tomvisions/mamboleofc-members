import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterContentInit,  ViewChild, ViewEncapsulation } from '@angular/core';
//import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {EditorModule} from "@tinymce/tinymce-angular";
import {ImageService} from "../../../../image.service";

import {
    Page,
    PagePagination
} from 'app/modules/admin/page/page.types';
import { PageService } from 'app/modules/admin/page/page.service';
import * as _ from "lodash";

@Component({
    selector       : 'page-gallery',
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
                    grid-template-columns: 400px auto;
                }
            }
        `
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
})
export class InfoComponent implements OnInit, AfterContentInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    pages$: Observable<Page[]>;

    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: PagePagination;
  //  searchInputControl: FormControl = new FormControl();
 //   selectedProductForm: FormGroup;
    selectedPage: Page | null = null;
    pageForm: UntypedFormGroup;

  //  selectedPageForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    bannerImage;
    aboutImage;
    contentImage;
    imageError: string;
    isImageSaved: boolean = false;
    cardImageBase64: string;
    g

    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline',  'strike','link'], ['blockquote', 'code-block'],
            [{align: []}, {list: 'ordered'}, {list: 'bullet'}],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'font': [] }],
            ['clean']
        ]
    };

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _pageService: PageService,
        private _imageService: ImageService
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
        // Create the selected product form
/*        this.selectedPageForm = this._formBuilder.group({
            id               : [''],
            category         : [''],
            name             : ['', [Validators.required]],
            description      : [''],
            tags             : [[]],
            sku              : [''],
            barcode          : [''],
            brand            : [''],
            vendor           : [''],
            stock            : [''],
            reserved         : [''],
            cost             : [''],
            basePrice        : [''],
            taxPercent       : [''],
            price            : [''],
            weight           : [''],
            thumbnail        : [''],
            images           : [[]],
            currentImageIndex: [0], // Image index that is currently being viewed
            active           : [false]
        });

        // Create the selected product form
        this.pageForm = this._formBuilder.group({
            title             : [''],
            content          : [''],
            slug             : [''],
            date             : [''],
            phoneNumbers: this._formBuilder.array([]),
            image            : [''],
            about            : [''],
            aboutImage       : [''],
            bannerImage      : [''],
            contentImage      : [''],
            link             : [''],
            linkImage        : [''],
            identifier       : ['']
        });

        // Get the pagination
        this._pageService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: PagePagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the teams
        console.log('the events');
        console.log(this._pageService.pages$);
        this.pages$ = this._pageService.pages$;
        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._pageService.getPages(0, 10, 'name', 'asc', query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe(); */
    }

    /**
     * After view init
     */
    ngAfterContentInit(): void
    {
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'name',
                start       : 'asc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the team changes the sort order...
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
                    return this._pageService.getPages(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }

    }

    /**
     * Add an empty phone number field
     */
    addContentAndImage(): void
    { /*
        // Create an empty phone number form group
        const phoneNumberFormGroup = this._formBuilder.group({
            content    : ['us'],
            image:        [''],
        });

        // Add the phone number form group to the phoneNumbers form array
        (this.contactForm.get('phoneNumbers') as UntypedFormArray).push(phoneNumberFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck(); */
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

    /**
     * Toggle product details
     *
     * @param pageId
     */
    showStatus(pageId: string): void
    { /*
        // If the product is already selected...
        if ( this.selectedPage && this.selectedPage.id === pageId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the product by id
        this._pageService.getPageId(pageId)
            .subscribe((page) => {
                console.log('page');
                console.log(page);
                // Set the selected product
                this.selectedPage = page;
                console.log('current event');
                if (page.bannerImage) {
                    this.bannerImage = this._imageService.loadImage240x128(page.bannerImage);
                    console.log('the banner image');
                    console.log(this.bannerImage);
                //    this.whoWeAreImageDesktop = this._imageService.loadImage240x128('who-we-are-home-nov20.jpeg');
                }

                if (page.aboutImage) {
                    this.aboutImage = this._imageService.loadImage240x128(page.aboutImage);
                    console.log('the about image');
                    console.log(this.aboutImage);
                    //    this.whoWeAreImageDesktop = this._imageService.loadImage240x128('who-we-are-home-nov20.jpeg');
                }

                if (page.contentImage) {
                    this.contentImage = this._imageService.loadImage240x128(page.contentImage);
                    console.log('the content image');
                    console.log(this.contentImage);
                    //    this.whoWeAreImageDesktop = this._imageService.loadImage240x128('who-we-are-home-nov20.jpeg');
                }

                // Fill the form
                this.selectedPageForm.patchValue(page);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }); */
    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedPage = null;
    }

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void
    { /*
        // Get the image count and current image index
        const count = this.selectedPageForm.get('images').value.length;
        const currentIndex = this.selectedPageForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if ( forward )
        {
            this.selectedProductForm.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else
        {
            this.selectedProductForm.get('currentImageIndex').setValue(prevIndex);
        } */
    }


    fileChangeEvent(fileInput: any, field) { /*
        this.imageError = null;
        //    console.log(fileInput);
        //  console.log('fileInput');

        if (fileInput.target.files && fileInput.target.files[0]) {
            // Size Filter Bytes
            const max_size = 20971520;
            const allowed_types = ['image/png', 'image/jpeg'];
            const max_height = 15200;
            const max_width = 25600;

            if (fileInput.target.files[0].size > max_size) {
                this.imageError =
                    'Maximum size allowed is ' + max_size / 1000 + 'Mb';

                return false;
            }

            if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
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
                this.bannerImage  = reader.result;

                console.log('the form');
                console.log(this.selectedPageForm);
                console.log(JSON.parse(`{"${field}":"${reader.result}"}`));
                this.selectedPageForm.patchValue(JSON.parse(`{"${field}":"${reader.result}"}`));
                this.selectedPageForm.get(field).updateValueAndValidity();
                /*
                  if (result.replace('image/png', '')) {

                  } */
                //    document.getElementById('avatar').setAttribute('style', `background: url('${reader.result}') no-repeat;`);
                //  document.getElementById('avatar-file-input').setAttribute('value', JSON.stringify(reader.result));
          /* };

            reader.readAsDataURL(fileInput.target.files[0]);
        } */
    }


    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Create product
     */
    createPage(): void
    {/*
        // Create the product
        this._pageService.createPage().subscribe((newPage) => {

            // Go to new product
            this.selectedPage = newPage;

            // Fill the form
            this.selectedPageForm.patchValue(newPage);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }); */
    }

    /**
     * Update the selected product using the form data
     */
    updateSelectedEvent(): void
    { /*
        // Get the product object
        const event = this.selectedPageForm.getRawValue();

        // Remove the currentImageIndex field
        delete event.currentImageIndex;

        // Update the product on the server
        this._pageService.updatePage(event.identifier, event).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        }); */
    }

    /**
     * Delete the selected product using the form data
     */
    deleteSelectedProduct(): void
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
/*
            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {

                // Get the product object
                const product = this.selectedProductForm.getRawValue();

                // Delete the product on the server
                this._pageService.deletePage(product.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            } */
        });
    }

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
