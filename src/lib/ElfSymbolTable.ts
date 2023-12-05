import { elf_sym} from "./constants/common";

import { ElfDataReader } from "./ElfReader";

import {
    ElfSectionHeaderInterface,
    ElfSymbolTableInterface,
    ElfSymbolTableEntry,
    ElfBase,
    Elf32Types,
    Elf64Types,
    ElfData,
    ElfEndianness,
    ElfBitVersion,
} from "./ElfBase";

export class ElfSymbolTable extends ElfBase implements ElfSymbolTableInterface {
    
    elfSymbolTable: ElfSymbolTableEntry[] | null;
    
    constructor(buffer: ArrayBuffer, endianness: ElfEndianness, bit: ElfBitVersion, elfSectionHeader : ElfSectionHeaderInterface) {
        super(endianness, bit);
        
        let [elfSymbolTable, first_offset, last_offset] = this.parse(buffer, "SHT_SYMTAB", elfSectionHeader);
        this.elfSymbolTable = elfSymbolTable;
        
        // set data
        this.data = new DataView(buffer, first_offset, last_offset-first_offset);
    }
    
    private parse(buffer: ArrayBuffer, symbol_table_type: string, elfSectionHeader : ElfSectionHeaderInterface): [ElfSymbolTableEntry[] | null, number, number] {
        
        let last_offset = 0;
        
        let symtab = null;
        let strtab_offset = 0; // strtab used for symtab st_name
        
        // -- Get symtab from elf section header
        // To my knowledge, there no other way but to check for
        // sh_type 'SHT_SYMTAB' to get symbol table.
        // For the dynamic symbols, you also check the dynamic section for SHT_DYNSYM
        for (const element of elfSectionHeader.elfSectionHeader) {
            if (element.sh_type.value == symbol_table_type) {
                symtab = element;
                strtab_offset = elfSectionHeader.elfSectionHeader[symtab.sh_link.raw_dec].sh_offset.raw_dec;
            }
        }
        
        // Handle if no symtab section present (e.g. if not compiled with -g flag in gcc)
        if (symtab == null) {
            return [null,0,0];
        }
        
        // check if sh_size is 0 or sh_size is greater than entire file size, if yes, abort
        if (symtab.sh_size.raw_dec == 0 || symtab.sh_size.raw_dec > buffer.byteLength) {
            const err = new Error("Symbol table section size error: " + symtab.sh_size.value);
			throw err;
        }
        
        // check if sh_entsize is 0 or if sh_entsize is greater than sh_size.value, if yes, abort
        if (symtab.sh_entsize.raw_dec == 0 || symtab.sh_entsize.raw_dec > symtab.sh_size.raw_dec) {
            const err = new Error("Symbol table section table member size error: " + symtab.sh_entsize.value);
			throw err;
        }

        let first_offset = symtab.sh_offset.raw_dec;

        // get number of entries in symtable
        let symtab_entries_number = symtab.sh_size.raw_dec / symtab.sh_entsize.raw_dec;
        
        let symtab_entries = [];
        
        for (let symtab_entry_count = 0; symtab_entry_count < symtab_entries_number; symtab_entry_count++) {
            
            // calculate offset
            let symtab_offset = symtab.sh_offset.raw_dec + (symtab_entry_count * symtab.sh_entsize.raw_dec);
            
            let dtype = 0;
            const dataReader = new ElfDataReader(new DataView(buffer, 0, buffer.byteLength), this.bit, this.endianness, symtab_offset);

            /*
            This  member holds an index into the object file's symbol string table, which holds
            character representations of the symbol names. If the value is nonzero, it represents a
            string table index that gives the symbol name. Otherwise, the symbol has no name.
            */

            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
            const st_name = dataReader.readData("st_name", dtype);
            const st_name_offset = new DataView(buffer, 0, buffer.byteLength).getUint32(symtab_offset, this.endianness);
            st_name.value = dataReader.getStringFromStringTable(buffer, strtab_offset + st_name_offset);

            
            /*
            This member (st_info) specifies the symbol's type and binding attributes.
            Its made up of 8 bits, the first four bits represent the type (T)
            and the last four bits represent the binding (B):
            
            bit value | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
            {B,T}     | B   | B  | B  | B  | T | T | T | T |
            Operation |         >> 4       |       &0xF    |
            
            Thus, we do some bit shifting and bitwise operation to get the
            type and the binding
            */

            dtype = this.bit == 32 ? Elf32Types.char : Elf64Types.char;
            const st_bind = dataReader.readData("st_bind", dtype, undefined, false); // dont update offset here, since were using this byte again
            st_bind.raw_dec = st_bind.raw_dec >> 4;
            st_bind.value = elf_sym.st_bind[(st_bind.raw_dec) as keyof typeof elf_sym.st_bind];
            
            dtype = this.bit == 32 ? Elf32Types.char : Elf64Types.char;
            const st_type = dataReader.readData("st_type", dtype);
            st_type.raw_dec = st_type.raw_dec >> 4;
            st_type.value = elf_sym.st_type[(st_type.raw_dec) as keyof typeof elf_sym.st_type];
            
            
            /*
            This member defines the symbol visibility.
            This controls how a symbol may be accessed once it has
            become part of an executable or shared library.
            
            Its made up of 8 bits but only the first two represent (4 combinations) the visibility (V), thus
            bit value | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
            {V}       | -   | -  | -  | -  | - | - | V | V |
            Operation |            -               |  &0x3 |
            
            */
            dtype = this.bit == 32 ? Elf32Types.char : Elf64Types.char;
            const st_other = dataReader.readData("st_other", dtype);
            st_other.raw_dec = st_other.raw_dec & 0x3;
            st_other.value = elf_sym.st_other[(st_other.raw_dec) as keyof typeof elf_sym.st_other];
            
            /*
            Every symbol table entry is "defined" in relation to some section.
            This member holds the relevant section header table index.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Half : Elf64Types.Elf_Half;
            const st_shndx = dataReader.readData("st_shndx", dtype);
            
            
            /*
            This member gives the value of the associated symbol.
            This actually points to the address of that symbol if the
            st_type is of FUNC
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Addr : Elf64Types.Elf_Addr;
            const st_value = dataReader.readData("st_value", dtype);

            
            /*
            Many symbols have associated sizes. This member holds zero if the symbol has no size or an unknown size.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Xword;
            const st_size = dataReader.readData("st_size", dtype);

            let symtab_entry = {
                st_name: st_name,
                st_bind: st_bind,
                st_type: st_type,
                st_other: st_other,
                st_shndx: st_shndx,
                st_value: st_value,
                st_size: st_size
            };
            
            symtab_entries.push(symtab_entry);

            last_offset = dataReader.offset;
        }
        
        return [symtab_entries, first_offset, last_offset];
        
    }
}