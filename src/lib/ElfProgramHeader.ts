import { elf_phdr } from "./constants/common";

import { ElfDataReader } from "./ElfReader";

import {
    ElfProgramHeaderInterface,
    ElfProgramHeaderEntry,
    ElfBase,
    Elf32Types,
    Elf64Types,
    ElfData,
    ElfEndianness,
    ElfBitVersion,
} from "./ElfBase";

export class ElfProgramHeader
extends ElfBase
implements ElfProgramHeaderInterface
{
    elfProgramHeader: ElfProgramHeaderEntry[];
    
    constructor(buffer: ArrayBuffer, endianness: ElfEndianness, bit: ElfBitVersion, e_phnum: ElfData, e_phoff: ElfData, e_phentsize: ElfData) {
        super(endianness, bit);
        
        let [elfProgramHeader, last_offset] = this.parse(buffer,e_phnum,e_phoff,e_phentsize);
        this.elfProgramHeader = elfProgramHeader;
        
        // set data
        this.data = new DataView(buffer, e_phoff.raw_dec, last_offset-e_phoff.raw_dec);
    }
    
    private parse(buffer: ArrayBuffer, e_phnum: ElfData, e_phoff: ElfData, e_phentsize: ElfData): [ElfProgramHeaderEntry[], number] {
        let last_offset = 0;
        let phdr_entries: ElfProgramHeaderEntry[] = [];
        
        for (let phdr_entry_count = 0; phdr_entry_count < e_phnum.raw_dec; phdr_entry_count++) {
            let phdr_entry_offset =
            e_phoff.raw_dec + phdr_entry_count * e_phentsize.raw_dec;
            
            let dtype = 0;
            const dataReader = new ElfDataReader(new DataView(buffer, 0, buffer.byteLength), this.bit, this.endianness,phdr_entry_offset);
            
            /*
            This member of the structure indicates what kind of segment this array element
            describes or how to interpret the array element's information.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
            const p_type = dataReader.readData("p_type", dtype, elf_phdr.p_type);
            
            /*
            This member holds a bit mask of flags relevant to the segment:
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
            const p_flags = dataReader.readData("p_flags", dtype);
            p_flags.value = dataReader.getSetFlags(p_flags.raw_dec, elf_phdr.p_flags);
            
            /*
            This member holds the offset from the beginning of the file at which the first byte of the segment resides.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Off : Elf64Types.Elf_Off;
            const p_offset = dataReader.readData("p_offset", dtype);
            
            /*
            This member holds the virtual address at which the first byte of the segment resides in memory.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Addr : Elf64Types.Elf_Addr;
            const p_vaddr = dataReader.readData("p_vaddr", dtype);
            
            /*
            On systems for which physical addressing is relevant, this member is reserved for the segment's physical address.
            Under BSD this member is not used and must be zero.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Addr : Elf64Types.Elf_Addr;
            const p_paddr = dataReader.readData("p_paddr", dtype);
            
            /*
            This member holds the number of bytes in the file image of the segment.  It may be zero.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Xword;
            const p_filesz = dataReader.readData("p_filesz", dtype);
            
            /*
            This member holds the number of bytes in the memory image of the segment.  It may be zero.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Xword;
            const p_memsz = dataReader.readData("p_memsz", dtype);
            
            /*
            This  member  holds  the  value  to which the segments are aligned in memory and in the file.
            Loadable process segments must have congruent values for p_vaddr and p_offset, modulo the page
            size. Values of zero and one mean no alignment is required.
            Otherwise, p_align should be a positive, integral power of two, and p_vaddr should equal p_offset, modulo p_align.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Xword;
            const p_align = dataReader.readData("p_align", dtype);
            
            let phdr_entry: ElfProgramHeaderEntry = {
                p_type: p_type,
                p_flags: p_flags,
                p_offset: p_offset,
                p_vaddr: p_vaddr,
                p_paddr: p_paddr,
                p_filesz: p_filesz,
                p_memsz: p_memsz,
                p_align: p_align,
            };
            
            phdr_entries.push(phdr_entry);
            
            last_offset = dataReader.offset;
        }
        
        return [phdr_entries, last_offset];
    }
}
