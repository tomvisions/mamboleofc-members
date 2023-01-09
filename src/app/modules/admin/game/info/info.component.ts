import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GamePagination, InventoryTag, Game } from 'app/modules/admin/game/game.types';
import { Team } from 'app/modules/admin/team/team.types';
import { GameService } from 'app/modules/admin/game/game.service';
import { TeamService } from 'app/modules/admin/team/team.service';

@Component({
    selector       : 'game-gallery',
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
export class InfoComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    formFieldHelpers: string[] = [''];
    games$: Observable<Game[]>;
    teams$: Observable<Team[]>;
    filteredTeams: Team[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: GamePagination;
    searchInputControl: FormControl = new FormControl();
    selectedGame: Game | null = null;
    theGame: string;
    selectedGameForm: FormGroup;
    teams: Team[];
    selectedTeam: any;
    tagsEditMode: boolean = false;
    hours = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
    minutes = ['00', '30'];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _gameService: GameService,
        private _teamService: TeamService,
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
        this.selectedGameForm = this._formBuilder.group({
            id               : [''],
            name             : ['', [Validators.required]],
            team             : [''],
            location          : [''],
            hours             : [''],
            minutes           : [''],
            date              : [''],
        });

        // Get the pagination
        this._gameService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: GamePagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the products
        this.games$ = this._gameService.games$;
        console.log('the games');
        console.log(this.games$);
        // Get the Teams
        this._teamService.teams$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((teams: Team[]) => {
                // Update the teams
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
                    return this._gameService.getGames(0, 10, 'name', 'asc', query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();

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
                id          : 'name',
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
                    return this._gameService.getGames(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
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

    /**
     * Toggle product details
     *
     * @param gameId
     */
    showStatus(gameId: string): void
    {
        // If the product is already selected...
        if ( this.selectedGame && this.selectedGame.id === gameId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the game by id
        this._gameService.getGameById(gameId)
            .subscribe((game) => {

                // Set the selected product
                this.selectedGame = game;
                const choice = Number(game.team) - 1;
                // Fill the form
                this.selectedGameForm.patchValue(game);
                this.selectedTeam = this.teams[choice];
                console.log(this.selectedTeam);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedGame = null;
    }

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void
    {
        // Get the image count and current image index
        const count = this.selectedGameForm.get('images').value.length;
        const currentIndex = this.selectedGameForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if ( forward )
        {
            this.selectedGameForm.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else
        {
            this.selectedGameForm.get('currentImageIndex').setValue(prevIndex);
        }
    }

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string
    {
        return this.formFieldHelpers.join(' ');
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
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
        const team = this.filteredTeams[0];
        const isTagApplied = this.selectedGame.teams.find(id => id === team.id);

        // If the found tag is already applied to the product...
        if ( isTagApplied )
        {
            // Remove the tag from the product
            this.removeTeamFromGame(team);
        }
        else
        {
            // Otherwise add the tag to the product
            this.addTeamToGame(team);
        }
    }

    /**
     * Add tag to the product
     *
     * @param tag
     */
    addTeamToGame(tag: InventoryTag): void
    {
        // Add the tag
        this.selectedGame.teams.unshift(tag.id);

        // Update the selected product form
        this.selectedGameForm.get('tags').patchValue(this.selectedGame.teams);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the product
     *
     * @param tag
     */
    removeTeamFromGame(tag: InventoryTag): void
    {
        // Remove the tag
        this.selectedGame.teams.splice(this.selectedGame.teams.findIndex(item => item === tag.id), 1);

        // Update the selected product form
        this.selectedGameForm.get('teams').patchValue(this.selectedGame.teams);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle product tag
     *
     * @param tag
     * @param change
     */
    toggleGameTeam(tag: InventoryTag, change: MatCheckboxChange): void
    {
        if ( change.checked )
        {
            this.addTeamToGame(tag);
        }
        else
        {
            this.removeTeamFromGame(tag);
        }
    }

    /**
     * Create product
     */
    createGame(): void
    {
        // Create the product
        this._gameService.createGame().subscribe((newGame) => {
            // Go to new product
            this.selectedGame = newGame;

            // Fill the forms
            this.selectedGameForm.patchValue(newGame);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Update the selected product using the form data
     */
    updateSelectedGame(): void
    {
        // Get the product object
        const game = this.selectedGameForm.getRawValue();

        // Remove the currentImageIndex field
        delete game.currentImageIndex;

        // Update the product on the server
        this._gameService.updateGame(game.id, game).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        });
    }

    /**
     * Delete the selected product using the form data
     */
    deleteSelectedGame(): void
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
                const product = this.selectedGameForm.getRawValue();

                // Delete the product on the server
                this._gameService.deleteGame(product.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
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
