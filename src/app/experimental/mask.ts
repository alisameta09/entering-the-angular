import {maskitoDateOptionsGenerator} from '@maskito/kit';

export const dateMaskOptions= maskitoDateOptionsGenerator({
  mode: 'dd/mm/yyyy',
  min: new Date(),
  max: new Date(2026, 12, 31),
});
