import { elf_shdr } from "./constants/common";

import { ElfDataReader } from "./ElfReader";

import {
    ElfSectionHeaderInterface,
    ElfRelocationInterface,
    ElfRelocationEntry,
    RelocationType,
    ElfBase,
    Elf32Types,
    Elf64Types,
    ElfData,
    ElfEndianness,
    ElfBitVersion,
} from "./ElfBase";

export class ElfRelocation extends ElfBase implements ElfRelocationInterface {
    
    elfRelocation: ElfRelocationEntry[];
    
    constructor(buffer: ArrayBuffer, endianness: ElfEndianness, bit: ElfBitVersion, elfSectionHeader : ElfSectionHeaderInterface, relocationType : RelocationType) {
        super(endianness, bit);
        
        let [elfRelocation, first_offset, last_offset] = this.parse(buffer, elfSectionHeader, relocationType);
        this.elfRelocation = elfRelocation;
        
        // set data
        this.data = new DataView(buffer, first_offset, last_offset-first_offset);
    }
    
    private parse(buffer: ArrayBuffer, elfSectionHeader : ElfSectionHeaderInterface, relocationType: RelocationType): [ElfRelocationEntry[] | null, number, number] {
        let last_offset = 0;
        
        /*
        Relocation is the process of connecting symbolic references with symbolic definitions.
        Relocatable files must have information that describes how to modify their section contents, thus allowing
        executable and shared object files to hold the right information for a process's program image.
        Relocation entries are these data.
        
        */
        
        // find relocation section headers in section headers
        // these could be either of type SHT_REL, SHT_RELA or SHT_RELR depending on the binary
        // let relocations_section_headers = [];
        let relocation = null;
        
        for (const element of elfSectionHeader.elfSectionHeader) {
            if (element.sh_type.value == relocationType) {
                relocation = element;
            }
        }
        
        // Handle if no relocation of this type is present
        if (relocation == null) {
            return [null,0,0];
        }
        
        let first_offset = relocation.sh_offset.raw_dec;
        
        let relocation_entries = [];
        
        // get number of entries in relocation section
        let relocation_entries_number = relocation.sh_size.raw_dec / relocation.sh_entsize.raw_dec;
        
        for (let relocation_entry_count = 0; relocation_entry_count < relocation_entries_number; relocation_entry_count++) {
            
            // calculate offset
            let relocation_section_offset = relocation.sh_offset.raw_dec + (relocation_entry_count * relocation.sh_entsize.raw_dec);
            
            let dtype = 0;
            const dataReader = new ElfDataReader(new DataView(buffer, 0, buffer.byteLength), this.bit, this.endianness, relocation_section_offset);
            
            // This member gives the location at which to apply the relocation action.
            // For a relocatable file, the value is the byte offset from the beginning of the section to the storage unit affected by the relocation.
            // For an executable file or shared object, the value is the virtual address of the storage unit affected by the relocation.
            dtype = this.bit == 32 ? Elf32Types.Elf_Addr : Elf64Types.Elf_Addr;
            const r_offset = dataReader.readData("r_offset", dtype);
            
            let r_info = null;
            let r_type = null;
            let r_sym = null;
            let r_addend = null;
            
            // SHT_RELR is a relocation entry without explicit addend or info (relative relocations only).
            // this means that SHT_RELR will only contain an offset.
            // SHT_REL and SHT_RELA will contain an info and SHT_RELA will contain an addend additionally
            // Therefore, r_info and r_added will only apply to these
            if (relocation.sh_type.value == "SHT_REL" || relocation.sh_type.value == "SHT_RELA") {
                
                // This member gives both the symbol table index with respect to which the relocation must be made and the type of relocation to apply.
                // Relocation types are processor-specific.
                // When the text refers to a relocation entry's relocation type or symbol table index, it means the result of applying ELF[32|64]_R_TYPE or ELF[32|64]_R_SYM, respectively, to the entry's r_info member.
                dtype = this.bit == 32 ? Elf32Types.Elf_Addr : Elf64Types.Elf_Addr;
                r_info = dataReader.readData("r_info", dtype, undefined, false);
                // get actual relocation type from r_info
                r_type = this.getRelocType(r_info);
                
                // get actual symbol from r_info
                // The sh_link field in the section header specifies the symbol table associated with the section.
                // For example, in a .rela.text section, the sh_link field will contain the index of the symbol table to be used for that specific section.
                // It's this index that decides whether to use .symtab or .dynsym.
                dtype = this.bit == 32 ? Elf32Types.Elf_Addr : Elf64Types.Elf_Addr;
                r_sym = dataReader.readData("r_sym", dtype);
                r_sym.value = this.getRelocSymbol(r_info, elfSectionHeader.elfSectionHeader[relocation.sh_link.raw_dec]);
                
                // SHT_RELA contains an addend additionally
                if (relocation.sh_type.value == "SHT_RELA") {
                    // This member specifies a constant addend used to compute the value to be stored into the relocatable field.
                    dtype = this.bit == 32 ? Elf32Types.Elf_Sword : Elf64Types.Elf_Sxword;
                    r_addend = dataReader.readData("r_addend", dtype);
                }
            }
            
            let relocation_entry : ElfRelocationEntry = {
                r_offset : r_offset,
                r_info : r_info,
                r_type : r_type,
                r_sym : r_sym,
                r_addend : r_addend
            };
            
            
            relocation_entries.push(relocation_entry);
            
            last_offset = dataReader.offset;
            
        }
        
        return [relocation_entries, first_offset, last_offset];
    }
    
    
    private getRelocType(r_info : ElfData) {

        /*
        This member specifies the relocation type to apply.
        We do some bit shifting and bitwise operation to get the
        type. Also architecture dependant.
        */
        
        let r_type = null;
        let r_type_value = null; // the actual relocation type
        
        if (!this.endianness) {
            // 64 bit
            switch (this.architecture) {
                case "EM_MIPS":
                r_type = r_info.raw_dec & 0xff;
                break;
                case "EM_SPARCV9":
                r_type = r_info.raw_dec & 0xff;
                break;
                default:
                r_type = r_info.raw_dec & 0xffffffff;
            }
            
        } else {
            // 32 bit
            r_type = r_info.raw_dec & 0xff;
        }
        
        if (r_type == null) {
            return null;
        }
        
        switch (this.architecture) {
            case "EM_MIPS":
            r_type_value = R_MIPS_TYPE[r_type];
            break;
            case "EM_SPARCV9":
            r_type_value = R_SPARC_TYPE[r_type];
            break;
            default:
            r_type_value = R_X86_64_TYPE[r_type];
        }
        
        const r_type_ret : ElfData = {
            value: r_type_value,
            raw_dec: r_type,
            size: r_info.size,
            offset: r_info.offset,
            name: "r_type"
        };
        
        return r_type_ret;
        
    }
    
