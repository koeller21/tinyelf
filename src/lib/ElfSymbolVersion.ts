
import { ElfDataReader } from "./ElfDataReader";

import {
    ElfSectionHeaderInterface,
    ElfSectionHeaderEntry,
    ElfVerneedEntry,
    ElfVernauxEntry,
    ElfSymbolVersioning,
    ElfBase,
    Elf32Types,
    Elf64Types,
    ElfData,
    ElfEndianness,
    ElfBitVersion,
    ElfDynamicInterface,
} from "./ElfBase";

interface SymVersionDict {
    [details: string] : ElfSectionHeaderEntry;
} 

export class ElfSymbolVersion extends ElfBase implements ElfSymbolVersioning{

    elfVerneed: ElfVerneedEntry[] | null;
	elfVernaux : ElfVernauxEntry[] | null;

    
    constructor(buffer: ArrayBuffer, endianness: ElfEndianness, bit: ElfBitVersion, elfSectionHeader : ElfSectionHeaderInterface, elfDynamic: ElfDynamicInterface) {
        super(endianness, bit);
        
        // let [elfProgramHeader, last_offset] = this.parse(buffer, elfSectionHeader);
        // this.elfProgramHeader = elfProgramHeader;
        [this.elfVerneed, this.elfVernaux] = this.processElfVersionRequirements(buffer, elfSectionHeader, elfDynamic);

        
        // set data
        // this.data = new DataView(buffer, e_phoff.raw_dec, last_offset-e_phoff.raw_dec);
    }
    
    private processVerneedAux(buffer: ArrayBuffer, offset_base : number, previous_vernaux_entries : ElfVernauxEntry[]) : ElfVernauxEntry[] {
        
        let offset_entry : number = offset_base;

        let dtype = 0;
        const dataReader = new ElfDataReader(new DataView(buffer, 0, buffer.byteLength), this.bit, this.endianness, offset_entry);
        
        // Dependency name hash value (ELF hash function).
        dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
        const vna_hash = dataReader.readData("vna_hash", dtype);
        
        // Dependency information flag bitmask.
        dtype = this.bit == 32 ? Elf32Types.Elf_Half : Elf64Types.Elf_Half;
        const vna_flags = dataReader.readData("vna_flags", dtype);
        
        // Object file version identifier used in the .gnu.version symbol version array. Bit number 15 controls whether or not the object is hidden; 
        // if this bit is set, the object cannot be used and the static linker will ignore the symbol's presence in the object.
        dtype = this.bit == 32 ? Elf32Types.Elf_Half : Elf64Types.Elf_Half;
        const vna_other = dataReader.readData("vna_other", dtype);
        
        // Offset to the dependency name string in the section header, in bytes.
        dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
        const vna_name = dataReader.readData("vna_name", dtype);
        
        // Offset to the next vernaux entry, in bytes.
        dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
        const vna_next = dataReader.readData("vna_next", dtype);
        
        let verneedaux_entry = {
            vna_hash: vna_hash,
            vna_flags: vna_flags,
            vna_other: vna_other,
            vna_name: vna_name,
            vna_next: vna_next
        };
        
        if (Number(vna_next.raw_dec) != 0) {
            offset_base += Number(vna_next.raw_dec);
            this.processVerneedAux(buffer, offset_base, previous_vernaux_entries);
        }
        
        previous_vernaux_entries.push(verneedaux_entry);
        
        return previous_vernaux_entries;
    }
    
