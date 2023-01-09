import {Route} from '@angular/router';
import {GameComponent} from 'app/modules/admin/game/game.component';
import {InfoComponent} from 'app/modules/admin/game/info/info.component';
import {GamesResolver} from 'app/modules/admin/game/game.resolvers';
import {TeamsResolver} from 'app/modules/admin/team/team.resolvers';

export const gameRoutes: Route[] = [
    {
        path: '',
        component: InfoComponent,
        resolve: {
            games: GamesResolver,
            teams: TeamsResolver,
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
