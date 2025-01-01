import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './_guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    }, {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'expenses',
        loadChildren: () => import('./expenses/expenses-routing.module'),
        canActivate: [authGuard]
    },
    {
        path: 'savings',
        loadChildren: () => import('./savings/savings-routing.module'),
        canActivate: [authGuard]
    }
];
