import { Routes } from '@angular/router';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [authGuard] }
];


// const routes: Routes = [
//   { path: 'store', component: StoreComponent, canActivate: [authGuard] },
// ];