    private getRelocSymbol(r_info, symtab) : string {
        
        let r_sym_idx = null;
        let symtab_reloc_symbols = null;
        
        if (this.is_64) {
            r_sym_idx = r_info.value >> 32;
        } else {
            r_sym_idx = r_info.value >> 8;
        }
        
        // if either the index or the symtab is null, just return null
        if (r_sym_idx == null || symtab == null) {
            return null;
        }
        
        /*
        We have to differentiate between different symbol tables,
        Namely SHT_DYNSYM and SHT_SYMTAB.
        The symbol refered to by r_sym_idx is in either of those.
        Whether the symbol is in SHT_DYNSYM or in SHT_SYMTAB depends
        ultimately on the type of section of the relocation:
        
        For Relocatable Files:
        
        In the case of a relocatable object file (like your main.o), the index usually refers to the .symtab (Symbol Table).
        The .symtab contains both local and global symbols, and it's used by the linker to perform symbol resolution and relocation when combining relocatable object files.
        
        For Executable and Shared Libraries:
        
        For executables and shared libraries, the .dynsym (Dynamic Symbol Table) is typically used instead.
        This is because .dynsym is the symbol table for dynamic linking, containing only the symbols that are needed for relocation at runtime.
        .symtab could still exist, but it's often stripped to reduce the file size, and it's not used for dynamic linking.
        You'll often see sections like .rela.dyn and .rela.plt refer to indices in .dynsym.
        */
        if (symtab.sh_type.value == "SHT_DYNSYM") {
            symtab_reloc_symbols = this.elf_contents.elf_dynsymtab;
        } else if (symtab.sh_type.value == "SHT_SYMTAB") {
            symtab_reloc_symbols = this.elf_contents.elf_symtab;
        } else {
            // if the symtab is neither of type SHT_DYNSYM nor of type SHT_SYMTAB, just return
            return null;
        }
        
        // check that r_sym_idx is not geq than symbol table length - 1
        if (r_sym_idx >= symtab_reloc_symbols.length) {
            return null;
        }
        
        return symtab_reloc_symbols[r_sym_idx].st_name;
        
    }
}