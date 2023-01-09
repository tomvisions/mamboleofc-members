import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InventoryBrand, InventoryCategory, GamePagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/roster/roster.types';
import { Game } from 'app/modules/admin/game/game.types';
import { RosterService } from 'app/modules/admin/roster/roster.service';
import { GameService } from 'app/modules/admin/game/game.service';
import {Team} from "../../team/team.types";
import {Roster} from "../roster.types";
import {AuthService} from "../../../../core/auth/auth.service";
import { User } from '../../user/user.types';

@Component({
    selector       : 'roster-gallery',
    templateUrl    : './status.component.html',
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
export class StatusComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    games$: Observable<Game[]>;
    roster$: Observable<Roster>;
    roster: Roster;
    rosterId: number;
    gameId: number;
    selectedRoster: Roster | null = null;
    selectedRosterForm: FormGroup;
    selectedGame: Game | null = null;
    pagination: GamePagination;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    currentUser: User;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _gameService: GameService,
        private _rosterService: RosterService,
        private _authService: AuthService
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
        this.selectedRosterForm = this._formBuilder.group({
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


        // Get the pagination
        this._gameService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: GamePagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the teams
        console.log('the games');
        console.log(this._gameService.games$);

        this.games$ = this._gameService.games$;


//        this.roster$ = this._rosterService.roster$;

    //    this.teams$ = this._gameService.teams$;
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

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
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



        console.log('the game id');
        console.log(gameId);
        // Get the game by id
        this._rosterService.getRosterByGameId(gameId)
            .subscribe((roster) => {
                this.rosterId = 1;
                this.gameId = Number(gameId);
                console.log('the roster');
                console.log(roster);
                // Set the selected product
 //               this.selectedRoster = game;
//                console.log(game);
  //              const choice = Number(game.team) - 1;
                // Fill the form
   //             this.selectedRosterForm.patchValue(game)

//                this.selectedRoster = this.teams[choice];
                //    console.log(this.selectedTeam);

                // Mark for check
     //           this._changeDetectorRef.markForCheck();
            });

        // Get the game by id
        this._gameService.getGameById(gameId)
            .subscribe((game) => {

                // Set the selected product
                this.selectedGame = game;
                console.log(game);
                const choice = Number(game.team) - 1;
                // Fill the form
                this.selectedRosterForm.patchValue(game);
          //      this.selectedTeam = this.teams[choice];
            //    console.log(this.selectedTeam);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    updateRoster(rosterId:number, gameId:number): void
    {
        console.log('the ro');
        console.log(rosterId);
        this.currentUser = JSON.parse(this._authService.currentUser);
        this._rosterService.updateRoster(this.currentUser.id, rosterId, gameId)
    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        //this.selectedGame = null;
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
