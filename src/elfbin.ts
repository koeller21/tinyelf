import {
  ElfFile,
  ElfHeaderInterface,
  ElfProgramHeaderInterface,
  ElfSectionHeaderInterface,
  ElfDynamicInterface,
  ElfSymbolTableInterface,
  ElfRelocationInterface,
  ElfSymbolVersionInterface,
} from "./lib/ElfBase";

import { ElfHeader } from "./lib/ElfHeader";
import { ElfProgramHeader } from "./lib/ElfProgramHeader";
import { ElfSectionHeader } from "./lib/ElfSectionHeader";
import { ElfDynamic } from "./lib/ElfDynamic";
import { ElfSymbolTable } from "./lib/ElfSymbolTable";
import { ElfRelocation } from "./lib/ElfRelocation";
import { ElfSymbolVersion } from "./lib/ElfSymbolVersion";

export class ElfBin implements ElfFile {
  readonly elfHeader: ElfHeaderInterface;
  readonly elfProgramHeader: ElfProgramHeaderInterface;
  readonly elfSectionHeader: ElfSectionHeaderInterface;
  readonly elfDynamic: ElfDynamicInterface;
  readonly elfSymbolTable: ElfSymbolTableInterface;
  readonly elfDynamicSymbolTable: ElfSymbolTableInterface;
  readonly elfRelocation: ElfRelocationInterface;
  readonly elfSymbolVersion: ElfSymbolVersionInterface; 

  readonly file: ArrayBuffer;

  constructor(file: ArrayBuffer) {
    this.file = file;

    let elfFile = this.parseELF();
    this.elfHeader = elfFile.elfHeader;
    this.elfProgramHeader = elfFile.elfProgramHeader;
    this.elfSectionHeader = elfFile.elfSectionHeader;
    this.elfDynamic = elfFile.elfDynamic;
    this.elfSymbolTable = elfFile.elfSymbolTable;
    this.elfDynamicSymbolTable = elfFile.elfDynamicSymbolTable;
    this.elfRelocation = elfFile.elfRelocation;
    this.elfSymbolVersion = elfFile.elfSymbolVersion;
  }
  // async readFile(file:File) {

  //     // Check if 'file' is provided and is a valid object
  //     if (!file || typeof file !== 'object') {
  //         throw new Error('Invalid file provided.');
  //     }

  //     const arrayBuffer = await this.loadFile(file);
  //     let elf = this.parseELF(arrayBuffer);
  //     return elf;
  // }

  // private loadFile(file : File) {
  //     return new Promise((resolve) => {
  //         const reader = new FileReader();
  //         reader.readAsArrayBuffer(file);
  //         reader.onload = (event: Event) => {
  //             resolve(event.target.result);
  //         };
  //     });
  // }

