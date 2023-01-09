import { Route } from '@angular/router';
import { MediaComponent } from 'app/modules/admin/media/media.component';
import { GalleryComponent } from 'app/modules/admin/media/gallery/info.component';
import { ImageComponent } from 'app/modules/admin/media/image/info.component';
import { MediaResolver } from 'app/modules/admin/media/media.resolvers';

export const mediaRoutes: Route[] = [
    {
        path: '',
        component: GalleryComponent,
        resolve: {
            //        users  : MediaResolver,
        }
    },
    {
        path: 'image',
        component: ImageComponent,
        resolve: {
            //        users  : MediaResolver,
        }
    }
];
