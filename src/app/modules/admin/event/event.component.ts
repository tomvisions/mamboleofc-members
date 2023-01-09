import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'team',
    templateUrl    : './event.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