  private parseELF(): ElfFile {

    let elfHeader = new ElfHeader(this.file);
    let elfProgramHeader = new ElfProgramHeader(
      this.file,
      elfHeader.endianness,
      elfHeader.bit,
      elfHeader.e_entries.e_phnum,
      elfHeader.e_entries.e_phoff,
      elfHeader.e_entries.e_phentsize,
    );

    let elfSectionHeader = new ElfSectionHeader(
      this.file,
      elfHeader.endianness,
      elfHeader.bit,
      elfHeader.e_entries.e_shnum,
      elfHeader.e_entries.e_shoff,
      elfHeader.e_entries.e_shentsize,
      elfHeader.e_entries.e_shstrndx,
    );

    let elfDynamic = new ElfDynamic(
      this.file,
      elfHeader.endianness,
      elfHeader.bit,
      elfSectionHeader
    );

    let elfSymbolTable = new ElfSymbolTable(
      this.file,
      elfHeader.endianness,
      elfHeader.bit,
      elfSectionHeader,
      "SHT_SYMTAB"
    );


    let elfDynamicSymbolTable = new ElfSymbolTable(
      this.file,
      elfHeader.endianness,
      elfHeader.bit,
      elfSectionHeader,
      "SHT_DYNSYM"
    );

    let elfRelocation = new ElfRelocation(
      this.file,
      elfHeader.endianness,
      elfHeader.bit,
      elfHeader.architecture,
      elfSectionHeader,
      "SHT_RELA",
      {"SHT_SYMTAB" : elfSymbolTable , "SHT_DYNSYM": elfDynamicSymbolTable}
    );

    let elfSymbolVersion= new ElfSymbolVersion(
      this.file,
      elfHeader.endianness,
      elfHeader.bit,
      elfSectionHeader,
      elfDynamic
    );


    let elfFile: ElfFile = {
      elfHeader: elfHeader,
      elfProgramHeader: elfProgramHeader,
      elfSectionHeader: elfSectionHeader,
      elfDynamic: elfDynamic,
      elfSymbolTable : elfSymbolTable,
      elfDynamicSymbolTable : elfDynamicSymbolTable,
      elfRelocation : elfRelocation,
      elfSymbolVersion : elfSymbolVersion,
    };

    return elfFile;

    // try {
    //     this.e_ident = this.#processEIdent();
    // } catch (error) {
    //     console.log(error);
    // }

    // // check if file is lsb or msb
    // this.is_lsb = this.e_ident.EI_DATA.value == "ELFDATA2LSB";
    // // check if file is 64 or 32 bit architecture
    // this.is_64 = this.e_ident.EI_CLASS.value == "ELFCLASS64";
    // // assign correct data types depending on bit-architecture
    // this.data_types = this.is_64 ? ElfBaseTypes[64] : ElfBaseTypes[32];

    // this.elf_contents = {};
    // this.elf_contents.e_ident = this.e_ident;
    // this.elf_contents.elf_hdr = this.#processElfHdr();

    // // check what architecture file is (just a convient shortcut, less typing)
    // this.architecture = this.elf_contents.elf_hdr.e_machine.value;

    // this.elf_contents.elf_phdr = this.#processElfPhdr();
    // this.elf_contents.elf_shdr = this.#processElfShdr();
    // this.elf_contents.elf_dyn = this.#processElfDyn();
    // this.elf_contents.elf_symtab = this.#processElfSymtab();
    // this.elf_contents.elf_dynsymtab = this.#processElfDynSymtab();
    // this.elf_contents.elf_reloc = this.#processElfRelocation();
    // [this.elf_contents.elf_version_requirements, this.elf_contents.elf_version_requirements_auxillary] = this.#processElfVersionRequirements();
    // [this.elf_contents.elf_version_definitions, this.elf_contents.elf_version_definitions_auxillary] = this.#processElfVersionDefinitions();
  }

  // #processVerneedAux64(offset_base, previous_verneedaux_entries) {

  //     let offset_entry = offset_base;

  //     // Dependency name hash value (ELF hash function).
  //     const vna_hash = {
  //         value: this.elfFile.getUint32(offset_entry, this.is_lsb),
  //         raw_dec: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(),
  //         raw_hex: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(16),
  //         size_bytes: this.data_types.Elf_Word,
  //         offset: offset_entry,
  //         name: "vna_hash"
  //     };
  //     offset_entry += this.data_types.Elf_Word;

  //     // Dependency information flag bitmask.
  //     const vna_flags = {
  //         value: this.elfFile.getUint16(offset_entry, this.is_lsb),
  //         raw_dec: this.elfFile.getUint16(offset_entry, this.is_lsb).toString(),
  //         raw_hex: this.elfFile.getUint16(offset_entry, this.is_lsb).toString(16),
  //         size_bytes: this.data_types.Elf_Half,
  //         offset: offset_entry,
  //         name: "vna_flags"
  //     };
  //     offset_entry += this.data_types.Elf_Half;

