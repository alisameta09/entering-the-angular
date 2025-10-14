import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DestinationName, ReceiverType} from '../const';
import {MaskitoDirective} from '@maskito/angular';
import {dateMaskOptions} from '../mask';

@Component({
  selector: 'app-forms-experiment',
  imports: [
    ReactiveFormsModule,
    MaskitoDirective
  ],
  templateUrl: './forms-experiment.component.html',
  styleUrl: './forms-experiment.component.scss'
})
export class FormsExperimentComponent {
  DestinationName = DestinationName;
  ReceiverType = ReceiverType;
  options = dateMaskOptions;

  form = new FormGroup({
    fromCity: new FormControl<string>(''),
    destination: new FormControl<DestinationName>(DestinationName.TURKEY),
    date: new FormControl<number | null>(null),
    duration: new FormControl<number | null>(null),
    tourists: new FormControl<string>(''),
    info: new FormControl<string>(''),
    contact: new FormGroup({
      type: new FormControl<ReceiverType>(ReceiverType.PERSON),
      inn: new FormControl<number | null>(null),
      name: new FormControl<string>(''),
      lastName: new FormControl<string>(''),
      number: new FormControl<number | null>(null)
    }),
  });

  onSubmit(event: SubmitEvent) {
    console.log(this.form.value);
  }

}
