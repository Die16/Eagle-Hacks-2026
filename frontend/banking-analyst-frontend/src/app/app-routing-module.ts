import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientIntakeForm }     from './client-intake-form/client-intake-form';
import { Dashboard }            from './dashboard/dashboard';

const routes: Routes = [
  { path: '',          component: ClientIntakeForm },
  { path: 'dashboard', component: Dashboard        },
  { path: '**',        redirectTo: ''              }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}