  //     // Object file version identifier used in the .gnu.version symbol version array. Bit number 15 controls whether or not the object is hidden; if this bit is set, the object cannot be used and the static linker will ignore the symbol's presence in the object.
  //     const vna_other = {
  //         value: this.elfFile.getUint16(offset_entry, this.is_lsb),
  //         raw_dec: this.elfFile.getUint16(offset_entry, this.is_lsb).toString(),
  //         raw_hex: this.elfFile.getUint16(offset_entry, this.is_lsb).toString(16),
  //         size_bytes: this.data_types.Elf_Half,
  //         offset: offset_entry,
  //         name: "vna_other"
  //     };
  //     offset_entry += this.data_types.Elf_Half;

  //     // Offset to the dependency name string in the section header, in bytes.
  //     const vna_name = {
  //         value: this.elfFile.getUint32(offset_entry, this.is_lsb),
  //         raw_dec: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(),
  //         raw_hex: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(16),
  //         size_bytes: this.data_types.Elf_Word,
  //         offset: offset_entry,
  //         name: "vna_name"
  //     };
  //     offset_entry += this.data_types.Elf_Word;

  //     // Offset to the next vernaux entry, in bytes.
  //     const vna_next = {
  //         value: this.elfFile.getUint32(offset_entry, this.is_lsb),
  //         raw_dec: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(),
  //         raw_hex: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(16),
  //         size_bytes: this.data_types.Elf_Word,
  //         offset: offset_entry,
  //         name: "vna_next"
  //     };
  //     offset_entry += this.data_types.Elf_Word;

  //     let verneedaux_entry = {
  //         vna_hash: vna_hash,
  //         vna_flags: vna_flags,
  //         vna_other: vna_other,
  //         vna_name: vna_name,
  //         vna_next: vna_next
  //     };

  //     if (Number(vna_next.raw_dec) != 0) {
  //         offset_base += Number(vna_next.raw_dec);
  //         this.#processVerneedAux(offset_base, previous_verneedaux_entries);
  //     }

  //     previous_verneedaux_entries.push(verneedaux_entry);

  //     return previous_verneedaux_entries;
  // }

  // #processElfVersionRequirements64() {
  //     /*
  //     All ELF objects may provide or depend on versioned symbols. Symbol Versioning is implemented by 3 section types: SHT_GNU_versym, SHT_GNU_verdef, and SHT_GNU_verneed.
  //     This method handels section type: SHT_GNU_verneed.
  //     The SHT_GNU_verneed symbol version section defines what 'versions' within a shared library, that's being dynamically linked to the executable, are necessary to execute the binary.
  //     For example, the dynamic section (of a dynamically linked executable, a statically linked one won't have it) might indicate that libc.so.6 is NEEDED (d_tag: DT_NEEDED).
  //     The shared library itself (libc.so.6 in this example), then defines its symbol version definitions (using a linker version script) within the SHT_GNU_verdef section.
  //     When a dynamically linked executable then uses the shared library, it can require (using the SHT_GNU_verneed section) that certain symbol definitions are present in the dynamically linked shared library.
  //     This ensures that the shared library on a system e.g. is up-to-date for a given elf executable binary.
  //     Imagine you have some old desktop PC, that hasn't been updated (more specifically: whose shared libraries haven't been updated) since 2008. You build an ELF DYN executable on your brand new laptop that has the latest shared libraries.
  //     Requiring a certain version of the symbols within a shared library ensures that when you run your ELF DYN executable on the old desktop PC you don't get ugly runtime errors when the GOT can't be updated because the symbol is missing from the shared library
  //     (in case DT_BIND_NOW isn't set).

