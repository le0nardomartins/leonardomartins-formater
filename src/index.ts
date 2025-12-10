export type FormatType =
  // Brazil
  | 'cpf'
  | 'rg'
  | 'cnpj'
  | 'cep'
  | 'phone-br'
  | 'date-br'
  | 'date-br-short'
  | 'date-br-full'
  // USA
  | 'ssn'
  | 'phone-us'
  | 'date-us'
  | 'date-us-short'
  | 'date-us-full'
  | 'drivers-license-us'
  // Europe
  | 'nif-es' // Spain
  | 'nif-pt' // Portugal
  | 'nie-es' // Spain
  | 'nir-fr' // France
  | 'steuer-id-de' // Germany
  | 'codice-fiscale-it' // Italy
  | 'nino-uk' // United Kingdom
  | 'bsn-nl' // Netherlands
  | 'niss-be' // Belgium
  | 'avs-ch' // Switzerland
  | 'svnr-at' // Austria
  | 'personnummer-se' // Sweden
  | 'fodselsnummer-no' // Norway
  | 'pesel-pl' // Poland
  | 'amka-gr' // Greece
  | 'passport-eu'
  | 'date-eu'
  | 'date-eu-short'
  | 'date-eu-full'
  | 'phone-eu'
  // Latin America
  | 'curp-mx' // Mexico
  | 'rfc-mx' // Mexico
  | 'cuit-ar' // Argentina
  | 'cuit-cuil-ar' // Argentina
  | 'dni-ar' // Argentina
  | 'rut-cl' // Chile
  | 'nit-co' // Colombia
  | 'cc-co' // Colombia
  | 'dni-pe' // Peru
  | 'ruc-pe' // Peru
  | 'ci-ve' // Venezuela
  | 'ci-ec' // Ecuador
  | 'ci-uy' // Uruguay
  | 'ci-py' // Paraguay
  | 'ci-bo' // Bolivia
  | 'phone-mx' // Mexico
  | 'phone-ar' // Argentina
  | 'phone-cl' // Chile
  | 'phone-co' // Colombia
  // Asia
  | 'my-number-jp' // Japan
  | 'id-card-cn' // China
  | 'aadhaar-in' // India
  | 'pan-in' // India
  | 'phone-jp' // Japan
  | 'phone-cn' // China
  | 'phone-in' // India
  // Other Countries
  | 'sin-ca' // Canada
  | 'tfn-au' // Australia
  | 'abn-au' // Australia
  | 'id-za' // South Africa
  | 'phone-ca' // Canada
  | 'phone-au' // Australia
  // Universal Formats
  | 'credit-card'
  | 'iban'
  | 'swift-bic'
  | 'isbn-10'
  | 'isbn-13'
  | 'uuid'
  | 'mac-address'
  | 'ipv4'
  | 'ipv6'
  | 'ean-13'
  | 'upc-a'
  // Currency Formats
  | 'currency-br'
  | 'currency-us'
  | 'currency-eu'
  // Time Formats
  | 'time-24h'
  | 'time-12h'
  // Other Countries
  | 'snils-ru' // Russia
  | 'tc-kimlik-tr' // Turkey
  | 'teudat-zehut-il'; // Israel

export interface FormaterOptions {
  formatType: FormatType;
  element?: HTMLInputElement | string;
  onFormat?: (value: string) => void;
}

export class Formater {
  private element: HTMLInputElement | null = null;
  private formatType: FormatType;
  private onFormatCallback?: (value: string) => void;

  constructor(options: FormaterOptions) {
    this.formatType = options.formatType;
    
    if (options.element) {
      this.attach(options.element);
    }
    
    if (options.onFormat) {
      this.onFormatCallback = options.onFormat;
    }
  }

  /**
   * Attaches the formatter to an input element
   */
  attach(element: HTMLInputElement | string): void {
    if (typeof element === 'string') {
      const found = document.querySelector<HTMLInputElement>(element);
      if (!found) {
        throw new Error(`Element not found: ${element}`);
      }
      this.element = found;
    } else {
      this.element = element;
    }

    this.element.addEventListener('input', this.handleInput.bind(this));
    this.element.addEventListener('paste', this.handlePaste.bind(this));
  }

  /**
   * Removes the formatter from the element
   */
  detach(): void {
    if (this.element) {
      this.element.removeEventListener('input', this.handleInput.bind(this));
      this.element.removeEventListener('paste', this.handlePaste.bind(this));
      this.element = null;
    }
  }

  /**
   * Formats a value manually
   */
  format(value: string): string {
    const cleaned = this.cleanValue(value);
    return this.applyFormat(cleaned);
  }

