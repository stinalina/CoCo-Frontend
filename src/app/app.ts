import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTER_TOKENS } from '@app/app.routes';
import { environment } from '@environments/environment';
import { FooterComponent } from '@shared/footer/footer.component';
import { ToastComponent } from '@shared/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [
    FooterComponent,
    ToastComponent,
    RouterModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild('outletContainer') outletContainer!: ElementRef;
  public readonly RouterTokens = ROUTER_TOKENS;
  public readonly version = '0.0.1';
  public readonly env = environment.production ? 'Prod Mode' : 'Dev Mode';
  public readonly showThemeToggle = !environment.production;

  scrollToOutlet() {
    setTimeout(() => {
      const element = this.outletContainer?.nativeElement;
      if (element) {
        const offset = element.offsetTop;
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    }, 150);
  }
}
