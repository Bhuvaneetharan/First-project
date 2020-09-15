import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivateGuardGuard, DeactivateGuardGuard } from './guards'

const routes: Routes = [
  { path: '', loadChildren: () => import('./components/login-register/login-register.module').then(m => m.LoginRegisterModule)},
  { path: 'login', loadChildren: () => import('./components/login-register/login-register.module').then(m => m.LoginRegisterModule)},
  { path: 'campaigns', loadChildren: () => import('./components/campaigns/campaigns.module').then(m => m.CampaignsModule), canActivate: [ActivateGuardGuard]},
  { path: 'dashboard', loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [ActivateGuardGuard]},
  { path: 'email', loadChildren: () => import('./components/email/email.module').then(m => m.EmailModule), canActivate: [ActivateGuardGuard]},
  { path: 'marketplace', loadChildren: () => import('./components/marketplace/marketplace.module').then(m => m.MarketplaceModule), canDeactivate: [DeactivateGuardGuard]},
  { path: 'orders', loadChildren: () => import('./components/orders/orders.module').then(m => m.OrdersModule), canActivate: [ActivateGuardGuard]},
  { path: 'asinprotector', loadChildren: () => import('./components/asin-protector/asin-protector.module').then(m => m.AsinProtectorModule), canActivate: [ActivateGuardGuard]},
  { path: 'reports', loadChildren: () => import('./components/reports/reports.module').then(m => m.ReportsModule), canActivate: [ActivateGuardGuard]},
  { path: 'completeregister', loadChildren: () => import('./components/payment-with-registration/payment-with-registration.module').then(m => m.PaymentWithRegistrationModule)},
  { path: 'inventory', loadChildren: () => import('./components/products/products.module').then(m => m.ProductsModule), canActivate: [ActivateGuardGuard]},
  { path: 'profitabilitydashboard', loadChildren: () => import('./components/profitablity-dashboard/profitablity-dashboard.module').then(m => m.ProfitablityDashboardModule), canActivate: [ActivateGuardGuard]},
  { path: 'reconciliation', loadChildren: () => import('./components/payment-reconcilation/payment-reconcilation.module').then(m => m.PaymentReconcilationModule), canActivate: [ActivateGuardGuard]},
  { path: 'returns', loadChildren: () => import('./components/returns/returns.module').then(m => m.ReturnsModule),  canActivate: [ActivateGuardGuard]},
  { path: 'reviewsfeedback', loadChildren: () => import('./components/reviews-feedback/reviews-feedback.module').then(m => m.ReviewsFeedbackModule), canActivate: [ActivateGuardGuard]},
  { path: 'upgradeplan', loadChildren: () => import('./components/upgradeplan/upgradeplan.module').then(m => m.UpgradeplanModule), canDeactivate: [DeactivateGuardGuard]},
  { path: 'userprofile', loadChildren: () => import('./components/userprofile/userprofile.module').then(m => m.UserprofileModule), canDeactivate: [DeactivateGuardGuard]},
  { path: 'invoices', loadChildren: () => import('./components/invoices/invoices.module').then(m => m.InvoicesModule), canDeactivate: [DeactivateGuardGuard]},
  { path: 'terms', loadChildren: () => import('./components/conditions/conditions.module').then(m => m.ConditionsModule)},
  { path: 'changepassword', loadChildren: () => import('./components/change-password/change-password.module').then(m => m.ChangePasswordModule)},
  { path: '**', loadChildren: () => import('./components/pagenotfound/pagenotfound.module').then(m => m.PagenotfoundModule)}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
