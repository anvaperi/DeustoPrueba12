import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categories: string[] = [
    'Nueva Categoría',
    'Alcoholic beverage',
    'Hot drink',
    'Cold drink',
    'Bakery',
    'Fast food',
    'Snack'
  ];

  getCategories(): string[] {
    return this.categories;
  }

  addCategory(newCategory: string) {
    this.categories.push(newCategory);
  }

  removeCategory(oldCategory: string) {
    if (oldCategory === 'Nueva Categoría') { return; }
    const categoryIndex = this.categories.findIndex(
      (category) => category === oldCategory
    );
    if (categoryIndex == -1) {
      console.error(`The category ${oldCategory} is already missing.`);
      return;
    }
    this.categories.splice(categoryIndex, 1);
  }
}
