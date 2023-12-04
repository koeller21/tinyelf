import { elf_dynamic, DT_FLAGS, DT_GNU_FLAGS_1, DT_FEATURE, DT_FLAGS_1, DT_POSFLAG_1 } from "./constants/common";

import { ElfDataReader } from "./ElfReader";

import {
    ElfSectionHeaderInterface,
    ElfDynamicInterface,
    ElfDynamicEntry,
    ElfBase,
    Elf32Types,
    Elf64Types,
    ElfData,
    ElfEndianness,
    ElfBitVersion,
} from "./ElfBase";

export class ElfDynamic extends ElfBase implements ElfDynamicInterface {
    
    elfDynamic: ElfDynamicEntry[] | null;
    
    constructor(buffer: ArrayBuffer, endianness: ElfEndianness, bit: ElfBitVersion, elfSectionHeader : ElfSectionHeaderInterface) {
        super(endianness, bit);
        
        let [elfDynamic, first_offset, last_offset] = this.parse(buffer, elfSectionHeader);
        this.elfDynamic = elfDynamic;
        
        // set data
        this.data = new DataView(buffer, first_offset, last_offset-first_offset);
    }
    
    private parse(buffer: ArrayBuffer, elfSectionHeader : ElfSectionHeaderInterface): [ElfDynamicEntry[] | null, number, number] {
        let last_offset = 0;
        
        /*
        The .dynamic section contains a series of structures
        that hold relevant dynamic linking information.
        
        This function processes the .dynamic section.
        */
        
        let dynamic = null;
        
        for (const element of elfSectionHeader.elfSectionHeader) {
            if (element.sh_type.value == "SHT_DYNAMIC") {
                dynamic = element;
            }
        }
        
        // check if dynamic section even exists, if not, return null
        if (dynamic == null) {
            return [null, 0, 0];
        }

        let first_offset = dynamic.sh_offset.raw_dec;
        
        // get number of entries in dynamic section
        let dynamic_entries_number = dynamic.sh_size.raw_dec / dynamic.sh_entsize.raw_dec;
        
        let dynamic_entries = [];
        
        for (let dynamic_entry_count = 0; dynamic_entry_count < dynamic_entries_number; dynamic_entry_count++) {
            
            // calculate offset
            let dynamic_offset = dynamic.sh_offset.raw_dec + (dynamic_entry_count * dynamic.sh_entsize.raw_dec);
            
            let dtype = 0;
            const dataReader = new ElfDataReader(new DataView(buffer, 0, buffer.byteLength), this.bit, this.endianness, dynamic_offset);

            /*
            The d_tag member controls the interpretation of the d_un entry
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Sword : Elf64Types.Elf_Sxword;
            const d_tag = dataReader.readData("d_tag", dtype, elf_dynamic.d_tag);
            
            /*
            This member can either represent integer values with various interpretations (d_val)
            or represent program virtual addresses.  When interpreting these addresses, the actual address should
            be computed based on the original file value and memory base address.  Files do not contain relocation entries to
            fixup these addresses.
            */
            dtype = this.bit == 32 ? Elf32Types.Elf_Sword : Elf64Types.Elf_Xword;
            const d_un = dataReader.readData("d_un", dtype);
            d_un.value = this.assignFlagValues(d_tag, d_un);
            
            let dynamic_entry = {
                d_tag: d_tag,
                d_un: d_un
            };
            
            dynamic_entries.push(dynamic_entry);

            last_offset = dataReader.offset;
        }
        
        return [dynamic_entries, first_offset, last_offset];
        
    }
    
    private assignFlagValues(d_tag : ElfData, d_un : ElfData) {
        
        if (d_tag.value == "DT_FLAGS") {
            // DT_FLAGS
            d_un.value = this.parseFlagBits("DT_FLAGS", Number(d_un.value));
        } else if (d_tag.value == "DT_FLAGS_1") {
            // DT_FLAGS_1
            d_un.value = this.parseFlagBits("DT_FLAGS_1", Number(d_un.value));
        } else if (d_tag.value == "DT_POSFLAG_1") {
            // DT_POSFLAG_1
            d_un.value = this.parseFlagBits("DT_POSFLAG_1", Number(d_un.value));
        } else if (d_tag.value == "DT_FEATURE") {
            // DT_FEATURE
            d_un.value = this.parseFlagBits("DT_FEATURE", Number(d_un.value));
        } else if (d_tag.value == "DT_GNU_FLAGS_1") {
            // DT_GNU_FLAGS_1
            d_un.value = this.parseFlagBits("DT_GNU_FLAGS_1", Number(d_un.value));
        }
        
        return d_un.value;
        
    }
    
    private parseFlagBits(flag_type : string, d_un_val : number) {
        
        let flags = [];
        
        while (d_un_val) {
            
            // isolates the least significant set bit im d_un_val
            const flag = d_un_val & -d_un_val;
            
            // clears the least significant set bit in flag
            d_un_val &= ~flag;
            
            // switch based on flag type
            switch (flag_type) {
                case "DT_FLAGS":
                flags.push(DT_FLAGS[flag]);
                break;
                case "DT_FLAGS_1":
                flags.push(DT_FLAGS_1[flag]);
                break;
                case "DT_POSFLAG_1":
                flags.push(DT_POSFLAG_1[flag]);
                break;
                case "DT_FEATURE":
                flags.push(DT_FEATURE[flag]);
                break;
                case "DT_GNU_FLAGS_1":
                flags.push(DT_GNU_FLAGS_1[flag]);
                break;
            }
        }
        
        return flags;
    }
}