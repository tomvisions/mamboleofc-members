import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'media',
    templateUrl    : './media.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