  //     From: https://refspecs.linuxfoundation.org/LSB_3.0.0/LSB-PDA/LSB-PDA.junk/symversion.html
  //     "
  //     When loading a sharable object the system shall analyze version definition data from the loaded object to assure that it meets the version requirements of the calling object.
  //     This step is referred to as definition testing. The dynamic loader shall retrieve the entries in the caller's Elfxx_Verneed array and attempt to find matching definition information in the loaded Elfxx_Verdef table.
  //     Each object and dependency shall be tested in turn. If a symbol definition is missing and the vna_flags bit for VER_FLG_WEAK is not set, the loader shall return an error and exit.
  //     If the vna_flags bit for VER_FLG_WEAK is set in the Elfxx_Vernaux entry, and the loader shall issue a warning and continue operation.
  //     When the versions referenced by undefined symbols in the loaded object are found, version availability is certified. The test completes without error and the object shall be made available.
  //     "
  //     */

  //     let sym_version_information_sections = [];
  //     let verneed_entries = [];
  //     let verneedaux_entries = [];

  //     for (const section_header of this.elf_contents.elf_shdr) {
  //         if (section_header.sh_type.value == "SHT_GNU_verneed") {
  //             sym_version_information_sections[section_header.sh_type.value] = section_header;
  //         }
  //     }

  //     // check if SHT_GNU_verneed exists and if DT_VERNEED is set in dynamic section
  //     if ("SHT_GNU_verneed" in sym_version_information_sections && this.elf_contents.elf_dyn.some(item => item.d_tag.value === "DT_VERNEED")) {

  //         // check DT_VERNEEDNUM to figure out how many entries are there and loop through them
  //         let verneednum = 1;
  //         if (this.elf_contents.elf_dyn.some(item => item.d_tag.value === "DT_VERNEEDNUM")) {
  //             verneednum = this.elf_contents.elf_dyn.find(item => item.d_tag.value === 'DT_VERNEEDNUM').d_un.raw_dec;
  //         }

  //         // ToDo check if DT_VERNEEDNUM and sh_info of section header are the same
  //         // get offset (these are dynamic offsets, so we have to update them iteratively)
  //         let verneed_offset_base = sym_version_information_sections["SHT_GNU_verneed"].sh_offset.value;

  //         for (let verneed_entry_count = 0; verneed_entry_count < verneednum; verneed_entry_count++) {

  //             let verneed_offset = verneed_offset_base;

  //             // Version of structure. This value is currently set to 1, and will be reset if the versioning implementation is incompatibly altered.
  //             const vn_version = {
  //                 value: this.elfFile.getUint16(verneed_offset, this.is_lsb),
  //                 raw_dec: this.elfFile.getUint16(verneed_offset, this.is_lsb).toString(),
  //                 raw_hex: this.elfFile.getUint16(verneed_offset, this.is_lsb).toString(16),
  //                 size_bytes: this.data_types.Elf_Half,
  //                 offset: verneed_offset,
  //                 name: "vn_version"
  //             };
  //             verneed_offset += this.data_types.Elf_Half;

  //             // Number of associated verneed array entries.
  //             const vn_cnt = {
  //                 value: this.elfFile.getUint16(verneed_offset, this.is_lsb),
  //                 raw_dec: this.elfFile.getUint16(verneed_offset, this.is_lsb).toString(),
  //                 raw_hex: this.elfFile.getUint16(verneed_offset, this.is_lsb).toString(16),
  //                 size_bytes: this.data_types.Elf_Half,
  //                 offset: verneed_offset,
  //                 name: "vn_cnt"
  //             };
  //             verneed_offset += this.data_types.Elf_Half;

  //             // Offset to the file name string in the section header, in bytes.
  //             const vn_file = {
  //                 value: this.elfFile.getUint32(verneed_offset, this.is_lsb),
  //                 raw_dec: this.elfFile.getUint32(verneed_offset, this.is_lsb).toString(),
  //                 raw_hex: this.elfFile.getUint32(verneed_offset, this.is_lsb).toString(16),
  //                 size_bytes: this.data_types.Elf_Word,
  //                 offset: verneed_offset,
  //                 name: "vn_file"
  //             };
  //             verneed_offset += this.data_types.Elf_Word;

