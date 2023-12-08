import { elf_shdr } from "./constants/common";

import { ElfDataReader } from "./ElfDataReader";

import {
    ElfSectionHeaderInterface,
    ElfSectionHeaderEntry,
    ElfBase,
    Elf32Types,
    Elf64Types,
    ElfData,
    ElfEndianness,
    ElfBitVersion,
} from "./ElfBase";

export class ElfSectionHeader extends ElfBase implements ElfSectionHeaderInterface {
    
    elfSectionHeader: ElfSectionHeaderEntry[];
    
    constructor(buffer: ArrayBuffer, endianness: ElfEndianness, bit: ElfBitVersion, e_shnum: ElfData, e_shoff: ElfData, e_shentsize: ElfData, e_shstrndx: ElfData) {
        super(endianness, bit);
        
        let [elfSectionHeader, last_offset] = this.parse(buffer, e_shnum, e_shoff, e_shentsize, e_shstrndx);
        this.elfSectionHeader = elfSectionHeader;

        // set data
        this.data = new DataView(buffer, e_shoff.raw_dec, last_offset-e_shoff.raw_dec);
    }
    
    private parse(buffer: ArrayBuffer, e_shnum: ElfData, e_shoff: ElfData, e_shentsize: ElfData, e_shstrndx: ElfData): [ElfSectionHeaderEntry[], number] {
        let last_offset = 0;
        
        /*
        Get .shstrtab-section offset so we can resolve sh_name
        - e_shstrndx contains section header index to .shstrtab (e.g. 36)
        - therefore, e_shstrndx can be used to fetch offset address of
        actual .shstrtab section (e.g. 0x3eb4)
        - sh_name is then just an index offset (e.g. 27) into the section header string table section
        */
        
        const shstrtab_entry_offset = e_shoff.raw_dec + e_shstrndx.raw_dec * e_shentsize.raw_dec;
        // const shstrtab_sh_offset = Number(this.elfFile.getBigUint64(shstrtab_entry_offset + 24, this.is_lsb));
        const shstrtab_sh_offset = Number(new DataView(buffer, 0, buffer.byteLength).getBigUint64(shstrtab_entry_offset + 24, this.endianness));
        
        let shdr_entries = [];
        
        for (let shdr_entry_count = 0; shdr_entry_count < e_shnum.raw_dec; shdr_entry_count++) {
            
            // calculate shdr_entry offset
            let shdr_entry_offset = e_shoff.raw_dec + shdr_entry_count * e_shentsize.raw_dec;
            
            let dtype = 0;
            const dataReader = new ElfDataReader(new DataView(buffer, 0, buffer.byteLength), this.bit, this.endianness, shdr_entry_offset);
            
            /*
            This member specifies the name of the section.
            Its value is an index into the section header string table section,
            giving the location of a null-terminated string.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
            const sh_name = dataReader.readData("sh_name", dtype);
            const sh_name_offset = new DataView(buffer, 0, buffer.byteLength).getUint32(shdr_entry_offset, this.endianness);
            sh_name.value = dataReader.getStringFromStringTable(buffer, shstrtab_sh_offset + sh_name_offset);

            /*
            This member categorizes the section's contents and semantics.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
            const sh_type = dataReader.readData("sh_type", dtype, elf_shdr.sh_type);
            
            /*
            Sections support one-bit flags that describe miscellaneous attributes.
            If a flag bit is set in sh_flags, the attribute is "on" for the section.
            Otherwise, the attribute is "off"  or  does not apply.
            Undefined attributes are set to zero.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Xword;
            const sh_flags = dataReader.readData("sh_flags", dtype);
            sh_flags.value = dataReader.getSetFlags(sh_flags.raw_dec, elf_shdr.sh_flags);
            
            /*
            If this section appears in the (virtual) memory image of a process, this member
            holds the address at which the section's first byte should reside.
            Otherwise, the member contains zero.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Addr : Elf64Types.Elf_Addr;
            const sh_addr = dataReader.readData("sh_addr", dtype);
            
            /*
            This  member's value holds the byte offset from the beginning of the file to
            the first byte in the section. One section type, SHT_NOBITS, occupies no space
            in the file, and its sh_offset member locates the conceptual placement in the file.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Off : Elf64Types.Elf_Off;
            const sh_offset = dataReader.readData("sh_offset", dtype);
            
            /*
            This member holds the section's size in bytes. Unless the section type is SHT_NOBITS,
            the section occupies sh_size bytes in the file. A section of type SHT_NOBITS may have a nonzero size,
            but it occupies no space in the file.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Xword;
            const sh_size = dataReader.readData("sh_size", dtype);
            
            /*
            This member holds a section header table index link, whose interpretation depends on the section type.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
            const sh_link = dataReader.readData("sh_link", dtype);
            
            /*
            This member holds extra information, whose interpretation depends on the section type.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
            const sh_info = dataReader.readData("sh_info", dtype);
            
            /*
            Some sections have address alignment constraints. If a section holds a doubleword,
            the system must ensure doubleword alignment for the entire section. That is, the value of sh_addr must
            be congruent to zero, modulo the value of sh_addralign.
            Only zero and positive integral powers of two are allowed.
            The value 0 or 1 means that the section has no alignment constraints.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Xword;
            const sh_addralign = dataReader.readData("sh_addralign", dtype);
            
            /*
            Some sections hold a table of fixed-sized entries, such as a symbol table.
            For such a section, this member gives the size in bytes for each entry.
            This member contains zero if the section
            does not hold a table of fixed-size entries.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Xword;
            const sh_entsize = dataReader.readData("sh_entsize", dtype);
            
            let shdr_entry : ElfSectionHeaderEntry = {
                sh_name: sh_name,
                sh_type: sh_type,
                sh_flags: sh_flags,
                sh_addr: sh_addr,
                sh_offset: sh_offset,
                sh_size: sh_size,
                sh_link: sh_link,
                sh_info: sh_info,
                sh_addralign: sh_addralign,
                sh_entsize: sh_entsize
            };
            
            shdr_entries.push(shdr_entry);
            
            last_offset = dataReader.offset;
        }
        
        return [shdr_entries, last_offset];
        
    }
    
}