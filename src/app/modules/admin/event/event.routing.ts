import {Route} from '@angular/router';
import {InfoComponent} from 'app/modules/admin/event/info/info.component';
import {EventResolver} from 'app/modules/admin/event/event.resolvers';

export const eventRoutes: Route[] = [
    {
        path: '',
        component: InfoComponent,
        resolve: {
            event: EventResolver,
        }
    }

];
