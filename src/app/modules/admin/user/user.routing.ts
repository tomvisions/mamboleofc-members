import {Route} from '@angular/router';
import {UserComponent} from 'app/modules/admin/user/user.component';
import {InfoComponent} from 'app/modules/admin/user/info/info.component';
import {UsersResolver} from 'app/modules/admin/user/user.resolvers';
import {TeamsResolver} from 'app/modules/admin/team/team.resolvers';

export const userRoutes: Route[] = [

    {
        path: '',
        component: InfoComponent,
        resolve: {
            users: UsersResolver,
            teams: TeamsResolver,
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
    }
];
