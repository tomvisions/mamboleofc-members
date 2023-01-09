import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'roster',
    templateUrl    : './roster.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RosterComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
