import {
  ElfFile,
  ElfHeaderInterface,
  ElfProgramHeaderInterface,
  ElfSectionHeaderInterface,
  ElfDynamicInterface,
} from "./lib/ElfBase";

import { ElfHeader } from "./lib/ElfHeader";
import { ElfProgramHeader } from "./lib/ElfProgramHeader";
import { ElfSectionHeader } from "./lib/ElfSectionHeader";
import { ElfDynamic } from "./lib/ElfDynamic";

export class TinyELF implements ElfFile {
  readonly elfHeader: ElfHeaderInterface;
  readonly elfProgramHeader: ElfProgramHeaderInterface;
  readonly elfSectionHeader: ElfSectionHeaderInterface;
  readonly elfDynamic: ElfDynamicInterface;

  readonly file: ArrayBuffer;

  constructor(file: ArrayBuffer) {
    this.file = file;

    let elfFile = this.parseELF();
    this.elfHeader = elfFile.elfHeader;
    this.elfProgramHeader = elfFile.elfProgramHeader;
    this.elfSectionHeader = elfFile.elfSectionHeader;
    this.elfDynamic = elfFile.elfDynamic;
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

    let elfFile: ElfFile = {
      elfHeader: elfHeader,
      elfProgramHeader: elfProgramHeader,
      elfSectionHeader: elfSectionHeader,
      elfDynamic: elfDynamic
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

  // #getRelocType(r_info) {
  //     /*
  //     This member specifies the relocation type to apply.
  //     We do some bit shifting and bitwise operation to get the
  //     type. Also architecture dependant.
  //     */

  //     let r_type = null;
  //     let r_type_value = null; // the actual relocation type

  //     if (this.is_64) {

  //         switch (this.architecture) {
  //             case "EM_MIPS":
  //                 r_type = r_info.value & 0xff;
  //                 break;
  //             case "EM_SPARCV9":
  //                 r_type = r_info.value & 0xff;
  //                 break;
  //             default:
  //                 r_type = r_info.value & 0xffffffff;
  //         }

  //     } else {
  //         r_type = r_info.value & 0xff;
  //     }

  //     if (r_type == null) {
  //         return null;
  //     }

  //     switch (this.architecture) {
  //         case "EM_MIPS":
  //             r_type_value = R_MIPS_TYPE[r_type];
  //             break;
  //         case "EM_SPARCV9":
  //             r_type_value = R_SPARC_TYPE[r_type];
  //             break;
  //         default:
  //             r_type_value = R_X86_64_TYPE[r_type];
  //     }

  //     const r_type_ret = {
  //         value: r_type_value,
  //         raw_dec: r_type.toString(),
  //         raw_hex: r_type.toString(16),
  //         size_bytes: null,
  //         offset: null,
  //         name: "r_type"
  //     };

  //     return r_type_ret;

  // }

  // #getRelocSymbol(r_info, symtab) {

  //     let r_sym_idx = null;
  //     let symtab_reloc_symbols = null;

  //     if (this.is_64) {
  //         r_sym_idx = r_info.value >> 32;
  //     } else {
  //         r_sym_idx = r_info.value >> 8;
  //     }

  //     // if either the index or the symtab is null, just return null
  //     if (r_sym_idx == null || symtab == null) {
  //         return null;
  //     }

  //     /*
  //         We have to differentiate between different symbol tables,
  //         Namely SHT_DYNSYM and SHT_SYMTAB.
  //         The symbol refered to by r_sym_idx is in either of those.
  //         Whether the symbol is in SHT_DYNSYM or in SHT_SYMTAB depends
  //         ultimately on the type of section of the relocation:

  //         For Relocatable Files:

  //         In the case of a relocatable object file (like your main.o), the index usually refers to the .symtab (Symbol Table).
  //         The .symtab contains both local and global symbols, and it's used by the linker to perform symbol resolution and relocation when combining relocatable object files.

  //         For Executable and Shared Libraries:

  //         For executables and shared libraries, the .dynsym (Dynamic Symbol Table) is typically used instead.
  //         This is because .dynsym is the symbol table for dynamic linking, containing only the symbols that are needed for relocation at runtime.
  //         .symtab could still exist, but it's often stripped to reduce the file size, and it's not used for dynamic linking.
  //         You'll often see sections like .rela.dyn and .rela.plt refer to indices in .dynsym.
  //     */
  //     if (symtab.sh_type.value == "SHT_DYNSYM") {
  //         symtab_reloc_symbols = this.elf_contents.elf_dynsymtab;
  //     } else if (symtab.sh_type.value == "SHT_SYMTAB") {
  //         symtab_reloc_symbols = this.elf_contents.elf_symtab;
  //     } else {
  //         // if the symtab is neither of type SHT_DYNSYM nor of type SHT_SYMTAB, just return
  //         return null;
  //     }

  //     // check that r_sym_idx is not geq than symbol table length - 1
  //     if (r_sym_idx >= symtab_reloc_symbols.length) {
  //         return null;
  //     }

  //     return symtab_reloc_symbols[r_sym_idx].st_name;

  // }

  // #processElfRelocation32() {
  // }

  // #processElfRelocation64() {
  //     /*
  //     Relocation is the process of connecting symbolic references with symbolic definitions.
  //     Relocatable files must have information that describes how to modify their section contents, thus allowing
  //     executable and shared object files to hold the right information for a process's program image.
  //     Relocation entries are these data.

  //     */

  //     // find relocation section headers in section headers
  //     // these could be either of type SHT_REL, SHT_RELA or SHT_RELR depending on the binary
  //     let relocations_section_headers = [];

  //     for (const section_header of this.elf_contents.elf_shdr) {
  //         if (section_header.sh_type.value == "SHT_REL" ||
  //             section_header.sh_type.value == "SHT_RELA" ||
  //             section_header.sh_type.value == "SHT_RELR") {
  //             relocations_section_headers.push(
  //                 {
  //                     sh_type: section_header.sh_type.value,
  //                     section_header: section_header
  //                 }
  //             );
  //         }
  //     }

  //     let relocation_entries = [];

  //     for (const reloc of relocations_section_headers) {

  //         // get number of entries in relocation section
  //         let relocation_entries_number = reloc.section_header.sh_size.value / reloc.section_header.sh_entsize.value;

  //         // we have to set the name here because the sh_type might be the same for multiple relocation section headers
  //         // but the sh_name can be different
  //         // e.g. .rela.dyn and .rela.plt might both be of sh_type SHT_RELA
  //         let relocation_entry = {
  //             sh_name: reloc.section_header.sh_name
  //         };

  //         for (let relocation_entry_count = 0; relocation_entry_count < relocation_entries_number; relocation_entry_count++) {

  //             // calculate offset
  //             let relocation_section_offset = reloc.section_header.sh_offset.value + (relocation_entry_count * reloc.section_header.sh_entsize.value);

  //             // This member gives the location at which to apply the relocation action.
  //             // For a relocatable file, the value is the byte offset from the beginning of the section to the storage unit affected by the relocation.
  //             // For an executable file or shared object, the value is the virtual address of the storage unit affected by the relocation.
  //             const r_offset = {
  //                 value: Number(this.elfFile.getBigUint64(relocation_section_offset, this.is_lsb)),
  //                 raw_dec: this.elfFile.getBigUint64(relocation_section_offset, this.is_lsb).toString(),
  //                 raw_hex: this.elfFile.getBigUint64(relocation_section_offset, this.is_lsb).toString(16),
  //                 size_bytes: this.data_types.Elf_Addr,
  //                 offset: relocation_section_offset,
  //                 name: "r_offset"
  //             };
  //             relocation_section_offset += this.data_types.Elf_Addr;

  //             relocation_entry.section_content = {
  //                 r_offset: r_offset
  //             };

  //             // SHT_RELR is a relocation entry without explicit addend or info (relative relocations only).
  //             // this means that SHT_RELR will only contain an offset.
  //             // SHT_REL and SHT_RELA will contain an info and SHT_RELA will contain an addend additionally
  //             // Therefore, r_info and r_added will only apply to these
  //             if (reloc.sh_type == "SHT_REL" || reloc.sh_type == "SHT_RELA") {

  //                 // This member gives both the symbol table index with respect to which the relocation must be made and the type of relocation to apply.
  //                 // Relocation types are processor-specific.
  //                 // When the text refers to a relocation entry's relocation type or symbol table index, it means the result of applying ELF[32|64]_R_TYPE or ELF[32|64]_R_SYM, respectively, to the entry's r_info member.
  //                 const r_info = {
  //                     value: Number(this.elfFile.getBigUint64(relocation_section_offset, this.is_lsb)),
  //                     raw_dec: this.elfFile.getBigUint64(relocation_section_offset, this.is_lsb).toString(),
  //                     raw_hex: this.elfFile.getBigUint64(relocation_section_offset, this.is_lsb).toString(16),
  //                     size_bytes: this.data_types.Elf_Addr,
  //                     offset: relocation_section_offset,
  //                     name: "r_info"
  //                 };
  //                 relocation_section_offset += this.data_types.Elf_Addr;

  //                 relocation_entry.section_content.r_info = r_info;

  //                 // get actual relocation type from r_info
  //                 relocation_entry.section_content.r_type = this.getRelocType(r_info);

  //                 // get actual symbol from r_info
  //                 // The sh_link field in the section header specifies the symbol table associated with the section.
  //                 // For example, in a .rela.text section, the sh_link field will contain the index of the symbol table to be used for that specific section.
  //                 // It's this index that decides whether to use .symtab or .dynsym.
  //                 relocation_entry.section_content.r_sym = this.getRelocSymbol(r_info, this.elf_contents.elf_shdr[reloc.section_header.sh_link.value]);

  //                 // SHT_RELA contains an addend additionally
  //                 if (reloc.sh_type == "SHT_RELA") {

  //                     // This member specifies a constant addend used to compute the value to be stored into the relocatable field.
  //                     const r_addend = {
  //                         value: Number(this.elfFile.getBigInt64(relocation_section_offset, this.is_lsb)),
  //                         raw_dec: this.elfFile.getBigInt64(relocation_section_offset, this.is_lsb).toString(),
  //                         raw_hex: this.elfFile.getBigInt64(relocation_section_offset, this.is_lsb).toString(16),
  //                         size_bytes: this.data_types.Elf_Sxword,
  //                         offset: relocation_section_offset,
  //                         name: "r_addend"
  //                     };
  //                     relocation_section_offset += this.data_types.Elf_Sxword;

  //                     relocation_entry.section_content.r_addend = r_addend;
  //                 }
  //             }

  //             relocation_entries.push(relocation_entry);
  //         }
  //     }

  //     return relocation_entries;

  // }

  // #processVerneedAux32(offset_base) {
  // }

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

  // #processElfVersionRequirements32() {
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

  // #processVerdAux32(offset_base, previous_verdaux_entries) {
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

  // #processElfDynSymtab32() {
  // }

  // #processElfDynSymtab64() {
  //     return this.processElfSymbolTables("SHT_DYNSYM");
  // }

  // #processElfSymtab32() {
  // }

  // #processElfSymtab64() {
  //     return this.processElfSymbolTables("SHT_SYMTAB");
  // }

  // #processElfSymbolTables(symbol_table_type) {

  //     let symtab = null;
  //     let strtab_offset = 0; // strtab used for symtab st_name

  //     // get symtab from elf section header
  //     // to my knowledge, there no other way but to check for
  //     // sh_type SHT_SYMTAB to get symbol table
  //     // for the dynamic symbols, you could also check the dynamic section
  //     // for DT_SYMTAB
  //     for (const element of this.elf_contents.elf_shdr) {
  //         if (element.sh_type.value == symbol_table_type) {
  //             symtab = element;
  //             strtab_offset = this.elf_contents.elf_shdr[symtab.sh_link.value].sh_offset.value;

  //         }
  //     }

  //     // Handle if no symtab section present (e.g. if not compiled with -g flag in gcc)
  //     if (symtab == null) {
  //         return null;
  //     }

  //     // check if sh_size is 0 or sh_size is greater than entire file size, if yes, abort
  //     if (symtab.sh_size.value == 0 || symtab.sh_size.value > this.file_length) {
  //         const err = new Error("symbol table section size error: " + symtab.sh_size.value);
  //         return err;
  //     }

  //     // check if sh_entsize is 0 or if sh_entsize is greater than sh_size.value, if yes, abort
  //     if (symtab.sh_entsize.value == 0 || symtab.sh_entsize.value > symtab.sh_size.value) {
  //         const err = new Error("symbol table section table member size error: " + symtab.sh_entsize.value);
  //         return err;
  //     }

  //     // get number of entries in symtable
  //     let symtab_entries_number = symtab.sh_size.value / symtab.sh_entsize.value;

  //     let symtab_entries = [];

  //     for (let symtab_entry_count = 0; symtab_entry_count < symtab_entries_number; symtab_entry_count++) {

  //         // calculate offset
  //         let symtab_offset = symtab.sh_offset.value + (symtab_entry_count * symtab.sh_entsize.value);

  //         /*
  //         This  member holds an index into the object file's symbol string table, which holds
  //         character representations of the symbol names. If the value is nonzero, it represents a
  //         string table index that gives the symbol name. Otherwise, the symbol has no name.
  //         */
  //         const st_name_offset = this.elfFile.getUint32(symtab_offset, this.is_lsb);
  //         const st_name = {
  //             value: this.getStringFromStringTable(strtab_offset + st_name_offset),
  //             raw_dec: st_name_offset.toString(),
  //             raw_hex: st_name_offset.toString(16),
  //             size_bytes: this.data_types.Elf_Word,
  //             offset: symtab_offset,
  //             name: "st_name"
  //         };
  //         symtab_offset += this.data_types.Elf_Word;

  //         /*
  //         This member specifies the symbol's type and binding attributes.
  //         Its made up of 8 bits, the first four bits represent the type (T)
  //         and the last four bits represent the binding (B):

  //         bit value | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
  //         {B,T}     | B   | B  | B  | B  | T | T | T | T |
  //         Operation |         >> 4       |       &0xF    |

  //         Thus, we do some bit shifting and bitwise operation to get the
  //         type and the binding
  //         */
  //         const st_bind = {
  //             value: elf_sym.st_bind[this.elfFile.getUint8(symtab_offset, this.is_lsb) >> 4],
  //             raw_dec: (this.elfFile.getUint8(symtab_offset, this.is_lsb) >> 4).toString(),
  //             raw_hex: (this.elfFile.getUint8(symtab_offset, this.is_lsb) >> 4).toString(16),
  //             size_bytes: this.data_types.char,
  //             offset: symtab_offset,
  //             name: "st_bind"
  //         };
  //         const st_type = {
  //             value: elf_sym.st_type[this.elfFile.getUint8(symtab_offset, this.is_lsb) & 0xF],
  //             raw_dec: (this.elfFile.getUint8(symtab_offset, this.is_lsb) & 0xF).toString(),
  //             raw_hex: (this.elfFile.getUint8(symtab_offset, this.is_lsb) & 0xF).toString(16),
  //             size_bytes: this.data_types.char,
  //             offset: symtab_offset,
  //             name: "st_type"
  //         };
  //         symtab_offset += this.data_types.char;

  //         /*
  //         This member defines the symbol visibility.
  //         This controls how a symbol may be accessed once it has
  //         become part of an executable or shared library.

  //         Its made up of 8 bits but only the first two represent (4 combinations) the visibility (V), thus
  //         bit value | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
  //         {V}       | -   | -  | -  | -  | - | - | V | V |
  //         Operation |            -               |  &0x3 |

  //         */
  //         const st_other = {
  //             value: elf_sym.st_other[this.elfFile.getUint8(symtab_offset, this.is_lsb) & 0x3],
  //             raw_dec: (this.elfFile.getUint8(symtab_offset, this.is_lsb) & 0x3).toString(),
  //             raw_hex: (this.elfFile.getUint8(symtab_offset, this.is_lsb) & 0x3).toString(16),
  //             size_bytes: this.data_types.char,
  //             offset: symtab_offset,
  //             name: "st_other"
  //         };
  //         symtab_offset += this.data_types.char;

  //         /*
  //         Every symbol table entry is "defined" in relation to some section.
  //         This member holds the relevant section header table index.
  //         */
  //         const st_shndx = {
  //             value: this.elfFile.getUint16(symtab_offset, this.is_lsb),
  //             raw_dec: this.elfFile.getUint16(symtab_offset, this.is_lsb).toString(),
  //             raw_hex: this.elfFile.getUint16(symtab_offset, this.is_lsb).toString(16),
  //             size_bytes: this.data_types.Elf_Half,
  //             offset: symtab_offset,
  //             name: "st_shndx"
  //         };
  //         symtab_offset += this.data_types.Elf_Half;

  //         /*
  //         This member gives the value of the associated symbol.
  //         This actually points to the address of that symbol if the
  //         st_type is of FUNC
  //         */
  //         const st_value = {
  //             value: Number(this.elfFile.getBigUint64(symtab_offset, this.is_lsb)),
  //             raw_dec: Number(this.elfFile.getBigUint64(symtab_offset, this.is_lsb)).toString(),
  //             raw_hex: Number(this.elfFile.getBigUint64(symtab_offset, this.is_lsb)).toString(16),
  //             size_bytes: this.data_types.Elf_Addr,
  //             offset: symtab_offset,
  //             name: "st_value"
  //         };
  //         symtab_offset += this.data_types.Elf_Addr;

  //         /*
  //         Many symbols have associated sizes. This member holds zero if the symbol has no size or an unknown size.
  //         */
  //         const st_size = {
  //             value: Number(this.elfFile.getBigUint64(symtab_offset, this.is_lsb)),
  //             raw_dec: Number(this.elfFile.getBigUint64(symtab_offset, this.is_lsb)).toString(),
  //             raw_hex: Number(this.elfFile.getBigUint64(symtab_offset, this.is_lsb)).toString(16),
  //             size_bytes: this.data_types.Elf_Xword,
  //             offset: symtab_offset,
  //             name: "st_size"
  //         };
  //         symtab_offset += this.data_types.Elf_Xword;

  //         let symtab_entry = {
  //             st_name: st_name,
  //             st_bind: st_bind,
  //             st_type: st_type,
  //             st_other: st_other,
  //             st_shndx: st_shndx,
  //             st_value: st_value,
  //             st_size: st_size
  //         };

  //         symtab_entries.push(symtab_entry);

  //     }

  //     return symtab_entries;
  // }
}
