import {Route} from '@angular/router';
import {TeamComponent} from 'app/modules/admin/team/team.component';
import {InfoComponent} from 'app/modules/admin/team/info/info.component';
import {
    TeamsResolver
} from 'app/modules/admin/team/team.resolvers';

export const teamRoutes: Route[] = [
    {
        path: '',
        component: InfoComponent,
        resolve: {
            team: TeamsResolver,
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
]
;
