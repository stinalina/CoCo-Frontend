import { Component, OnInit } from '@angular/core';

type Theme = 'caramellatte' | 'dark';

@Component({
  selector: 'reme-theme-toggle',
  imports: [ ],
  templateUrl: './theme-toggle.component.html'
})
export class ThemeToggleComponent implements OnInit {

  public ngOnInit(): void {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'caramellatte';
    this.setTheme(savedTheme);
  }

  onThemeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const theme: Theme = input.checked ? 'dark' : 'caramellatte';
    this.setTheme(theme);
    localStorage.setItem('theme', theme);
  }

  private setTheme(theme: Theme): void {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', theme);
  }
}
