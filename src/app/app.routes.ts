import { Routes } from '@angular/router';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { authGuard } from './guards/auth.guard';
import { StoreComponent } from './pages/store/store.component';
import { RegisterComponent } from './pages/register/register.component';
import { guestGuard } from './guards/guest.guard';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { OurCoffeeComponent } from './pages/our-coffee/our-coffee.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [authGuard] },
  { path: 'store', component: StoreComponent },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'our-coffee', component: OurCoffeeComponent },
  { path: 'my-account', component: MyAccountComponent, canActivate: [authGuard] }
];

