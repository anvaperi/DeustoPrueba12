import { Routes } from '@angular/router';
import { Form } from './form/form';
import { Table } from './table/table';

export const routes: Routes = [
  { path: '', redirectTo: 'form', pathMatch: 'full' },
  { path: 'form', component: Form },
  { path: 'table', component: Table },
  { path: '**', component: Form },
];
