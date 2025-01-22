import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';

@Component({
    selector: 'app-expenses-home',
    imports: [MatButtonModule, RouterModule],
    templateUrl: './expenses-home.component.html',
    styleUrl: './expenses-home.component.css',
})
export class ExpensesHomeComponent {}