  //             // ToDo follow sh_link of SHT_GNU_verneed section to actually get file name
  //             // Offset to a corresponding entry in the vernaux array, in bytes.
  //             const vn_aux = {
  //                 value: this.elfFile.getUint32(verneed_offset, this.is_lsb),
  //                 raw_dec: this.elfFile.getUint32(verneed_offset, this.is_lsb).toString(),
  //                 raw_hex: this.elfFile.getUint32(verneed_offset, this.is_lsb).toString(16),
  //                 size_bytes: this.data_types.Elf_Word,
  //                 offset: verneed_offset,
  //                 name: "vn_aux"
  //             };
  //             verneed_offset += this.data_types.Elf_Word;

  //             // get verneed auxillary entries
  //             let verneed_aux_offset = verneed_offset_base + Number(vn_aux.raw_dec);
  //             verneedaux_entries = this.processVerneedAux(verneed_aux_offset, verneedaux_entries);

  //             // Offset to the next verneed entry, in bytes.
  //             const vn_next = {
  //                 value: this.elfFile.getUint32(verneed_offset, this.is_lsb),
  //                 raw_dec: this.elfFile.getUint32(verneed_offset, this.is_lsb).toString(),
  //                 raw_hex: this.elfFile.getUint32(verneed_offset, this.is_lsb).toString(16),
  //                 size_bytes: this.data_types.Elf_Word,
  //                 offset: verneed_offset,
  //                 name: "vn_next"
  //             };
  //             verneed_offset += this.data_types.Elf_Word;

  //             let verneed_entry = {
  //                 vn_version: vn_version,
  //                 vn_cnt: vn_cnt,
  //                 vn_file: vn_file,
  //                 vn_aux: vn_aux,
  //                 vn_next: vn_next
  //             };

  //             verneed_entries.push(verneed_entry);

  //             if (Number(vn_next.raw_dec) != 0) {
  //                 verneed_offset_base += Number(vn_next.raw_dec);
  //             } else {
  //                 break;
  //             }

  //         }
  //     }

  //     return [verneed_entries, verneedaux_entries];

  // }

  // #processVerdAux64(offset_base, previous_verdaux_entries) {

  //     let offset_entry = offset_base;

  //     // 	Offset to the version or dependency name string in the section header, in bytes.
  //     const vda_name = {
  //         value: this.elfFile.getUint32(offset_entry, this.is_lsb),
  //         raw_dec: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(),
  //         raw_hex: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(16),
  //         size_bytes: this.data_types.Elf_Word,
  //         offset: offset_entry,
  //         name: "vda_name"
  //     };
  //     offset_entry += this.data_types.Elf_Word;

  //     // Offset to the next vernaux entry, in bytes.
  //     const vda_next = {
  //         value: this.elfFile.getUint32(offset_entry, this.is_lsb),
  //         raw_dec: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(),
  //         raw_hex: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(16),
  //         size_bytes: this.data_types.Elf_Word,
  //         offset: offset_entry,
  //         name: "vda_next"
  //     };
  //     offset_entry += this.data_types.Elf_Word;

  //     let verdaux_entry = {
  //         vda_name: vda_name,
  //         vda_next: vda_next
  //     };

  //     if (Number(vda_next.raw_dec) != 0) {
  //         offset_base += Number(vda_next.raw_dec);
  //         this.processVerdAux(offset_base, previous_verdaux_entries);
  //     }

  //     previous_verdaux_entries.push(verdaux_entry);

  //     return previous_verdaux_entries;
  // }

  // #processElfVersionDefinitions32() {
  // }

