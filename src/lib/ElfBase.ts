/**
 * Represents the bit size version of the ELF architecture.
 *
 * @type {32 | 64} 32 for 32-bit architecture, 64 for 64-bit architecture.
 */
export type ElfBitVersion = undefined | 32 | 64;

/**
 * Type for defining the endianness of the ELF data.
 *
 * @type {undefined | true | false} undefined for unknown, true for LSB, false for MSB.
 */
export type ElfEndianness = undefined | true | false;

/**
 * Type for defining the machine ISA-architecture the ELF binary is compiled for
 *
 * @type {undefined | string} undefined for unknown, string according to e_machine
 */
export type ElfArchitecture = undefined | string;

/**
 * Map for ELF 32-bit data types sizes in bytes.
 */
export const Elf32Types = {
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
export const Elf64Types = {
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
 * Type for representing a single ELF data entry.
 */
export type ElfData = {
  name: string;
  value: number | string | object;
  raw_dec: number;
  size: number; // in bytes
  offset: number; // from file beginning
};

/**
 * Interface representing an entire ELF file.
 */
export interface ElfFile {
  elfHeader: ElfHeaderInterface;
  elfProgramHeader: ElfProgramHeaderInterface;
  elfSectionHeader: ElfSectionHeaderInterface;
  elfDynamic: ElfDynamicInterface;
  elfSymbolTable : ElfSymbolTableInterface;
  elfDynamicSymbolTable : ElfSymbolTableInterface;
  elfRelocation : ElfRelocationInterface;
}

/**
 * Interface representing the entries in the ELF Identification header (e_ident).
 */
export interface EIdentEntry {
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
export interface ElfHeaderInterface {
  e_ident: EIdentEntry;
  e_entries: ElfHeaderRestInterface;
}

export interface ElfHeaderRestInterface {
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
 * Interface for the ELF programme header structure.
 */
export interface ElfProgramHeaderInterface {
  elfProgramHeader: ElfProgramHeaderEntry[];
}

export interface ElfProgramHeaderEntry {
  p_type: ElfData;
  p_flags: ElfData;
  p_offset: ElfData;
  p_vaddr: ElfData;
  p_paddr: ElfData;
  p_filesz: ElfData;
  p_memsz: ElfData;
  p_align: ElfData;
}

/**
 * Interface for the ELF section header structure.
 */
export interface ElfSectionHeaderInterface {
  elfSectionHeader: ElfSectionHeaderEntry[];
}

export interface ElfSectionHeaderEntry {
  sh_name : ElfData;
  sh_type : ElfData;
  sh_flags : ElfData;
  sh_addr : ElfData;
  sh_offset : ElfData;
  sh_size : ElfData;
  sh_link : ElfData;
  sh_info : ElfData;
  sh_addralign : ElfData;
  sh_entsize : ElfData;
}

/**
 * Interface for the ELF dynamic structure.
 */
export interface ElfDynamicInterface {
  elfDynamic: ElfDynamicEntry[] | null;
}

export interface ElfDynamicEntry {
  d_tag : ElfData;
  d_un : ElfData;
}


/**
 * Interface for the ELF symbol table structure.
 */
export interface ElfSymbolTableInterface {
  elfSymbolTable: ElfSymbolTableEntry[] | null;
}

export interface ElfSymbolTableEntry {
  st_name : ElfData;
  st_bind : ElfData;
  st_type : ElfData;
  st_other : ElfData;
  st_shndx : ElfData;
  st_value : ElfData;
  st_size : ElfData;
}

/**
 * Interface for the ELF relocation structure.
 */
export interface ElfRelocationInterface {
  elfRelocation: ElfRelocationEntry[] | null;
}

export interface ElfRelocationEntry {
  r_offset : ElfData;
  r_info : ElfData | null; // not present in RELR
  r_type : ElfData | null; // not present in RELR
  r_sym : ElfData | null; // not present in RELR
  r_addend : ElfData | null; // not present in non-RELA

}


/**
 * Type for encoding mapping. Maps a number to a string representation.
 */
export type Encoding = {
  [key: number]: string;
};

/**
 * Abstract class serving as a base for ELF processing.
 * Handles the common functionalities across different ELF section processing types.
 */
export abstract class ElfBase {
  /**
   * The raw data view of the ELF file.
   */
  data: DataView | undefined;

  /**
   * Endianness of the ELF file data.
   */
  endianness: ElfEndianness = true; // defaults to LSB (true)

  /**
   * Bit version of the ELF file (32-bit or 64-bit).
   */
  bit: ElfBitVersion = 32; // defaults to 32 bit

  /**
   * Architecture type of this binary
   */
  architecture: ElfArchitecture = "EM_X86_64"; // defaults to x86_64

  /**
   * Constructs the ElfBase instance.
   *
   */
  constructor(endianness?: ElfEndianness, bit?: ElfBitVersion, architecture?: ElfArchitecture) {
    this.endianness = endianness;
    this.bit = bit;
    this.architecture = architecture;
  }

}
