# Formater

[![npm version](https://img.shields.io/npm/v/@le0nardomartins/formater.svg)](https://www.npmjs.com/package/@le0nardomartins/formater)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/stars/le0nardomartins/leonardomartins-formater?style=social)](https://github.com/le0nardomartins/leonardomartins-formater)

**Author:** [Leonardo Martins](https://leonardomartins.dev)  
**Repository:** [GitHub](https://github.com/le0nardomartins/leonardomartins-formater)

Automatic formatting library for input fields. Supports **76+ format types** including Brazilian, American, European, Latin American, and Asian documents, as well as dates, phone numbers, currency, time, and universal formats.

## Features

- ✅ **76+ Format Types** - Comprehensive support for documents worldwide
- ✅ **Zero Dependencies** - Lightweight and fast
- ✅ **TypeScript Support** - Full type definitions included
- ✅ **Browser Compatible** - Works in all modern browsers
- ✅ **Easy to Use** - Simple API, attach to any input element
- ✅ **Flexible** - Manual formatting or automatic input formatting

## Installation

```bash
npm install @le0nardomartins/formater
```

## Basic Usage

### Import

```javascript
import Formater from '@le0nardomartins/formater';
// or
const Formater = require('@le0nardomartins/formater');
```

### Simple Example

```javascript
// Create a formatter for CPF
const cpfFormater = new Formater({
  formatType: 'cpf',
  element: '#cpf-input' // or HTML element directly
});

// Or use the helper function
import { createFormater } from '@le0nardomartins/formater';

const formater = createFormater({
  formatType: 'cpf',
  element: document.getElementById('cpf')
});
```

### Manual Formatting

```javascript
const formater = new Formater({ formatType: 'cpf' });
const formatted = formater.format('12345678901');
// Result: "123.456.789-01"
```

## Supported Format Types

### 🇧🇷 Brazilian Documents

- **`cpf`** - CPF (000.000.000-00)
- **`rg`** - RG (00.000.000-0)
- **`cnpj`** - CNPJ (00.000.000/0000-00)
- **`cep`** - CEP (00000-000)
- **`phone-br`** - Brazilian phone ((00) 00000-0000)
- **`date-br`** or **`date-br-short`** - Brazilian date (DD/MM/YYYY)
- **`date-br-full`** - Full Brazilian date (DD de Mês de YYYY)

### 🇺🇸 American Documents

- **`ssn`** - Social Security Number (000-00-0000)
- **`phone-us`** - American phone ((000) 000-0000)
- **`date-us`** or **`date-us-short`** - American date (MM/DD/YYYY)
- **`date-us-full`** - Full American date (Month DD, YYYY)
- **`drivers-license-us`** - American driver's license

### 🇪🇺 European Documents

- **`nif-es`** - Spanish NIF (00000000-A)
- **`nif-pt`** - Portuguese NIF (000 000 000)
- **`nie-es`** - Spanish NIE (A-0000000-A)
- **`nir-fr`** - French NIR/Sécurité Sociale (1 23 45 67 890 12 34)
- **`steuer-id-de`** - German Steuer-ID (12 345 678 90)
- **`codice-fiscale-it`** - Italian Codice Fiscale (ABCDEF12G34H567I)
- **`nino-uk`** - UK National Insurance Number (AB 12 34 56 C)
- **`bsn-nl`** - Dutch BSN (1234.56.789)
- **`niss-be`** - Belgian NISS (12.34.56-789.01)
- **`avs-ch`** - Swiss AVS/AHV (756.1234.5678.90)
- **`svnr-at`** - Austrian SVNR (1234 56 78 90)
- **`personnummer-se`** - Swedish Personnummer (YYMMDD-XXXX)
- **`fodselsnummer-no`** - Norwegian Fødselsnummer (DDMMYY XXXXX)
- **`pesel-pl`** - Polish PESEL (11 digits)
- **`amka-gr`** - Greek AMKA (11 digits)
- **`passport-eu`** - European passport
- **`date-eu`** or **`date-eu-short`** - European date (DD/MM/YYYY)
- **`date-eu-full`** - Full European date (DD Month YYYY)
- **`phone-eu`** - European phone (+XX (XX) XXXX-XXXX)

### 🇲🇽 Latin American Documents

- **`curp-mx`** - Mexican CURP (18 alphanumeric characters)
- **`rfc-mx`** - Mexican RFC (ABCD123456E7)
- **`cuit-ar`** or **`cuit-cuil-ar`** - Argentine CUIT/CUIL (12-34567890-1)
- **`dni-ar`** - Argentine DNI (12.345.678)
- **`rut-cl`** - Chilean RUT (12.345.678-9)
- **`nit-co`** - Colombian NIT (123.456.789-0)
- **`cc-co`** - Colombian Cédula (12.345.678-9)
- **`dni-pe`** - Peruvian DNI (12345678)
- **`ruc-pe`** - Peruvian RUC (12345678901-1)
- **`ci-ve`** - Venezuelan CI (V-12345678-9)
- **`ci-ec`** - Ecuadorian CI (1234567890)
- **`ci-uy`** - Uruguayan CI (1.234.567-8)
- **`ci-py`** - Paraguayan CI (1234567-8)
- **`ci-bo`** - Bolivian CI (1234567-8)
- **`phone-mx`** - Mexican phone (+52 (XX) XXXX-XXXX)
- **`phone-ar`** - Argentine phone (+54 (XX) XXXX-XXXX)
- **`phone-cl`** - Chilean phone (+56 X XXXX-XXXX)
- **`phone-co`** - Colombian phone (+57 XXX XXX-XXXX)

### 🇯🇵 Asian Documents

- **`my-number-jp`** - Japanese My Number (1234-5678-9012)
- **`id-card-cn`** - Chinese ID Card (123456 19900101 1234)
- **`aadhaar-in`** - Indian Aadhaar (1234 5678 9012)
- **`pan-in`** - Indian PAN (ABCDE1234F)
- **`phone-jp`** - Japanese phone (+81 XX-XXXX-XXXX)
- **`phone-cn`** - Chinese phone (+86 XXX XXXX XXXX)
- **`phone-in`** - Indian phone (+91 XXXX-XXX-XXX)

### 🌍 Other Countries

- **`sin-ca`** - Canadian SIN (123-456-789)
- **`tfn-au`** - Australian TFN (123 456 789)
- **`abn-au`** - Australian ABN (12 345 678 901)
- **`id-za`** - South African ID (900101 5800 08 5)
- **`snils-ru`** - Russian SNILS (123-456-789 12)
- **`tc-kimlik-tr`** - Turkish TC Kimlik No (12345678901)
- **`teudat-zehut-il`** - Israeli Teudat Zehut (123456789)
- **`phone-ca`** - Canadian phone (+1 (XXX) XXX-XXXX)
- **`phone-au`** - Australian phone (+61 X XXXX XXXX)

### 🌐 Universal Formats

- **`credit-card`** - Credit card (1234 5678 9012 3456)
- **`iban`** - IBAN (up to 34 alphanumeric characters)
- **`swift-bic`** - SWIFT/BIC code (AAAA BB CC DDD)
- **`isbn-10`** - ISBN-10 (0-123-45678-9)
- **`isbn-13`** - ISBN-13 (978-0-123-45678-9)
- **`uuid`** - UUID (550e8400-e29b-41d4-a716-446655440000)
- **`mac-address`** - MAC Address (AA:BB:CC:DD:EE:FF)
- **`ipv4`** - IPv4 address (192.168.1.1)
- **`ipv6`** - IPv6 address (2001:0db8:85a3:0000:0000:8a2e:0370:7334)
- **`ean-13`** - EAN-13 barcode (13 digits)
- **`upc-a`** - UPC-A barcode (12 digits)

### 💰 Currency Formats

- **`currency-br`** - Brazilian currency (R$ 1.234,56)
- **`currency-us`** - US currency ($1,234.56)
- **`currency-eu`** - European currency (€1.234,56)

### ⏰ Time Formats

- **`time-24h`** - 24-hour time format (HH:MM:SS)
- **`time-12h`** - 12-hour time format (HH:MM AM/PM)

## Complete Examples

### CPF

```html
<input type="text" id="cpf" placeholder="000.000.000-00">
```

```javascript
new Formater({
  formatType: 'cpf',
  element: '#cpf'
});
```

### CNPJ

```javascript
new Formater({
  formatType: 'cnpj',
  element: document.getElementById('cnpj')
});
```

### Full Brazilian Date

```javascript
new Formater({
  formatType: 'date-br-full',
  element: '#birth-date',
  onFormat: (value) => {
    console.log('Formatted date:', value);
    // Example: "15 de Janeiro de 2024"
  }
});
```

### SSN (USA)

```javascript
new Formater({
  formatType: 'ssn',
  element: '#ssn-input'
});
```

### Portuguese NIF

```javascript
new Formater({
  formatType: 'nif-pt',
  element: '#nif-input'
});
```

### Mexican CURP

```javascript
new Formater({
  formatType: 'curp-mx',
  element: '#curp-input'
});
```

### Credit Card

```javascript
new Formater({
  formatType: 'credit-card',
  element: '#card-input'
});
```

### IBAN

```javascript
new Formater({
  formatType: 'iban',
  element: '#iban-input'
});
```

### Phone with Callback

```javascript
const phoneFormater = new Formater({
  formatType: 'phone-br',
  element: '#phone',
  onFormat: (formattedValue) => {
    // Callback executed whenever the value is formatted
    console.log('Formatted phone:', formattedValue);
    // You can perform validations or other actions here
  }
});
```

## API

### `Formater` Class

#### Constructor

```typescript
new Formater(options: FormaterOptions)
```

**Parameters:**
- `formatType` (required): Type of formatting to be applied
- `element` (optional): HTML element or CSS selector of the input
- `onFormat` (optional): Callback executed after formatting

#### Methods

##### `attach(element: HTMLInputElement | string): void`
Attaches the formatter to an input element.

```javascript
const formater = new Formater({ formatType: 'cpf' });
formater.attach('#my-input');
```

##### `detach(): void`
Removes the formatter from the element.

```javascript
formater.detach();
```

##### `format(value: string): string`
Formats a value manually without attaching to an element.

```javascript
const formater = new Formater({ formatType: 'cpf' });
const formatted = formater.format('12345678901');
// Returns: "123.456.789-01"
```

## Multiple Fields

```javascript
// Format multiple fields
const fields = [
  { id: 'cpf', type: 'cpf' },
  { id: 'rg', type: 'rg' },
  { id: 'phone', type: 'phone-br' },
  { id: 'cep', type: 'cep' }
];

fields.forEach(field => {
  new Formater({
    formatType: field.type,
    element: `#${field.id}`
  });
});
```

## TypeScript

The library includes TypeScript type definitions:

```typescript
import Formater, { FormatType, FormaterOptions } from '@le0nardomartins/formater';

