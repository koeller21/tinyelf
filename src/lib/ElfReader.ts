import {
  ElfBitVersion,
  ElfEndianness,
  Encoding,
  ElfData,
  Elf32Types,
  Elf64Types,
} from "./ElfBase";

/**
 * Offers methods to read data from the DataView based on the ELF file format (32-bit or 64-bit).
 */
export class ElfDataReader {
  /**
   * The raw data view of the ELF file.
   */
  readonly data: DataView;

  /**
   * Current offset within the DataView.
   */
  offset: number;

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

  getSetFlags(bitmask: number, flags: Encoding) {
    const setFlags = [];
    for (const currentFlag in flags) {
      const flagName = this.getFlagName(bitmask, Number(currentFlag), flags);
      if (flagName) {
        setFlags.push(flagName);
      }
    }
    return setFlags;
  }

  private getFlagName(bitmask: number, currentFlag: number, flags: Encoding) {
    return (bitmask & currentFlag) !== 0 ? flags[currentFlag] : null;
  }
}
