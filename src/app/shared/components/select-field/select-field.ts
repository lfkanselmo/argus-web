import { Component, input, model } from '@angular/core';

export interface SelectOption {
  value: string;
  label: string;
}

let nextId = 0;

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.html',
  styleUrl: './select-field.scss'
})
export class SelectField {
  label = input.required<string>();
  options = input.required<SelectOption[]>();
  value = model('');

  protected readonly selectId = `select-field-${nextId++}`;
}
