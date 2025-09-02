import { Component, OnInit } from '@angular/core';
import { ArticlesService } from '../articles.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table implements OnInit {
  selectAll: Boolean = false;
  articles: Array<any> = [];
  properties: Array<string> = [];
  propertyNames: Array<string> = [];

  constructor(private articlesService: ArticlesService) {}

  ngOnInit(): void {
    this.articles = this.articlesService.getArticles();
    this.properties = this.articlesService.getArticleProperties();
    this.propertyNames = this.articlesService.getArticlePropertyNames();
  }

  getStock() {
    let totalStock: number = 0;
    this.articles.forEach(article => totalStock += article.stock);
    return totalStock;
  }

  updateArticles(event: { id: number; property: string; value: any }): void {
    this.articlesService.setArticleProperty(event.id, event.property, event.value);
  }


}
