import { maskitoDateRangeOptionsGenerator } from '@maskito/kit';
import type { MaskitoOptions } from '@maskito/core';
import { maskitoAddOnFocusPlugin, maskitoRemoveOnBlurPlugin } from '@maskito/kit';
import { maskitoPhoneOptionsGenerator } from '@maskito/phone';
import { getCountryCallingCode } from 'libphonenumber-js/core';
import metadata from 'libphonenumber-js/min/metadata';

const countryIsoCode = 'RU';
const code = getCountryCallingCode(countryIsoCode, metadata);
const prefix = `+${code} `;

const phoneOptions = maskitoPhoneOptionsGenerator({
  metadata,
  countryIsoCode,
  strict: true,
});

export const phoneMaskOptions = {
  ...phoneOptions,
  plugins: [
    ...phoneOptions.plugins,
    maskitoAddOnFocusPlugin(prefix),
    maskitoRemoveOnBlurPlugin(prefix),
  ],
} satisfies MaskitoOptions;

export const dateMaskOptions = maskitoDateRangeOptionsGenerator({
  mode: 'dd/mm/yyyy',
  minLength: { day: 2 },
  maxLength: { month: 1 },
  min: new Date(),
  max: new Date(2026, 12, 31),
});