  /**
   * Cleans the value by removing non-numeric characters
   */
  private cleanValue(value: string): string {
    // Check if format type requires alphanumeric characters
    const alphanumericTypes = [
      'curp-mx', 'rfc-mx', 'codice-fiscale-it', 'passport-eu', 
      'swift-bic', 'isbn-10', 'isbn-13', 'uuid', 'nino-uk',
      'nir-fr', 'steuer-id-de', 'bsn-nl', 'niss-be', 'pan-in',
      'iban', 'drivers-license-us', 'mac-address', 'ipv6',
      'ean-13', 'upc-a', 'personnummer-se', 'fodselsnummer-no',
      'pesel-pl', 'snils-ru', 'tc-kimlik-tr', 'teudat-zehut-il'
    ];
    
    // Check if format type requires special characters (like dots, colons, etc.)
    const specialCharTypes = [
      'ipv4', 'ipv6', 'mac-address', 'time-24h', 'time-12h'
    ];
    
    if (specialCharTypes.includes(this.formatType)) {
      // Keep alphanumeric and some special characters
      return value;
    }
    
    // Currency formats need special handling - keep digits only, formatting will be added
    if (['currency-br', 'currency-us', 'currency-eu'].includes(this.formatType)) {
      return value.replace(/\D/g, '');
    }
    
    if (alphanumericTypes.includes(this.formatType)) {
      // Keep alphanumeric characters and convert to uppercase
      return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    }
    
    // Default: remove non-numeric characters
    return value.replace(/\D/g, '');
  }

  /**
   * Applies formatting based on type
   */
  private applyFormat(value: string): string {
    switch (this.formatType) {
      // BRAZIL
      case 'cpf':
        return this.formatCPF(value);
      case 'rg':
        return this.formatRG(value);
      case 'cnpj':
        return this.formatCNPJ(value);
      case 'cep':
        return this.formatCEP(value);
      case 'phone-br':
        return this.formatPhoneBR(value);
      case 'date-br':
      case 'date-br-short':
        return this.formatDateBR(value);
      case 'date-br-full':
        return this.formatDateBRFull(value);
      
      // USA
      case 'ssn':
        return this.formatSSN(value);
      case 'phone-us':
        return this.formatPhoneUS(value);
      case 'date-us':
      case 'date-us-short':
        return this.formatDateUS(value);
      case 'date-us-full':
        return this.formatDateUSFull(value);
      case 'drivers-license-us':
        return this.formatDriversLicenseUS(value);
      
      // EUROPE
      case 'nif-es':
        return this.formatNIFES(value);
      case 'nif-pt':
        return this.formatNIFPT(value);
      case 'nie-es':
        return this.formatNIEES(value);
      case 'nir-fr':
        return this.formatNIRFR(value);
      case 'steuer-id-de':
        return this.formatSteuerIDDE(value);
      case 'codice-fiscale-it':
        return this.formatCodiceFiscaleIT(value);
      case 'nino-uk':
        return this.formatNINOUK(value);
      case 'bsn-nl':
        return this.formatBSNNL(value);
      case 'niss-be':
        return this.formatNISSBE(value);
      case 'avs-ch':
        return this.formatAVSCH(value);
      case 'svnr-at':
        return this.formatSVNRAT(value);
      case 'personnummer-se':
        return this.formatPersonnummerSE(value);
      case 'fodselsnummer-no':
        return this.formatFodselsnummerNO(value);
      case 'pesel-pl':
        return this.formatPESELPL(value);
      case 'amka-gr':
        return this.formatAMKAGR(value);
      case 'passport-eu':
        return this.formatPassportEU(value);
      case 'date-eu':
      case 'date-eu-short':
        return this.formatDateEU(value);
      case 'date-eu-full':
        return this.formatDateEUFull(value);
      case 'phone-eu':
        return this.formatPhoneEU(value);
      
      // LATIN AMERICA
      case 'curp-mx':
        return this.formatCURPMX(value);
      case 'rfc-mx':
        return this.formatRFCMX(value);
      case 'cuit-ar':
      case 'cuit-cuil-ar':
        return this.formatCUITAR(value);
      case 'dni-ar':
        return this.formatDNIAR(value);
      case 'rut-cl':
        return this.formatRUTCL(value);
      case 'nit-co':
        return this.formatNITCO(value);
      case 'cc-co':
        return this.formatCCCO(value);
      case 'dni-pe':
        return this.formatDNIPE(value);
      case 'ruc-pe':
        return this.formatRUCPE(value);
      case 'ci-ve':
        return this.formatCIVE(value);
      case 'ci-ec':
        return this.formatCIEC(value);
      case 'ci-uy':
        return this.formatCIUY(value);
      case 'ci-py':
        return this.formatCIPY(value);
      case 'ci-bo':
        return this.formatCIBO(value);
      case 'phone-mx':
        return this.formatPhoneMX(value);
      case 'phone-ar':
        return this.formatPhoneAR(value);
      case 'phone-cl':
        return this.formatPhoneCL(value);
      case 'phone-co':
        return this.formatPhoneCO(value);
      
      // ASIA
      case 'my-number-jp':
        return this.formatMyNumberJP(value);
      case 'id-card-cn':
        return this.formatIDCardCN(value);
      case 'aadhaar-in':
        return this.formatAadhaarIN(value);
      case 'pan-in':
        return this.formatPANIN(value);
      case 'phone-jp':
        return this.formatPhoneJP(value);
      case 'phone-cn':
        return this.formatPhoneCN(value);
      case 'phone-in':
        return this.formatPhoneIN(value);
      
      // OTHER COUNTRIES
      case 'sin-ca':
        return this.formatSINCA(value);
      case 'tfn-au':
        return this.formatTFNAU(value);
      case 'abn-au':
        return this.formatABNAU(value);
      case 'id-za':
        return this.formatIDZA(value);
      case 'phone-ca':
        return this.formatPhoneCA(value);
      case 'phone-au':
        return this.formatPhoneAU(value);
      
      // UNIVERSAL FORMATS
      case 'credit-card':
        return this.formatCreditCard(value);
      case 'iban':
        return this.formatIBAN(value);
      case 'swift-bic':
        return this.formatSWIFTBIC(value);
      case 'isbn-10':
        return this.formatISBN10(value);
      case 'isbn-13':
        return this.formatISBN13(value);
      case 'uuid':
        return this.formatUUID(value);
      case 'mac-address':
        return this.formatMACAddress(value);
      case 'ipv4':
        return this.formatIPv4(value);
      case 'ipv6':
        return this.formatIPv6(value);
      case 'ean-13':
        return this.formatEAN13(value);
      case 'upc-a':
        return this.formatUPCA(value);
      
      // CURRENCY FORMATS
      case 'currency-br':
        return this.formatCurrencyBR(value);
      case 'currency-us':
        return this.formatCurrencyUS(value);
      case 'currency-eu':
        return this.formatCurrencyEU(value);
      
      // TIME FORMATS
      case 'time-24h':
        return this.formatTime24H(value);
      case 'time-12h':
        return this.formatTime12H(value);
      
      // OTHER COUNTRIES
      case 'snils-ru':
        return this.formatSNILSRU(value);
      case 'tc-kimlik-tr':
        return this.formatTCKimlikTR(value);
      case 'teudat-zehut-il':
        return this.formatTeudatZehutIL(value);
      
      default:
        return value;
    }
  }

