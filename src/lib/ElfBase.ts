// Exports from the module
export {
  ElfFile,
  EIdentEntries,
  ElfHeaderInterface,
  ElfData,
  ElfBase,
  Elf32Types,
  Elf64Types,
  ElfBitVersion,
  ElfEndianness,
  ElfDataReader,
};

/**
 * Represents the bit size version of the ELF architecture.
 *
 * @type {32 | 64} 32 for 32-bit architecture, 64 for 64-bit architecture.
 */
type ElfBitVersion = 32 | 64;

/**
 * Type for defining the endianness of the ELF data.
 *
 * @type {undefined | true | false} undefined for unknown, true for LSB, false for MSB.
 */
type ElfEndianness = undefined | true | false;

/**
 * Map for ELF 32-bit data types sizes in bytes.
 */
const Elf32Types = {
  char: 1,
  Elf_Half: 2,
  Elf_Addr: 4,
  Elf_Off: 4,
  Elf_Sword: 4,
  Elf_Word: 4,
};

/**
 * Map for ELF 64-bit data types sizes in bytes.
 */
const Elf64Types = {
  char: 1,
  Elf_Half: 2,
  Elf_SHalf: 2,
  Elf_Sword: 4,
  Elf_Word: 4,
  Elf_Off: 8,
  Elf_Addr: 8,
  Elf_Xword: 8,
  Elf_Sxword: 8,
};

/**
 * Interface for representing a single ELF data entry.
 */
type ElfData = {
  name: string;
  value: number | string | object;
  raw_dec: number;
  size: number; // in bytes
  offset: number; // from file beginning
};

/**
 * Interface representing an entire ELF file.
 */
interface ElfFile {
  elfHeader: ElfHeaderInterface;
}

/**
 * Interface representing the entries in the ELF Identification header (e_ident).
 */
interface EIdentEntries {
  EI_MAG0: ElfData;
  EI_MAG1: ElfData;
  EI_MAG2: ElfData;
  EI_MAG3: ElfData;
  EI_CLASS: ElfData;
  EI_DATA: ElfData;
  EI_VERSION: ElfData;
  EI_OSABI: ElfData;
  EI_ABIVERSION: ElfData;
  EI_PAD: ElfData;
  EI_NIDENT: ElfData;
}

/**
 * Interface for the ELF header structure.
 */
interface ElfHeaderInterface {
  e_ident: EIdentEntries;
  e_type: ElfData;
  e_machine: ElfData;
  e_version: ElfData;
  e_entry: ElfData;
  e_phoff: ElfData;
  e_shoff: ElfData;
  e_flags: ElfData;
  e_ehsize: ElfData;
  e_phentsize: ElfData;
  e_phnum: ElfData;
  e_shentsize: ElfData;
  e_shnum: ElfData;
  e_shstrndx: ElfData;
}

/**
 * Type for encoding mapping. Maps a number to a string representation.
 */
type Encoding = {
  [key: number]: string;
};

/**
 * Abstract class serving as a base for ELF processing.
 * Handles the common functionalities across different ELF section processing types.
 */
abstract class ElfBase {
  /**
   * The raw data view of the ELF file.
   */
  readonly data: DataView;

  /**
   * Endianness of the ELF file data.
   */
  endianness: ElfEndianness = true; // defaults to LSB (true)

  /**
   * Bit version of the ELF file (32-bit or 64-bit).
   */
  bit: ElfBitVersion = 32; // defaults to 32 bit

  /**
   * Constructs the ElfBase instance.
   *
   * @param data - The DataView instance representing the ELF file data.
   */
  constructor(data: DataView) {
    this.data = data;
  }
}

/**
 * Extends ElfBase to provide data reading functionality for ELF files.
 * Offers methods to read data from the DataView based on the ELF file format (32-bit or 64-bit).
 */
class ElfDataReader {
  /**
   * The raw data view of the ELF file.
   */
  readonly data: DataView;

  /**
   * Current offset within the DataView.
   */
  private offset: number;

  /**
   * Bit version of the ELF file (32-bit or 64-bit).
   */
  readonly bit: ElfBitVersion = 32; // defaults to 32 bit