  // #processElfVersionDefinitions64() {
  //     /*
  //     All ELF objects may provide or depend on versioned symbols. Symbol Versioning is implemented by 3 section types: SHT_GNU_versym, SHT_GNU_verdef, and SHT_GNU_verneed.
  //     This method handels section type: SHT_GNU_verdef.
  //     The SHT_GNU_verneed symbol version section defines what 'versions' within a shared library, that's being dynamically linked to the executable, are necessary to execute the binary.
  //     For example, the dynamic section (of a dynamically linked executable, a statically linked one won't have it) might indicate that libc.so.6 is NEEDED (d_tag: DT_NEEDED).
  //     The shared library itself (libc.so.6 in this example), then defines its symbol version definitions (using a linker version script) within the SHT_GNU_verdef section.
  //     When a dynamically linked executable then uses the shared library, it can require (using the SHT_GNU_verneed section) that certain symbol definitions are present in the dynamically linked shared library.
  //     This ensures that the shared library on a system e.g. is up-to-date for a given elf executable binary.
  //     Imagine you have some old desktop PC, that hasn't been updated (more specifically: whose shared libraries haven't been updated) since 2008. You build an ELF DYN executable on your brand new laptop that has the latest shared libraries.
  //     Requiring a certain version of the symbols within a shared library ensures that when you run your ELF DYN executable on the old desktop PC you don't get ugly runtime errors when the GOT can't be updated because the symbol is missing from the shared library
  //     (in case DT_BIND_NOW isn't set).

  //     From: https://refspecs.linuxfoundation.org/LSB_3.0.0/LSB-PDA/LSB-PDA.junk/symversion.html
  //     "
  //     When loading a sharable object the system shall analyze version definition data from the loaded object to assure that it meets the version requirements of the calling object.
  //     This step is referred to as definition testing. The dynamic loader shall retrieve the entries in the caller's Elfxx_Verneed array and attempt to find matching definition information in the loaded Elfxx_Verdef table.
  //     Each object and dependency shall be tested in turn. If a symbol definition is missing and the vna_flags bit for VER_FLG_WEAK is not set, the loader shall return an error and exit.
  //     If the vna_flags bit for VER_FLG_WEAK is set in the Elfxx_Vernaux entry, and the loader shall issue a warning and continue operation.
  //     When the versions referenced by undefined symbols in the loaded object are found, version availability is certified. The test completes without error and the object shall be made available.
  //     "
  //     */

  //     let sym_version_information_sections = [];
  //     let verndef_entries = [];
  //     let verdaux_entries = [];

  //     for (const section_header of this.elf_contents.elf_shdr) {
  //         if (section_header.sh_type.value == "SHT_GNU_verdef") {
  //             sym_version_information_sections[section_header.sh_type.value] = section_header;
  //         }
  //     }

  //     // check if SHT_GNU_verdef exists and if DT_VERDEF is set in dynamic section
  //     if ("SHT_GNU_verdef" in sym_version_information_sections && this.elf_contents.elf_dyn.some(item => item.d_tag.value === 'DT_VERDEF')) {

  //         // check DT_VERDEFNUM to figure out how many entries are there and loop through them
  //         let verdefnum = 1;
  //         if (this.elf_contents.elf_dyn.some(item => item.d_tag.value === "DT_VERDEFNUM")) {
  //             verdefnum = this.elf_contents.elf_dyn.find(item => item.d_tag.value === 'DT_VERDEFNUM').d_un.raw_dec;
  //         }

  //         // ToDo check if DT_VERDEFNUM and sh_info of section header are the same
  //         // get offset (these are dynamic offsets, so we have to update them iteratively)
  //         let verdef_offset_base = sym_version_information_sections["SHT_GNU_verdef"].sh_offset.value;

  //         for (let verdef_entry_count = 0; verdef_entry_count < verdefnum; verdef_entry_count++) {

  //             let verdef_offset = verdef_offset_base;

  //             // Version revision. This field shall be set to 1.
  //             const vd_version = {
  //                 value: this.elfFile.getUint16(verdef_offset, this.is_lsb),
  //                 raw_dec: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(),
  //                 raw_hex: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(16),
  //                 size_bytes: this.data_types.Elf_Half,
  //                 offset: verdef_offset,
  //                 name: "vd_version"
  //             };
  //             verdef_offset += this.data_types.Elf_Half;