  /**
   * Handler for input events
   */
  private handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const formatted = this.format(target.value);
    target.value = formatted;
    
    if (this.onFormatCallback) {
      this.onFormatCallback(formatted);
    }
  }

  /**
   * Handler for paste events
   */
  private handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') || '';
    const formatted = this.format(pasted);
    
    if (this.element) {
      this.element.value = formatted;
      
      if (this.onFormatCallback) {
        this.onFormatCallback(formatted);
      }
    }
  }

  // ========== BRAZILIAN FORMATS ==========

  private formatCPF(value: string): string {
    const cleaned = value.slice(0, 11);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }

  private formatRG(value: string): string {
    const cleaned = value.slice(0, 9);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  }

  private formatCNPJ(value: string): string {
    const cleaned = value.slice(0, 14);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    if (cleaned.length <= 12) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  }

  private formatCEP(value: string): string {
    const cleaned = value.slice(0, 8);
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }

  private formatPhoneBR(value: string): string {
    const cleaned = value.slice(0, 11);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }

  private formatDateBR(value: string): string {
    const cleaned = value.slice(0, 8);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
  }

  private formatDateBRFull(value: string): string {
    const cleaned = value.slice(0, 8);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    const day = cleaned.slice(0, 2);
    const month = cleaned.slice(2, 4);
    const year = cleaned.slice(4);
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']; // Portuguese month names for Brazilian format
    const monthIndex = parseInt(month) - 1;
    if (monthIndex >= 0 && monthIndex < 12 && year.length === 4) {
      return `${day} de ${monthNames[monthIndex]} de ${year}`;
    }
    return `${day}/${month}/${year}`;
  }

  // ========== AMERICAN FORMATS ==========

  private formatSSN(value: string): string {
    const cleaned = value.slice(0, 9);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
  }

  private formatPhoneUS(value: string): string {
    const cleaned = value.slice(0, 10);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  private formatDateUS(value: string): string {
    const cleaned = value.slice(0, 8);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
  }

  private formatDateUSFull(value: string): string {
    const cleaned = value.slice(0, 8);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    const month = cleaned.slice(0, 2);
    const day = cleaned.slice(2, 4);
    const year = cleaned.slice(4);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = parseInt(month) - 1;
    if (monthIndex >= 0 && monthIndex < 12 && year.length === 4) {
      return `${monthNames[monthIndex]} ${day}, ${year}`;
    }
    return `${month}/${day}/${year}`;
  }

  private formatDriversLicenseUS(value: string): string {
    const cleaned = value.slice(0, 13);
    // Common format: 1 letter + numbers
    if (cleaned.length <= 1) return cleaned.toUpperCase();
    return `${cleaned[0].toUpperCase()}${cleaned.slice(1)}`;
  }

  // ========== EUROPEAN FORMATS ==========

  private formatNIFES(value: string): string {
    // Spanish NIF: 8 digits + 1 letter
    const cleaned = value.slice(0, 9).toUpperCase();
    if (cleaned.length <= 8) return cleaned;
    return `${cleaned.slice(0, 8)}-${cleaned.slice(8)}`;
  }

  private formatNIFPT(value: string): string {
    // Portuguese NIF: 9 digits
    const cleaned = value.slice(0, 9);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  private formatNIEES(value: string): string {
    // Spanish NIE: 1 letter + 7 digits + 1 letter
    const cleaned = value.slice(0, 9).toUpperCase();
    if (cleaned.length <= 1) return cleaned;
    if (cleaned.length <= 8) return `${cleaned[0]}-${cleaned.slice(1)}`;
    return `${cleaned[0]}-${cleaned.slice(1, 8)}-${cleaned.slice(8)}`;
  }

  private formatPassportEU(value: string): string {
    // European passport: usually 9 alphanumeric characters
    const cleaned = value.slice(0, 9).toUpperCase();
    return cleaned;
  }

  private formatDateEU(value: string): string {
    // Format DD/MM/YYYY
    const cleaned = value.slice(0, 8);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
  }

  private formatDateEUFull(value: string): string {
    const cleaned = value.slice(0, 8);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    const day = cleaned.slice(0, 2);
    const month = cleaned.slice(2, 4);
    const year = cleaned.slice(4);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = parseInt(month) - 1;
    if (monthIndex >= 0 && monthIndex < 12 && year.length === 4) {
      return `${day} ${monthNames[monthIndex]} ${year}`;
    }
    return `${day}/${month}/${year}`;
  }

  private formatPhoneEU(value: string): string {
    // Common European format: +XX (XX) XXXX-XXXX
    const cleaned = value.slice(0, 13);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `+${cleaned.slice(0, 2)} (${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4)}`;
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }

  // ========== ADDITIONAL EUROPEAN FORMATS ==========

  private formatNIRFR(value: string): string {
    // French NIR/Sécurité Sociale: 1 23 45 67 890 12 34 (13 digits)
    const cleaned = value.slice(0, 13);
    if (cleaned.length <= 1) return cleaned;
    if (cleaned.length <= 3) return `${cleaned.slice(0, 1)} ${cleaned.slice(1)}`;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
    if (cleaned.length <= 10) return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
    if (cleaned.length <= 12) return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 10)} ${cleaned.slice(10)}`;
    return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 10)} ${cleaned.slice(10, 12)} ${cleaned.slice(12)}`;
  }

  private formatSteuerIDDE(value: string): string {
    // German Steuer-ID: 12 345 678 90 (11 digits)
    const cleaned = value.slice(0, 11);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    if (cleaned.length <= 10) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
  }

  private formatCodiceFiscaleIT(value: string): string {
    // Italian Codice Fiscale: ABCDEF12G34H567I (16 alphanumeric)
    const cleaned = value.slice(0, 16).toUpperCase();
    return cleaned;
  }

  private formatNINOUK(value: string): string {
    // UK National Insurance Number: AB 12 34 56 C (format: 2 letters, 6 digits, 1 letter)
    const cleaned = value.slice(0, 9).toUpperCase();
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }

  private formatBSNNL(value: string): string {
    // Dutch BSN: 123456789 (9 digits, sometimes formatted as 1234.56.789)
    const cleaned = value.slice(0, 9);
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 4)}.${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)}.${cleaned.slice(4, 6)}.${cleaned.slice(6)}`;
  }

  private formatNISSBE(value: string): string {
    // Belgian NISS: 12.34.56-789.01 (11 digits)
    const cleaned = value.slice(0, 11);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(4)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(4, 6)}-${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(4, 6)}-${cleaned.slice(6, 9)}.${cleaned.slice(9)}`;
  }

  // ========== LATIN AMERICAN FORMATS ==========

  private formatCURPMX(value: string): string {
    // Mexican CURP: 18 alphanumeric characters (ABCDEFGHIJKLMNOPQR)
    const cleaned = value.slice(0, 18).toUpperCase();
    return cleaned;
  }

  private formatRFCMX(value: string): string {
    // Mexican RFC: 12-13 alphanumeric characters (ABCD123456E7 or ABCD123456EF7)
    const cleaned = value.slice(0, 13).toUpperCase();
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}${cleaned.slice(3)}`;
    if (cleaned.length <= 12) return `${cleaned.slice(0, 3)}${cleaned.slice(3, 9)}-${cleaned.slice(9)}`;
    return `${cleaned.slice(0, 3)}${cleaned.slice(3, 9)}-${cleaned.slice(9, 11)}${cleaned.slice(11)}`;
  }

  private formatCUITAR(value: string): string {
    // Argentine CUIT/CUIL: 12-34567890-1 (11 digits)
    const cleaned = value.slice(0, 11);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 10) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 10)}-${cleaned.slice(10)}`;
  }

  private formatDNIAR(value: string): string {
    // Argentine DNI: 12345678 (8 digits, sometimes formatted as 12.345.678)
    const cleaned = value.slice(0, 8);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
  }

  private formatRUTCL(value: string): string {
    // Chilean RUT: 12.345.678-9 (9 digits with check digit)
    const cleaned = value.slice(0, 9);
    if (cleaned.length <= 1) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 1)}.${cleaned.slice(1)}`;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 1)}.${cleaned.slice(1, 4)}.${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 1)}.${cleaned.slice(1, 4)}.${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  private formatNITCO(value: string): string {
    // Colombian NIT: 123.456.789-0 (9-10 digits)
    const cleaned = value.slice(0, 10);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }

  private formatCCCO(value: string): string {
    // Colombian Cédula: 12.345.678-9 (10 digits)
    const cleaned = value.slice(0, 10);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  }

  private formatDNIPE(value: string): string {
    // Peruvian DNI: 12345678 (8 digits)
    const cleaned = value.slice(0, 8);
    return cleaned;
  }

  private formatRUCPE(value: string): string {
    // Peruvian RUC: 12345678901 (11 digits, sometimes formatted as 12345678901-1)
    const cleaned = value.slice(0, 11);
    if (cleaned.length <= 10) return cleaned;
    return `${cleaned.slice(0, 10)}-${cleaned.slice(10)}`;
  }

  private formatPhoneMX(value: string): string {
    // Mexican phone: +52 (XX) XXXX-XXXX
    const cleaned = value.slice(0, 12);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `+52 (${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `+52 (${cleaned.slice(2, 4)}) ${cleaned.slice(4)}`;
    return `+52 (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }

  private formatPhoneAR(value: string): string {
    // Argentine phone: +54 (XX) XXXX-XXXX
    const cleaned = value.slice(0, 12);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `+54 (${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `+54 (${cleaned.slice(2, 4)}) ${cleaned.slice(4)}`;
    return `+54 (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }

  private formatPhoneCL(value: string): string {
    // Chilean phone: +56 X XXXX-XXXX
    const cleaned = value.slice(0, 11);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 3) return `+56 ${cleaned.slice(2)}`;
    if (cleaned.length <= 7) return `+56 ${cleaned.slice(2, 3)} ${cleaned.slice(3)}`;
    return `+56 ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }

  private formatPhoneCO(value: string): string {
    // Colombian phone: +57 XXX XXX-XXXX
    const cleaned = value.slice(0, 13);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `+57 ${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `+57 ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    return `+57 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  }

  // ========== ASIAN FORMATS ==========

  private formatMyNumberJP(value: string): string {
    // Japanese My Number: 1234-5678-9012 (12 digits)
    const cleaned = value.slice(0, 12);
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }

  private formatIDCardCN(value: string): string {
    // Chinese ID Card: 123456 19900101 1234 (18 digits: 6 + 8 + 4)
    const cleaned = value.slice(0, 18);
    if (cleaned.length <= 6) return cleaned;
    if (cleaned.length <= 14) return `${cleaned.slice(0, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 6)} ${cleaned.slice(6, 14)} ${cleaned.slice(14)}`;
  }

  private formatAadhaarIN(value: string): string {
    // Indian Aadhaar: 1234 5678 9012 (12 digits)
    const cleaned = value.slice(0, 12);
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
  }

  private formatPANIN(value: string): string {
    // Indian PAN: ABCDE1234F (10 alphanumeric: 5 letters + 4 digits + 1 letter)
    const cleaned = value.slice(0, 10).toUpperCase();
    return cleaned;
  }

  private formatPhoneJP(value: string): string {
    // Japanese phone: +81 XX-XXXX-XXXX
    const cleaned = value.slice(0, 12);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `+81 ${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `+81 ${cleaned.slice(2, 4)}-${cleaned.slice(4)}`;
    return `+81 ${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }

  private formatPhoneCN(value: string): string {
    // Chinese phone: +86 XXX XXXX XXXX
    const cleaned = value.slice(0, 13);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `+86 ${cleaned.slice(2)}`;
    if (cleaned.length <= 9) return `+86 ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    return `+86 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)} ${cleaned.slice(9)}`;
  }

  private formatPhoneIN(value: string): string {
    // Indian phone: +91 XXXX-XXX-XXX
    const cleaned = value.slice(0, 12);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 6) return `+91 ${cleaned.slice(2)}`;
    if (cleaned.length <= 9) return `+91 ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    return `+91 ${cleaned.slice(2, 6)}-${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }

  // ========== OTHER COUNTRIES FORMATS ==========

  private formatSINCA(value: string): string {
    // Canadian SIN: 123-456-789 (9 digits)
    const cleaned = value.slice(0, 9);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  private formatTFNAU(value: string): string {
    // Australian TFN: 123 456 789 (9 digits)
    const cleaned = value.slice(0, 9);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  private formatABNAU(value: string): string {
    // Australian ABN: 12 345 678 901 (11 digits)
    const cleaned = value.slice(0, 11);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    if (cleaned.length <= 10) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
  }

  private formatIDZA(value: string): string {
    // South African ID: 900101 5800 08 5 (13 digits: YYMMDD G SSS C)
    const cleaned = value.slice(0, 13);
    if (cleaned.length <= 6) return cleaned;
    if (cleaned.length <= 10) return `${cleaned.slice(0, 6)} ${cleaned.slice(6)}`;
    if (cleaned.length <= 12) return `${cleaned.slice(0, 6)} ${cleaned.slice(6, 10)} ${cleaned.slice(10)}`;
    return `${cleaned.slice(0, 6)} ${cleaned.slice(6, 10)} ${cleaned.slice(10, 12)} ${cleaned.slice(12)}`;
  }

  private formatPhoneCA(value: string): string {
    // Canadian phone: +1 (XXX) XXX-XXXX
    const cleaned = value.slice(0, 11);
    if (cleaned.length <= 1) return cleaned;
    if (cleaned.length <= 4) return `+1 (${cleaned.slice(1)}`;
    if (cleaned.length <= 7) return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  private formatPhoneAU(value: string): string {
    // Australian phone: +61 X XXXX XXXX
    const cleaned = value.slice(0, 11);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 3) return `+61 ${cleaned.slice(2)}`;
    if (cleaned.length <= 7) return `+61 ${cleaned.slice(2, 3)} ${cleaned.slice(3)}`;
    return `+61 ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }

  // ========== UNIVERSAL FORMATS ==========

  private formatCreditCard(value: string): string {
    // Credit card: 1234 5678 9012 3456 (16 digits)
    const cleaned = value.slice(0, 16);
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    if (cleaned.length <= 12) return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8, 12)} ${cleaned.slice(12)}`;
  }

  private formatIBAN(value: string): string {
    // IBAN: up to 34 alphanumeric characters, formatted in groups of 4
    const cleaned = value.slice(0, 34).toUpperCase();
    let formatted = '';
    for (let i = 0; i < cleaned.length; i += 4) {
      if (i > 0) formatted += ' ';
      formatted += cleaned.slice(i, i + 4);
    }
    return formatted.trim();
  }

  private formatSWIFTBIC(value: string): string {
    // SWIFT/BIC: 8-11 alphanumeric characters (AAAA BB CC DDD)
    const cleaned = value.slice(0, 11).toUpperCase();
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }

  private formatISBN10(value: string): string {
    // ISBN-10: 10 digits/characters (0-123-45678-9 or 0-123-45678-X)
    const cleaned = value.slice(0, 10).toUpperCase();
    if (cleaned.length <= 1) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 1)}-${cleaned.slice(1)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 4)}-${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 4)}-${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
  }

  private formatISBN13(value: string): string {
    // ISBN-13: 13 digits (978-0-123-45678-9)
    const cleaned = value.slice(0, 13);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 4)}-${cleaned.slice(4)}`;
    if (cleaned.length <= 12) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7, 12)}-${cleaned.slice(12)}`;
  }

  private formatUUID(value: string): string {
    // UUID: 550e8400-e29b-41d4-a716-446655440000 (36 characters: 8-4-4-4-12)
    const cleaned = value.slice(0, 32).toUpperCase();
    if (cleaned.length <= 8) return cleaned;
    if (cleaned.length <= 12) return `${cleaned.slice(0, 8)}-${cleaned.slice(8)}`;
    if (cleaned.length <= 16) return `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
    if (cleaned.length <= 20) return `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}-${cleaned.slice(16)}`;
    return `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}-${cleaned.slice(16, 20)}-${cleaned.slice(20)}`;
  }

  // ========== ADDITIONAL EUROPEAN FORMATS ==========

  private formatAVSCH(value: string): string {
    // Swiss AVS/AHV: 756.1234.5678.90 (13 digits)
    const cleaned = value.slice(0, 13);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 11) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 7)}.${cleaned.slice(7)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 7)}.${cleaned.slice(7, 11)}.${cleaned.slice(11)}`;
  }

  private formatSVNRAT(value: string): string {
    // Austrian SVNR: 1234 56 78 90 (10 digits)
    const cleaned = value.slice(0, 10);
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }

  private formatPersonnummerSE(value: string): string {
    // Swedish Personnummer: YYMMDD-XXXX or YYYYMMDD-XXXX (10 or 12 digits)
    const cleaned = value.slice(0, 12);
    if (cleaned.length <= 6) return cleaned;
    if (cleaned.length <= 10) return `${cleaned.slice(0, 6)}-${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 8)}-${cleaned.slice(8)}`;
  }

  private formatFodselsnummerNO(value: string): string {
    // Norwegian Fødselsnummer: DDMMYY XXXXX (11 digits)
    const cleaned = value.slice(0, 11);
    if (cleaned.length <= 6) return cleaned;
    return `${cleaned.slice(0, 6)} ${cleaned.slice(6)}`;
  }

  private formatPESELPL(value: string): string {
    // Polish PESEL: YYMMDDXXXXC (11 digits)
    const cleaned = value.slice(0, 11);
    return cleaned;
  }

  private formatAMKAGR(value: string): string {
    // Greek AMKA: 11 digits (sometimes formatted as groups)
    const cleaned = value.slice(0, 11);
    if (cleaned.length <= 6) return cleaned;
    return `${cleaned.slice(0, 6)} ${cleaned.slice(6)}`;
  }

  // ========== ADDITIONAL LATIN AMERICAN FORMATS ==========

  private formatCIVE(value: string): string {
    // Venezuelan CI: V-12345678-9 (9-10 digits)
    const cleaned = value.slice(0, 10);
    if (cleaned.length <= 1) return cleaned;
    if (cleaned.length <= 9) return `V-${cleaned.slice(1)}`;
    return `V-${cleaned.slice(1, 9)}-${cleaned.slice(9)}`;
  }

  private formatCIEC(value: string): string {
    // Ecuadorian CI: 1234567890 (10 digits)
    const cleaned = value.slice(0, 10);
    return cleaned;
  }

  private formatCIUY(value: string): string {
    // Uruguayan CI: 1.234.567-8 (8 digits)
    const cleaned = value.slice(0, 8);
    if (cleaned.length <= 1) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 1)}.${cleaned.slice(1)}`;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 1)}.${cleaned.slice(1, 4)}.${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 1)}.${cleaned.slice(1, 4)}.${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  private formatCIPY(value: string): string {
    // Paraguayan CI: 1234567-8 (8 digits)
    const cleaned = value.slice(0, 8);
    if (cleaned.length <= 7) return cleaned;
    return `${cleaned.slice(0, 7)}-${cleaned.slice(7)}`;
  }

  private formatCIBO(value: string): string {
    // Bolivian CI: 1234567-8 (8 digits)
    const cleaned = value.slice(0, 8);
    if (cleaned.length <= 7) return cleaned;
    return `${cleaned.slice(0, 7)}-${cleaned.slice(7)}`;
  }

  // ========== TECHNICAL FORMATS ==========

  private formatMACAddress(value: string): string {
    // MAC Address: AA:BB:CC:DD:EE:FF (12 hex characters)
    const cleaned = value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 12).toUpperCase();
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}:${cleaned.slice(4)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}:${cleaned.slice(4, 6)}:${cleaned.slice(6)}`;
    if (cleaned.length <= 10) return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}:${cleaned.slice(4, 6)}:${cleaned.slice(6, 8)}:${cleaned.slice(8)}`;
    return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}:${cleaned.slice(4, 6)}:${cleaned.slice(6, 8)}:${cleaned.slice(8, 10)}:${cleaned.slice(10)}`;
  }

  private formatIPv4(value: string): string {
    // IPv4: 192.168.1.1 (4 groups of 1-3 digits)
    const parts = value.split('.');
    const formattedParts: string[] = [];
    for (let i = 0; i < 4; i++) {
      if (parts[i]) {
        const num = parts[i].replace(/\D/g, '').slice(0, 3);
        formattedParts.push(num);
      } else if (i < parts.length - 1) {
        formattedParts.push('');
      }
    }
    return formattedParts.join('.');
  }

  private formatIPv6(value: string): string {
    // IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334 (8 groups of 4 hex characters)
    const cleaned = value.replace(/[^0-9A-Fa-f:]/g, '').toUpperCase();
    const parts = cleaned.split(':');
    let result = '';
    for (let i = 0; i < 8; i++) {
      if (i > 0) result += ':';
      if (parts[i]) {
        result += parts[i].slice(0, 4).padStart(4, '0');
      }
    }
    return result;
  }

  private formatEAN13(value: string): string {
    // EAN-13: 13 digits (1234567890123)
    const cleaned = value.replace(/\D/g, '').slice(0, 13);
    return cleaned;
  }

  private formatUPCA(value: string): string {
    // UPC-A: 12 digits (123456789012)
    const cleaned = value.replace(/\D/g, '').slice(0, 12);
    return cleaned;
  }

  // ========== CURRENCY FORMATS ==========

  private formatCurrencyBR(value: string): string {
    // Brazilian currency: R$ 1.234,56
    // Value comes already cleaned, so we need to parse it differently
    const cleaned = value.replace(/[^\d]/g, '');
    if (!cleaned) return '';
    
    // Last 2 digits are cents
    const integer = cleaned.slice(0, -2) || '0';
    const decimal = cleaned.slice(-2).padStart(2, '0');
    
    let formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${formatted},${decimal}`;
  }

  private formatCurrencyUS(value: string): string {
    // US currency: $1,234.56
    const cleaned = value.replace(/[^\d]/g, '');
    if (!cleaned) return '';
    
    // Last 2 digits are cents
    const integer = cleaned.slice(0, -2) || '0';
    const decimal = cleaned.slice(-2).padStart(2, '0');
    
    let formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `$${formatted}.${decimal}`;
  }

  private formatCurrencyEU(value: string): string {
    // European currency: €1.234,56
    const cleaned = value.replace(/[^\d]/g, '');
    if (!cleaned) return '';
    
    // Last 2 digits are cents
    const integer = cleaned.slice(0, -2) || '0';
    const decimal = cleaned.slice(-2).padStart(2, '0');
    
    let formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `€${formatted},${decimal}`;
  }

  // ========== TIME FORMATS ==========

  private formatTime24H(value: string): string {
    // 24-hour time: HH:MM:SS
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}:${cleaned.slice(4)}`;
  }

  private formatTime12H(value: string): string {
    // 12-hour time: HH:MM AM/PM
    // Extract AM/PM first, then format numbers
    const ampmMatch = value.match(/[APMapm]{1,2}/gi);
    const ampmPart = ampmMatch ? ampmMatch[0].toUpperCase() : '';
    const cleaned = value.replace(/[^\d]/g, '').slice(0, 4);
    
    if (cleaned.length <= 2) {
      return cleaned + (ampmPart ? ' ' + ampmPart : '');
    }
    const formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    return formatted + (ampmPart ? ' ' + ampmPart : '');
  }

  // ========== OTHER COUNTRIES ==========

  private formatSNILSRU(value: string): string {
    // Russian SNILS: 123-456-789 12 (11 digits)
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }

  private formatTCKimlikTR(value: string): string {
    // Turkish TC Kimlik No: 12345678901 (11 digits)
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    return cleaned;
  }

  private formatTeudatZehutIL(value: string): string {
    // Israeli Teudat Zehut: 123456789 (9 digits)
    const cleaned = value.replace(/\D/g, '').slice(0, 9);
    return cleaned;
  }
}

// Helper function export for quick use
export function createFormater(options: FormaterOptions): Formater {
  return new Formater(options);
}

// Default export
export default Formater;

