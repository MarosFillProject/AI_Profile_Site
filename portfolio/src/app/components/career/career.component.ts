import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { PROFILE } from '../../data/profile.data';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './career.component.html',
  styleUrl: './career.component.scss',
})
export class CareerComponent {
  readonly profile = PROFILE;
}
