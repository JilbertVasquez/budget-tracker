import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';

@Component({
    selector: 'app-commission-home',
    imports: [RouterModule, MatButtonModule],
    templateUrl: './commission-home.component.html',
    styleUrl: './commission-home.component.css',
})
export class CommissionHomeComponent {}
