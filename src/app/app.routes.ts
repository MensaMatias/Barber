import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
import { Products } from './products/products';

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
    },
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'products',
        component: Products,
    }
];
