import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'game',
    templateUrl    : './game.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
