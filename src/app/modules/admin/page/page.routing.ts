import {Route} from '@angular/router';
import {InfoComponent} from 'app/modules/admin/page/info/info.component';
import {PageResolver} from 'app/modules/admin/page/page.resolvers';

export const pageRoutes: Route[] = [
    {
        path: '',
        component: InfoComponent,
        resolve: {
            page: PageResolver,
        }
    }

];
