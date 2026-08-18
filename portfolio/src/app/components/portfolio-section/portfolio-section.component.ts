import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { PROFILE } from '../../data/profile.data';

@Component({
  selector: 'app-portfolio-section',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './portfolio-section.component.html',
  styleUrl: './portfolio-section.component.scss',
})
export class PortfolioSectionComponent {
  readonly profile = PROFILE;
}
