import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { CareerComponent } from './components/career/career.component';
import { PortfolioSectionComponent } from './components/portfolio-section/portfolio-section.component';
import { TechStripComponent } from './components/tech-strip/tech-strip.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    TechStripComponent,
    AboutComponent,
    CareerComponent,
    PortfolioSectionComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