const formatType: FormatType = 'cpf';

const options: FormaterOptions = {
  formatType: 'cpf',
  element: '#cpf-input',
  onFormat: (value: string) => {
    console.log(value);
  }
};

const formater = new Formater(options);
```

## Getting Help

### Documentation Sources
- **Full Documentation**: This README file contains complete documentation
- **TypeScript Types**: All types are exported and available for autocomplete in IDEs
- **Examples**: See the `example.html` file in the [repository](https://github.com/le0nardomartins/leonardomartins-formater) for working examples
- **Repository**: [GitHub](https://github.com/le0nardomartins/leonardomartins-formater) - View source code, report issues, or contribute
- **NPM Package**: Visit the package page on npmjs.com for online documentation

### Common Issues

#### Element not found error
If you get `Element not found` error, make sure:
- The element exists in the DOM when you create the Formater instance
- Use `DOMContentLoaded` event or place script at the end of `<body>`

```javascript
document.addEventListener('DOMContentLoaded', () => {
  new Formater({ formatType: 'cpf', element: '#cpf' });
});
```

#### Formatting not working
- Ensure the input element is an `<input>` or `<textarea>` element
- Check browser console for errors
- Verify the `formatType` is correct (case-sensitive)

#### TypeScript errors
- Make sure you have TypeScript installed: `npm install -D typescript`
- Import types explicitly if needed:
```typescript
import Formater, { FormatType, FormaterOptions } from '@le0nardomartins/formater';
```

## Browser Support

This library works in all modern browsers that support:
- ES2020 features
- DOM APIs (querySelector, addEventListener)
- TypeScript/ES6 modules (when using bundlers)

## Support

- **Repository**: [GitHub](https://github.com/le0nardomartins/leonardomartins-formater)
- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/le0nardomartins/leonardomartins-formater/issues)
- **Questions**: Check existing issues or create a new one

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the [repository](https://github.com/le0nardomartins/leonardomartins-formater)
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Changelog

### Version 1.0.0
- Initial release
- Support for 76+ format types
- Support for Brazilian, American, European, Latin American, Asian documents
- Universal formats (credit card, IBAN, UUID, etc.)
- Currency and time formatting
- TypeScript support
- Full browser compatibility

## License

MIT

---

**Made with ❤️ for developers worldwide**

**Author:** [Leonardo Martins](https://leonardomartins.dev) - Visit my website for more projects.
