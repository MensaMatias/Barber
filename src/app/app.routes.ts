import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Register } from './register/register';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: Home,
    },
    {
        path: 'about',
        component: About,
    },
    {
        path: 'register',
        component: Register,
    }
];
