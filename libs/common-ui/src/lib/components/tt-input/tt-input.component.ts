import {Component, input} from '@angular/core';
import {SvgIconComponent} from '@tt/common-ui';

@Component({
  selector: 'tt-input',
  imports: [
    SvgIconComponent
  ],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.css'
})
export class TtInputComponent {
  type = input<'text' | 'password'>('text');
  placeholder = input<string>();

}
