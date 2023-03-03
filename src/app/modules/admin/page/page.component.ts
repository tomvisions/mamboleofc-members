import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'team',
    templateUrl    : './page.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
