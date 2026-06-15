import { Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', component: PortfolioComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];

