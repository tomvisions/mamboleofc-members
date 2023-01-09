import {Route} from '@angular/router';
import {RosterComponent} from 'app/modules/admin/roster/roster.component';
import {StatusComponent} from 'app/modules/admin/roster/status/status.component';
//import { InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver } from 'app/modules/admin/roster/roster.resolvers';
import {GamesResolver} from 'app/modules/admin/game/game.resolvers';
import {UsersResolver, UserResolver} from 'app/modules/admin/user/user.resolvers';
import {TeamsResolver} from "../team/team.resolvers";

export const rosterRoutes: Route[] = [
    {
        path: '',
        component: StatusComponent,
        resolve: {
            games: GamesResolver,
            users: UsersResolver,
        }
    }
    /*children : [
        {
            path     : '',
            component: ContactsListComponent,
            resolve  : {
                tasks    : ContactsResolver,
                countries: ContactsCountriesResolver
            },
            children : [
                {
                    path         : ':id',
                    component    : ContactsDetailsComponent,
                    resolve      : {
                        task     : ContactsContactResolver,
                        countries: ContactsCountriesResolver
                    },
                    canDeactivate: [CanDeactivateContactsDetails]
                }
            ]
        }
    ]*/
];
