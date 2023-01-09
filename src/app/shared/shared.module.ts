import { NgModule , OnInit, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {environment} from "../../environments/environment";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class SharedModule implements OnInit
{
    private _apiLocation: string;

    constructor() {
        if (environment.node_env === 'dev') {
            this._apiLocation = 'http://127.0.0.1:3000'
        } else if (environment.node_env === 'stage') {
            this._apiLocation = 'https://api-stage.mamboleofc.ca'
        } else {
            this._apiLocation = 'https://api.mamboleofc.ca';
        }
    }

    /**
     * On init
     */
    ngOnInit(): void
    {

    }

    get apiLocation() {
        return this._apiLocation;
    }

}