    private processElfVersionRequirements(buffer: ArrayBuffer, elfSectionHeader : ElfSectionHeaderInterface, elfDynamic : ElfDynamicInterface) : [ElfVerneedEntry[] | null, ElfVernauxEntry[] | null] {
        /*
        All ELF objects may provide or depend on versioned symbols. Symbol Versioning is implemented by 3 section types: SHT_GNU_versym, SHT_GNU_verdef, and SHT_GNU_verneed.
        This method handels section type: SHT_GNU_verneed.
        The SHT_GNU_verneed symbol version section defines what 'versions' within a shared library, that's being dynamically linked to the executable, are necessary to execute the binary.
        For example, the dynamic section (of a dynamically linked executable, a statically linked one won't have it, might indicate that libc.so.6 is NEEDED (d_tag: DT_NEEDED).
        The shared library itself (libc.so.6 in this example), then defines its symbol version definitions (using a linker version script) within the SHT_GNU_verdef section.
        When a dynamically linked executable then uses the shared library, it can require (using the SHT_GNU_verneed section) that certain symbol definitions are present in the dynamically linked shared library.
        This ensures that the shared library on a system e.g. is up-to-date for a given elf executable binary.
        Imagine you have some old desktop PC, that hasn't been updated (more specifically: whose shared libraries haven't been updated) since 2008. You build an ELF DYN executable on your brand new laptop that has the latest shared libraries.
        Requiring a certain version of the symbols within a shared library ensures that when you run your ELF DYN executable on the old desktop PC you don't get ugly runtime errors when the GOT can't be updated because the symbol is missing from the shared library
        (in case DT_BIND_NOW isn't set).
        
        From: https://refspecs.linuxfoundation.org/LSB_3.0.0/LSB-PDA/LSB-PDA.junk/symversion.html
        "
        When loading a sharable object the system shall analyze version definition data from the loaded object to assure that it meets the version requirements of the calling object.
        This step is referred to as definition testing. The dynamic loader shall retrieve the entries in the caller's Elfxx_Verneed array and attempt to find matching definition information in the loaded Elfxx_Verdef table.
        Each object and dependency shall be tested in turn. If a symbol definition is missing and the vna_flags bit for VER_FLG_WEAK is not set, the loader shall return an error and exit.
        If the vna_flags bit for VER_FLG_WEAK is set in the Elfxx_Vernaux entry, and the loader shall issue a warning and continue operation.
        When the versions referenced by undefined symbols in the loaded object are found, version availability is certified. The test completes without error and the object shall be made available.
        "
        */
        
        let sym_version_information_sections : SymVersionDict = {};
        let verneed_entries = [];
        let verneedaux_entries : ElfVernauxEntry[] = [];
        
        for (const section_header of elfSectionHeader.elfSectionHeader) {
            if (section_header.sh_type.value == "SHT_GNU_verneed") {
                sym_version_information_sections[section_header.sh_type.value as string] = section_header;
            }
        }

        // check if dynamic section exists, if not, there shouldn't be contain symbol versions since those are for dynamically linked executables & SO's
        if (elfDynamic.elfDynamic != null){
            return [null, null];
        }

        // check if SHT_GNU_verneed exists and if DT_VERNEED is set in dynamic section
        if ("SHT_GNU_verneed" in sym_version_information_sections && elfDynamic.elfDynamic!.some(item => item.d_tag.value === "DT_VERNEED")) {
            
            // check DT_VERNEEDNUM to figure out how many entries are there and loop through them
            let verneednum : number | undefined = 1;
            if (elfDynamic.elfDynamic!.some(item => item.d_tag.value === "DT_VERNEEDNUM")) {
                verneednum = elfDynamic.elfDynamic!.find(item => item.d_tag.value === 'DT_VERNEEDNUM')?.d_un.raw_dec;
            }
            
            // ToDo check if verneednum is not undefined or null

            // ToDo check if DT_VERNEEDNUM and sh_info of section header are the same

            // get offset (these are dynamic offsets, so we have to update them iteratively)
            let verneed_offset_base : number = Number(sym_version_information_sections["SHT_GNU_verneed"].sh_offset.value);
            
            for (let verneed_entry_count = 0; verneed_entry_count < verneednum!; verneed_entry_count++) {

                let verneed_offset = verneed_offset_base;

                let dtype = 0;
                const dataReader = new ElfDataReader(new DataView(buffer, 0, buffer.byteLength), this.bit, this.endianness, verneed_offset as number);
                
                // Version of structure. This value is currently set to 1, and will be reset if the versioning implementation is incompatibly altered.
                dtype = this.bit == 32 ? Elf32Types.Elf_Half : Elf64Types.Elf_Half;
                const vn_version = dataReader.readData("vn_version", dtype);
                
                // Number of associated verneed array entries.
                dtype = this.bit == 32 ? Elf32Types.Elf_Half : Elf64Types.Elf_Half;
                const vn_cnt = dataReader.readData("vn_cnt", dtype);
                
                // Offset to the file name string in the section header, in bytes.
                dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
                const vn_file = dataReader.readData("vn_file", dtype);
                
                // ToDo follow sh_link of SHT_GNU_verneed section to actually get file name

                // Offset to a corresponding entry in the vernaux array, in bytes.
                dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
                const vn_aux = dataReader.readData("vn_aux", dtype);
                
                // get verneed auxillary entries
                let verneed_aux_offset = verneed_offset_base + vn_aux.raw_dec;
                verneedaux_entries = this.processVerneedAux(buffer, verneed_aux_offset, verneedaux_entries);
                
                // Offset to the next verneed entry, in bytes.
                dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
                const vn_next = dataReader.readData("vn_next", dtype);
                
                let verneed_entry = {
                    vn_version: vn_version,
                    vn_cnt: vn_cnt,
                    vn_file: vn_file,
                    vn_aux: vn_aux,
                    vn_next: vn_next
                };
                
                verneed_entries.push(verneed_entry);
                
                if (Number(vn_next.raw_dec) != 0) {
                    verneed_offset_base += Number(vn_next.raw_dec);
                } else {
                    break;
                }
                
            }
        }
        
        return [verneed_entries, verneedaux_entries];
        
    }
    
