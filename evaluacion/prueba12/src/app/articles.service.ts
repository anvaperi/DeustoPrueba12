import { Injectable } from '@angular/core';

export interface Article {
		id: number;
		name: string;
		portionQuantity: number;
		portionUnit: 'g' | 'ml';
		category: string;
		stockUnits: number;
		temperature_Celsius: number;
		preparation_min: number;
		vegan_friendly: boolean;
		underage_friendly: boolean;
		celiac_friendly: boolean;
		price_euros_cents: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  articles: Article[] = [
      { id: 0, name: 'Café', portionQuantity: 60, portionUnit: 'ml', category: 'Hot drink', stockUnits: 50, temperature_Celsius: 70, preparation_min: 3, vegan_friendly: true, underage_friendly: false, celiac_friendly: true, price_euros_cents: 150 },
      { id: 1, name: 'Té', portionQuantity: 200, portionUnit: 'ml', category: 'Hot drink', stockUnits: 0, temperature_Celsius: 80, preparation_min: 3, vegan_friendly: true, underage_friendly: true, celiac_friendly: true, price_euros_cents: 150 },
      { id: 2, name: 'Chocolate', portionQuantity: 200, portionUnit: 'ml', category: 'Hot drink', stockUnits: 30, temperature_Celsius: 75, preparation_min: 4, vegan_friendly: false, underage_friendly: true, celiac_friendly: true, price_euros_cents: 200 },
      { id: 3, name: 'Zumo', portionQuantity: 250, portionUnit: 'ml', category: 'Cold drink', stockUnits: 45, temperature_Celsius: 5, preparation_min: 1, vegan_friendly: true, underage_friendly: true, celiac_friendly: true, price_euros_cents: 220 },
      { id: 4, name: 'Bollo', portionQuantity: 80, portionUnit: 'g', category: 'Bakery', stockUnits: 20, temperature_Celsius: 25, preparation_min: 0, vegan_friendly: false, underage_friendly: true, celiac_friendly: false, price_euros_cents: 180 },
      { id: 5, name: 'Sandwich', portionQuantity: 150, portionUnit: 'g', category: 'Fast food', stockUnits: 25, temperature_Celsius: 25, preparation_min: 5, vegan_friendly: false, underage_friendly: true, celiac_friendly: false, price_euros_cents: 350 },
      { id: 6, name: 'Patatas (ración)', portionQuantity: 100, portionUnit: 'g', category: 'Snack', stockUnits: 15, temperature_Celsius: 180, preparation_min: 8, vegan_friendly: true, underage_friendly: true, celiac_friendly: true, price_euros_cents: 250 },
      { id: 7, name: 'Pastel (ración)', portionQuantity: 120, portionUnit: 'g', category: 'Bakery', stockUnits: 18, temperature_Celsius: 25, preparation_min: 0, vegan_friendly: false, underage_friendly: true, celiac_friendly: false, price_euros_cents: 350 },
      { id: 8, name: 'Hamburguesa', portionQuantity: 200, portionUnit: 'g', category: 'Fast food', stockUnits: 15, temperature_Celsius: 65, preparation_min: 10, vegan_friendly: false, underage_friendly: true, celiac_friendly: false, price_euros_cents: 800 },
      { id: 9, name: 'Pizza (ración)', portionQuantity: 250, portionUnit: 'g', category: 'Fast food', stockUnits: 12, temperature_Celsius: 180, preparation_min: 12, vegan_friendly: false, underage_friendly: true, celiac_friendly: false, price_euros_cents: 200 },
      { id: 10, name: 'Agua', portionQuantity: 500, portionUnit: 'ml', category: 'Cold drink', stockUnits: 60, temperature_Celsius: 5, preparation_min: 0, vegan_friendly: true, underage_friendly: true, celiac_friendly: true, price_euros_cents: 120 },
      { id: 11, name: 'Pan', portionQuantity: 60, portionUnit: 'g', category: 'Bakery', stockUnits: 40, temperature_Celsius: 25, preparation_min: 0, vegan_friendly: true, underage_friendly: true, celiac_friendly: false, price_euros_cents: 80 },
      { id: 12, name: 'Refresco', portionQuantity: 330, portionUnit: 'ml', category: 'Cold drink', stockUnits: 50, temperature_Celsius: 5, preparation_min: 0, vegan_friendly: true, underage_friendly: true, celiac_friendly: true, price_euros_cents: 200 },
      { id: 13, name: 'Leche', portionQuantity: 200, portionUnit: 'ml', category: 'Cold drink', stockUnits: 35, temperature_Celsius: 5, preparation_min: 0, vegan_friendly: false, underage_friendly: true, celiac_friendly: true, price_euros_cents: 150 },
      { id: 14, name: 'Falafel (pieza)', portionQuantity: 60, portionUnit: 'g', category: 'Snack', stockUnits: 10, temperature_Celsius: 65, preparation_min: 7, vegan_friendly: true, underage_friendly: true, celiac_friendly: true, price_euros_cents: 150 },
      { id: 15, name: 'Bebida alcohólica', portionQuantity: 330, portionUnit: 'ml', category: 'Alcoholic beverage ', stockUnits: 25, temperature_Celsius: 5, preparation_min: 0, vegan_friendly: true, underage_friendly: false, celiac_friendly: true, price_euros_cents: 300 },
    ];
  constructor() {}

  getArticleProperties(): (keyof Article)[] {
    return this.articles.length > 0 ? Object.keys(this.articles[0]) as (keyof Article)[] : [];
  }

  getArticles(): Article[] { return this.articles; }

  addArticles(newArticles: Article[]): void { this.articles.push(...newArticles); }

  removeArticle(id: number): void {
    const index = this.articles.findIndex((such) => such.id === id);
    if (index !== -1) { this.articles.splice(index, 1); }
    else { console.error(`There is no article with id ${id}. Deletion impossible!`); }
  }

  setArticleProperty(id: number, property: string, value: any) {
    const article = this.articles.find((article) => article.id === id);

    if (!article) {
      console.error(`Article with id ${id} not found.`);
      return;
    }

    if (!(property in article)) {
      console.error(`Property ${property} does not exist on article.`);
      return;
    }

    // Optional: Type safety checks (very lightweight)
    const currentValue = article[property as keyof typeof article];
    if (typeof currentValue !== typeof value) {
      console.warn(
        `Type mismatch: property '${property}' is of type ${typeof currentValue},
        but got ${typeof value}`
      );
    }

    // Assign new value
    (article as any)[property] = value;
  }
}
