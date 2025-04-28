import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SearchResultsComponent } from './search-results/search-results.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'search', component: SearchResultsComponent },
];