    private processVerdAux(offset_base, previous_verdaux_entries) {
        
        let offset_entry = offset_base;
        
        // 	Offset to the version or dependency name string in the section header, in bytes.
        const vda_name = {
            value: this.elfFile.getUint32(offset_entry, this.is_lsb),
            raw_dec: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(),
            raw_hex: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(16),
            size_bytes: this.data_types.Elf_Word,
            offset: offset_entry,
            name: "vda_name"
        };
        offset_entry += this.data_types.Elf_Word;
        
        // Offset to the next vernaux entry, in bytes.
        const vda_next = {
            value: this.elfFile.getUint32(offset_entry, this.is_lsb),
            raw_dec: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(),
            raw_hex: this.elfFile.getUint32(offset_entry, this.is_lsb).toString(16),
            size_bytes: this.data_types.Elf_Word,
            offset: offset_entry,
            name: "vda_next"
        };
        offset_entry += this.data_types.Elf_Word;
        
        let verdaux_entry = {
            vda_name: vda_name,
            vda_next: vda_next
        };
        
        if (Number(vda_next.raw_dec) != 0) {
            offset_base += Number(vda_next.raw_dec);
            this.processVerdAux(offset_base, previous_verdaux_entries);
        }
        
        previous_verdaux_entries.push(verdaux_entry);
        
        return previous_verdaux_entries;
    }
    