  //             // Version information flag bitmask.
  //             const vd_flags = {
  //                 value: this.elfFile.getUint16(verdef_offset, this.is_lsb),
  //                 raw_dec: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(),
  //                 raw_hex: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(16),
  //                 size_bytes: this.data_types.Elf_Half,
  //                 offset: verdef_offset,
  //                 name: "vd_flags"
  //             };
  //             verdef_offset += this.data_types.Elf_Half;

  //             // Version index numeric value referencing the SHT_GNU_versym section.
  //             const vd_ndx = {
  //                 value: this.elfFile.getUint16(verdef_offset, this.is_lsb),
  //                 raw_dec: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(),
  //                 raw_hex: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(16),
  //                 size_bytes: this.data_types.Elf_Half,
  //                 offset: verdef_offset,
  //                 name: "vd_ndx"
  //             };
  //             verdef_offset += this.data_types.Elf_Half;

  //             // Number of associated verdaux array entries.
  //             const vd_cnt = {
  //                 value: this.elfFile.getUint16(verdef_offset, this.is_lsb),
  //                 raw_dec: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(),
  //                 raw_hex: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(16),
  //                 size_bytes: this.data_types.Elf_Half,
  //                 offset: verdef_offset,
  //                 name: "vd_cnt"
  //             };
  //             verdef_offset += this.data_types.Elf_Half;

  //             // Offset to the next verneed entry, in bytes.
  //             const vd_hash = {
  //                 value: this.elfFile.getUint32(verdef_offset, this.is_lsb),
  //                 raw_dec: this.elfFile.getUint32(verdef_offset, this.is_lsb).toString(),
  //                 raw_hex: this.elfFile.getUint32(verdef_offset, this.is_lsb).toString(16),
  //                 size_bytes: this.data_types.Elf_Word,
  //                 offset: verdef_offset,
  //                 name: "vd_hash"
  //             };
  //             verdef_offset += this.data_types.Elf_Word;

  //             // Offset in bytes to a corresponding entry in an array of Elfxx_Verdaux structures
  //             const vd_aux = {
  //                 value: this.elfFile.getUint32(verdef_offset, this.is_lsb),
  //                 raw_dec: this.elfFile.getUint32(verdef_offset, this.is_lsb).toString(),
  //                 raw_hex: this.elfFile.getUint32(verdef_offset, this.is_lsb).toString(16),
  //                 size_bytes: this.data_types.Elf_Word,
  //                 offset: verdef_offset,
  //                 name: "vd_aux"
  //             };
  //             verdef_offset += this.data_types.Elf_Word;

  //             // get verdef auxillary entries
  //             let verdef_aux_offset = verdef_offset_base + Number(vd_aux.raw_dec);
  //             verdaux_entries = this.processVerdAux(verdef_aux_offset, verdaux_entries);

  //             // Offset to the next verdef entry, in bytes.
  //             const vd_next = {
  //                 value: this.elfFile.getUint32(verdef_offset, this.is_lsb),
  //                 raw_dec: this.elfFile.getUint32(verdef_offset, this.is_lsb).toString(),
  //                 raw_hex: this.elfFile.getUint32(verdef_offset, this.is_lsb).toString(16),
  //                 size_bytes: this.data_types.Elf_Word,
  //                 offset: verdef_offset,
  //                 name: "vd_next"
  //             };
  //             verdef_offset += this.data_types.Elf_Word;

  //             let verdef_entry = {
  //                 vd_version: vd_version,
  //                 vd_flags: vd_flags,
  //                 vd_ndx: vd_ndx,
  //                 vd_cnt: vd_cnt,
  //                 vd_hash: vd_hash,
  //                 vd_aux: vd_aux,
  //                 vd_next: vd_next
  //             };

  //             verndef_entries.push(verdef_entry);

  //             if (Number(vd_next.raw_dec) != 0) {
  //                 verdef_offset_base += Number(vd_next.raw_dec);
  //             } else {
  //                 break;
  //             }

  //         }
  //     }

  //     return [verndef_entries, verdaux_entries];

  // }

}
