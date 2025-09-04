import { Routes } from '@angular/router';
import { Form } from './form/form';
import { Table } from './table/table';

export const routes: Routes = [
  { path: '', redirectTo: 'table', pathMatch: 'full' },
  { path: 'form', component: Form },
  { path: 'form/:id', component: Form },
  { path: 'table', component: Table },
  { path: '**', component: Form },
];