    private processElfVersionDefinitions() {
        /*
        All ELF objects may provide or depend on versioned symbols. Symbol Versioning is implemented by 3 section types: SHT_GNU_versym, SHT_GNU_verdef, and SHT_GNU_verneed.
        This method handels section type: SHT_GNU_verdef.
        The SHT_GNU_verneed symbol version section defines what 'versions' within a shared library, that's being dynamically linked to the executable, are necessary to execute the binary.
        For example, the dynamic section (of a dynamically linked executable, a statically linked one won't have it) might indicate that libc.so.6 is NEEDED (d_tag: DT_NEEDED).
        The shared library itself (libc.so.6 in this example), then defines its symbol version definitions (using a linker version script) within the SHT_GNU_verdef section.
        When a dynamically linked executable then uses the shared library, it can require (using the SHT_GNU_verneed section) that certain symbol definitions are present in the dynamically linked shared library.
        This ensures that the shared library on a system e.g. is up-to-date for a given elf executable binary.
        Imagine you have some old desktop PC, that hasn't been updated (more specifically: whose shared libraries haven't been updated) since 2008. You build an ELF DYN executable on your brand new laptop that has the latest shared libraries.
        Requiring a certain version of the symbols within a shared library ensures that when you run your ELF DYN executable on the old desktop PC you don't get ugly runtime errors when the GOT can't be updated because the symbol is missing from the shared library
        (in case DT_BIND_NOW isn't set).
        
        From: https://refspecs.linuxfoundation.org/LSB_3.0.0/LSB-PDA/LSB-PDA.junk/symversion.html
        "
        When loading a sharable object the system shall analyze version definition data from the loaded object to assure that it meets the version requirements of the calling object.
        This step is referred to as definition testing. The dynamic loader shall retrieve the entries in the caller's Elfxx_Verneed array and attempt to find matching definition information in the loaded Elfxx_Verdef table.
        Each object and dependency shall be tested in turn. If a symbol definition is missing and the vna_flags bit for VER_FLG_WEAK is not set, the loader shall return an error and exit.
        If the vna_flags bit for VER_FLG_WEAK is set in the Elfxx_Vernaux entry, and the loader shall issue a warning and continue operation.
        When the versions referenced by undefined symbols in the loaded object are found, version availability is certified. The test completes without error and the object shall be made available.
        "
        */
        
        let sym_version_information_sections = [];
        let verndef_entries = [];
        let verdaux_entries = [];
        
        for (const section_header of this.elf_contents.elf_shdr) {
            if (section_header.sh_type.value == "SHT_GNU_verdef") {
                sym_version_information_sections[section_header.sh_type.value] = section_header;
            }
        }
        
        // check if SHT_GNU_verdef exists and if DT_VERDEF is set in dynamic section
        if ("SHT_GNU_verdef" in sym_version_information_sections && this.elf_contents.elf_dyn.some(item => item.d_tag.value === 'DT_VERDEF')) {
            
            // check DT_VERDEFNUM to figure out how many entries are there and loop through them
            let verdefnum = 1;
            if (this.elf_contents.elf_dyn.some(item => item.d_tag.value === "DT_VERDEFNUM")) {
                verdefnum = this.elf_contents.elf_dyn.find(item => item.d_tag.value === 'DT_VERDEFNUM').d_un.raw_dec;
            }
            
            // ToDo check if DT_VERDEFNUM and sh_info of section header are the same
            // get offset (these are dynamic offsets, so we have to update them iteratively)
            let verdef_offset_base = sym_version_information_sections["SHT_GNU_verdef"].sh_offset.value;
            
            for (let verdef_entry_count = 0; verdef_entry_count < verdefnum; verdef_entry_count++) {
                
                let verdef_offset = verdef_offset_base;
                
                // Version revision. This field shall be set to 1.
                const vd_version = {
                    value: this.elfFile.getUint16(verdef_offset, this.is_lsb),
                    raw_dec: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(),
                    raw_hex: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(16),
                    size_bytes: this.data_types.Elf_Half,
                    offset: verdef_offset,
                    name: "vd_version"
                };
                verdef_offset += this.data_types.Elf_Half;
                
                // Version information flag bitmask.
                const vd_flags = {
                    value: this.elfFile.getUint16(verdef_offset, this.is_lsb),
                    raw_dec: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(),
                    raw_hex: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(16),
                    size_bytes: this.data_types.Elf_Half,
                    offset: verdef_offset,
                    name: "vd_flags"
                };
                verdef_offset += this.data_types.Elf_Half;
                
                // Version index numeric value referencing the SHT_GNU_versym section.
                const vd_ndx = {
                    value: this.elfFile.getUint16(verdef_offset, this.is_lsb),
                    raw_dec: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(),
                    raw_hex: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(16),
                    size_bytes: this.data_types.Elf_Half,
                    offset: verdef_offset,
                    name: "vd_ndx"
                };
                verdef_offset += this.data_types.Elf_Half;
                
                // Number of associated verdaux array entries.
                const vd_cnt = {
                    value: this.elfFile.getUint16(verdef_offset, this.is_lsb),
                    raw_dec: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(),
                    raw_hex: this.elfFile.getUint16(verdef_offset, this.is_lsb).toString(16),
                    size_bytes: this.data_types.Elf_Half,
                    offset: verdef_offset,
                    name: "vd_cnt"
                };
                verdef_offset += this.data_types.Elf_Half;
                
                // Offset to the next verneed entry, in bytes.
                const vd_hash = {
                    value: this.elfFile.getUint32(verdef_offset, this.is_lsb),
                    raw_dec: this.elfFile.getUint32(verdef_offset, this.is_lsb).toString(),
                    raw_hex: this.elfFile.getUint32(verdef_offset, this.is_lsb).toString(16),
                    size_bytes: this.data_types.Elf_Word,
                    offset: verdef_offset,
                    name: "vd_hash"
                };
                verdef_offset += this.data_types.Elf_Word;
                
                // Offset in bytes to a corresponding entry in an array of Elfxx_Verdaux structures
                const vd_aux = {
                    value: this.elfFile.getUint32(verdef_offset, this.is_lsb),
                    raw_dec: this.elfFile.getUint32(verdef_offset, this.is_lsb).toString(),
                    raw_hex: this.elfFile.getUint32(verdef_offset, this.is_lsb).toString(16),
                    size_bytes: this.data_types.Elf_Word,
                    offset: verdef_offset,
                    name: "vd_aux"
                };
                verdef_offset += this.data_types.Elf_Word;
                
                // get verdef auxillary entries
                let verdef_aux_offset = verdef_offset_base + Number(vd_aux.raw_dec);
                verdaux_entries = this.processVerdAux(verdef_aux_offset, verdaux_entries);
                
                // Offset to the next verdef entry, in bytes.
                const vd_next = {
                    value: this.elfFile.getUint32(verdef_offset, this.is_lsb),
                    raw_dec: this.elfFile.getUint32(verdef_offset, this.is_lsb).toString(),
                    raw_hex: this.elfFile.getUint32(verdef_offset, this.is_lsb).toString(16),
                    size_bytes: this.data_types.Elf_Word,
                    offset: verdef_offset,
                    name: "vd_next"
                };
                verdef_offset += this.data_types.Elf_Word;
                
                let verdef_entry = {
                    vd_version: vd_version,
                    vd_flags: vd_flags,
                    vd_ndx: vd_ndx,
                    vd_cnt: vd_cnt,
                    vd_hash: vd_hash,
                    vd_aux: vd_aux,
                    vd_next: vd_next
                };
                
                verndef_entries.push(verdef_entry);
                
                if (Number(vd_next.raw_dec) != 0) {
                    verdef_offset_base += Number(vd_next.raw_dec);
                } else {
                    break;
                }
                
            }
        }
        
        return [verndef_entries, verdaux_entries];
        
    }
    
    
}