  /**
   * Endianness of the ELF file data.
   */
  readonly endianness: ElfEndianness = true; // defaults to LSB (true)

  /**
   * Constructs an ElfDataReader instance.
   *
   * @param data - The DataView instance representing the ELF file data.
   * @param bit - Bit version of the ELF file (32-bit or 64-bit).
   * @param endianness - Endianness of the ELF file data.
   * @param offset - The initial offset from where to start reading the data.
   */
  constructor(
    data: DataView,
    bit: ElfBitVersion,
    endianness: ElfEndianness,
    offset: number,
  ) {
    this.data = data;
    this.bit = bit;
    this.endianness = endianness;
    this.offset = offset;
  }

  /**
   * Reads data from the DataView, based on the provided size and encoding.
   *
   * @param name - The name of the data being read (for reference in the returned ElfData object).
   * @param size - The size of the data to read in bytes.
   * @param encoding - Optional encoding map for translating read values to strings.
   * @returns {ElfData} An object representing the read data, including its raw and formatted values.
   */
  readData(name: string, size: number, encoding?: Encoding): ElfData {
    let value: number | string;

    // Reads raw value from the DataView based on the size
    const readValue = this.readBytes(size);
    value = encoding === undefined ? readValue : encoding[readValue];

    // Constructs the ElfData object with detailed information about the read data
    let elfData: ElfData = {
      name: name,
      value: value,
      raw_dec: +readValue.toString(), // + means casting to int (dec repr)
      size: size,
      offset: this.offset,
    };

    // Updates the offset for the next read operation
    this.offset += size;

    return elfData;
  }

  /**
   * Private helper method to read bytes from the DataView.
   * Selects the appropriate method based on the specified size and the current ELF file bit version.
   *
   * @param size - The size of the data to read in bytes.
   * @returns {number} The read value as a number.
   * @throws Will throw an error if no read method is defined for the specified size.
   */
  private readBytes(size: number): number {
    // 32 bit
    if (this.bit == 32) {
      switch (size) {
        case Elf32Types.char:
          return this.data.getUint8(this.offset);
        case Elf32Types.Elf_Half:
          return this.data.getUint16(this.offset, this.endianness);
        case Elf32Types.Elf_Word:
          return this.data.getUint32(this.offset, this.endianness);
        case Elf32Types.Elf_Addr:
          return this.data.getUint32(this.offset, this.endianness);
        case Elf32Types.Elf_Off:
          return this.data.getUint32(this.offset, this.endianness);
        case Elf32Types.Elf_Sword:
          return this.data.getInt32(this.offset, this.endianness);
        case 6: // EI_PAD extra sausage
          return (
            (this.data.getInt32(this.offset, this.endianness) << 16) |
            this.data.getInt16(
              this.offset + Elf32Types.Elf_Off,
              this.endianness,
            )
          );
        default:
          throw new Error(`No 32-bit read method for size ${size}`);
      }
    } else {
      // 64 bit
      switch (size) {
        case Elf64Types.char:
          return this.data.getUint8(this.offset);
        case Elf64Types.Elf_Half:
          return this.data.getUint16(this.offset, this.endianness);
        case Elf64Types.Elf_SHalf:
          return this.data.getInt16(this.offset, this.endianness);
        case Elf64Types.Elf_Word:
          return this.data.getUint32(this.offset, this.endianness);
        case Elf64Types.Elf_Sword:
          return this.data.getInt32(this.offset, this.endianness);
        case Elf64Types.Elf_Addr:
          return Number(this.data.getBigUint64(this.offset, this.endianness));
        case Elf64Types.Elf_Off:
          return Number(this.data.getBigUint64(this.offset, this.endianness));
        case Elf64Types.Elf_Xword:
          return Number(this.data.getBigUint64(this.offset, this.endianness));
        case Elf64Types.Elf_Sxword:
          return Number(this.data.getBigInt64(this.offset, this.endianness));
        default:
          throw new Error(`No 64-bit read method for size ${size}`);
      }
    }
  }
}
