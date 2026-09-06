import { Component, input, model } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss'
})
export class InputField {
  label = input.required<string>();
  type = input<'text' | 'email' | 'number'>('text');
  placeholder = input('');
  value = model('');

  protected readonly inputId = `input-field-${nextId++}`;
}
