import { e_ident, elf_hdr } from "./constants/common";

import { ElfDataReader } from "./ElfReader";

import {
	ElfHeaderInterface,
	ElfHeaderRestInterface,
	ElfBase,
	EIdentEntry,
	Elf32Types,
	Elf64Types,
	ElfBitVersion,
	ElfEndianness,
} from "./ElfBase";

// EI_NIDENT_CONST is typically defined as 16
const EI_NIDENT_CONST: number = 16;

export class ElfHeader extends ElfBase implements ElfHeaderInterface {
	e_ident: EIdentEntry;
	e_entries: ElfHeaderRestInterface;
	
	constructor(buffer: ArrayBuffer) {
		super();
		
		this.e_ident = this.parse_e_ident(buffer);
		
		this.bit = (this.e_ident.EI_CLASS.value == "ELFCLASS32" ? 32 : 64) as ElfBitVersion;
		
		this.endianness = (this.e_ident.EI_DATA.value == "ELFDATA2LSB") as ElfEndianness;
		
		let [e_entries, last_offset] = this.parse_ehdr(buffer);
		this.e_entries = e_entries;
		
		// set data
		this.data = new DataView(buffer, 0, last_offset);
	}
	
	private parse_e_ident(buffer: ArrayBuffer): EIdentEntry {
		const dataReader = new ElfDataReader(new DataView(buffer, 0, EI_NIDENT_CONST - 1), this.bit, this.endianness,0);
		
		/*
		The first byte of the magic number.  It must be filled with ELFMAG0.  (0: 0x7f)
		*/
		const EI_MAG0 = dataReader.readData("EI_MAG0", Elf32Types.char);
		
		/*
		The second byte of the magic number.  It must be filled with ELFMAG1.  (1: 'E')
		*/
		const EI_MAG1 = dataReader.readData("EI_MAG1", Elf32Types.char);
		EI_MAG1.value = String.fromCharCode(EI_MAG1.raw_dec);
		
		/*
		The third byte of the magic number.  It must be filled with ELFMAG2.  (2: 'L')
		*/
		const EI_MAG2 = dataReader.readData("EI_MAG2", Elf32Types.char);
		EI_MAG2.value = String.fromCharCode(EI_MAG2.raw_dec);
		
		/*
		The fourth byte of the magic number.  It must be filled with ELFMAG3.  (3: 'F')
		*/
		const EI_MAG3 = dataReader.readData("EI_MAG3", Elf32Types.char);
		EI_MAG3.value = String.fromCharCode(EI_MAG3.raw_dec);
		
		// check if magic numbers are correct, if not, abort
		if (EI_MAG0.raw_dec != 127 || EI_MAG1.raw_dec != 69 || EI_MAG2.raw_dec != 76 || EI_MAG3.raw_dec != 70) {
			const err = new Error("This does not appear to be an ELF-Binary - Magic numbers are wrong");
			throw err;
		}
		
		/*
		ToDo:
		readelf.c:check_magic_number checks for other file types (e.g. llvm and go)
		and suggest other tools - maybe do the same here!
		*/
		
		/*
		The fifth byte identifies the architecture (32 vs 65 bit) for this binary:
		*/
		const EI_CLASS = dataReader.readData("EI_CLASS", Elf32Types.char,e_ident.EI_CLASS);
		
		// check if class is invalid, if yes, abort
		if (EI_CLASS.value == "ELFCLASSNONE" || EI_CLASS.value == null) {
			const err = new Error("None or invalid ELF-File Class: " + EI_CLASS.value);
			throw err;
		}
		
		/*
		The sixth byte specifies the data encoding of the processor-specific data in the file.
		*/
		const EI_DATA = dataReader.readData("EI_DATA", Elf32Types.char, e_ident.EI_DATA);
		
		// check if data encoding is invalid, if yes, abort
		if (EI_DATA.value == "ELFDATANONE" || EI_DATA.value == null) {
			const err = new Error("None or invalid ELF-File Data Encoding: " + EI_DATA.value);
			throw err;
		}
		
		/*
		The seventh byte is the version number of the ELF specification:
		*/
		const EI_VERSION = dataReader.readData("EI_VERSION", Elf32Types.char, e_ident.EI_VERSION);
		
		/*
		The  eighth byte identifies the operating system and ABI to which the
		object is targeted. Some fields in other ELF structures have flags
		and values that have platform-specific meanings; the interpretation
		of those fields is determined by the value of this byte.
		*/
		const EI_OSABI = dataReader.readData("EI_OSABI", Elf32Types.char, e_ident.EI_OSABI);
		
		/*
		The ninth byte identifies the version of the ABI to which the
		object is targeted. This field is used to distinguish among
		incompatible versions of an  ABI. The  interpretation  of
		this version number is dependent on the ABI identified by the
		EI_OSABI field. Applications conforming to this specification use the value 0
		*/
		const EI_ABIVERSION = dataReader.readData("EI_ABIVERSION", Elf32Types.char);
		
		/*
		Start of padding. These bytes are reserved and set to zero.
		Programs which read them should ignore them.
		The value for EI_PAD will change in the future if currently unused bytes
		are given meanings.
		*/
		const EI_PAD = dataReader.readData("EI_PAD", Elf32Types.Elf_Half);
		
		/*
		The size of the e_ident array.
		*/
		const EI_NIDENT = dataReader.readData("EI_NIDENT", 1);
		
		let e_ident_entries: EIdentEntry = {
			EI_MAG0: EI_MAG0,
			EI_MAG1: EI_MAG1,
			EI_MAG2: EI_MAG2,
			EI_MAG3: EI_MAG3,
			EI_CLASS: EI_CLASS,
			EI_DATA: EI_DATA,
			EI_VERSION: EI_VERSION,
			EI_OSABI: EI_OSABI,
			EI_ABIVERSION: EI_ABIVERSION,
			EI_PAD: EI_PAD,
			EI_NIDENT: EI_NIDENT,
		};
		
		return e_ident_entries;
	}
	
	private parse_ehdr(buffer: ArrayBuffer): [ElfHeaderRestInterface, number] {
		let dtype = 0;
		const dataReader = new ElfDataReader(new DataView(buffer, 0, buffer.byteLength), this.bit, this.endianness, EI_NIDENT_CONST);
		
		/* This member of the structure identifies the object file type */
		dtype = this.bit == 32 ? Elf32Types.Elf_Half : Elf64Types.Elf_Half;
		const e_type = dataReader.readData("e_type", dtype, elf_hdr.e_type);
		
		/* This member of the structure identifies the object file type */
		dtype = this.bit == 32 ? Elf32Types.Elf_Half : Elf64Types.Elf_Half;
		const e_machine = dataReader.readData("e_machine",dtype,elf_hdr.e_machine);
		
		/* This member of the structure identifies the object file type */
		dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
		const e_version = dataReader.readData("e_version",dtype,elf_hdr.e_version);
		
		/*
		This member gives the virtual address to which the system first
		transfers control, thus starting the process.
		If the file has no associated entry point, this member holds zero.
		*/
		dtype = this.bit == 32 ? Elf32Types.Elf_Addr : Elf64Types.Elf_Addr;
		const e_entry = dataReader.readData("e_entry", dtype);
		
		/*
		This member holds the program header table's file offset in bytes.
		If the file has no program header table, this member holds zero.
		*/
		dtype = this.bit == 32 ? Elf32Types.Elf_Off : Elf64Types.Elf_Off;
		const e_phoff = dataReader.readData("e_phoff", dtype);
		
		/*
		This member holds the section header table's file offset in bytes.
		If the file has no section header table, this member holds zero.
		*/
		dtype = this.bit == 32 ? Elf32Types.Elf_Off : Elf64Types.Elf_Off;
		const e_shoff = dataReader.readData("e_shoff", dtype);
		
		/*
		This member holds processor-specific flags associated with the file.
		Flag names take the form EF_`machine_flag'.  Currently, no flags have been defined.
		*/
		dtype = this.bit == 32 ? Elf32Types.Elf_Word : Elf64Types.Elf_Word;
		const e_flags = dataReader.readData("e_flags", dtype);
		
		/*
		This member holds the ELF header's size in bytes.
		*/
		dtype = this.bit == 32 ? Elf32Types.Elf_Half : Elf64Types.Elf_Half;
		const e_ehsize = dataReader.readData("e_ehsize", dtype);
		
		/*
		This member holds the size in bytes of one entry in the file's program header table;
		all entries are the same size.
		*/
		dtype = this.bit == 32 ? Elf32Types.Elf_Half : Elf64Types.Elf_Half;
		const e_phentsize = dataReader.readData("e_phentsize", dtype);
		
		/*
		This member holds the number of entries in the program header table.
		Thus the product of e_phentsize and e_phnum gives the table's size in bytes.
		If a file has no program header,  e_phnum holds the value zero.
		*/
		dtype = this.bit == 32 ? Elf32Types.Elf_Half : Elf64Types.Elf_Half;
		const e_phnum = dataReader.readData("e_phnum", dtype);
		
		/*
		If the number of entries in the program header table is larger than or equal to
		PN_XNUM (0xffff), this member holds PN_XNUM (0xffff) and the real number of
		entries in the program header table is held in the sh_info member of the initial
		entry in section header table.
		*/
		
		if (e_phnum.raw_dec >= elf_hdr["PN_XNUM"]) {
			e_phnum.value = 65535; //PN_XNUM
			e_phnum.raw_dec = 65535; //PN_XNUM
		}
		
		/*
		This member holds a sections header's size in bytes.
		A section header is one entry in the section header table;
		all entries are the same size.
		*/
		dtype = this.bit == 32 ? Elf32Types.Elf_Half : Elf64Types.Elf_Half;
		const e_shentsize = dataReader.readData("e_shentsize", dtype);
		
		/*
		This member holds the number of entries in the section header table.
		Thus the product of e_shentsize and e_shnum gives the section header table's size in bytes.
		If a file has  no  section header table, e_shnum holds the value of zero.
		*/
		dtype = this.bit == 32 ? Elf32Types.Elf_Half : Elf64Types.Elf_Half;
		const e_shnum = dataReader.readData("e_shnum", dtype);
		
		/*
		If the number of entries in the section header table is larger than or equal to
		SHN_LORESERVE (0xff00), e_shnum holds the value zero and the real number of entries
		in the section header table is held in the sh_size member of the initial
		entry in section header table.
		*/
		if (e_shnum.raw_dec >= elf_hdr["SHN_LORESERVE"]) {
			e_shnum.value = 0;
			e_shnum.raw_dec = 0x0;
		}
		
		/*
		This member holds the section header table index of the entry
		associated with the section name string table.
		*/
		dtype = this.bit == 32 ? Elf32Types.Elf_Half : Elf64Types.Elf_Half;
		const e_shstrndx = dataReader.readData("e_shstrndx", dtype);
		
		/*
		If the file has no section name string  table,  this  member  holds  the  value
		SHN_UNDEF.
		
		If the index of section name string table section is larger than or equal to
		SHN_LORESERVE (0xff00), this member holds SHN_XINDEX (0xffff) and the real index
		of the section name string table section is held in the sh_link member of
		the initial entry in section header table.
		*/
		if (e_shstrndx.raw_dec == elf_hdr["SHN_UNDEF"]) {
			e_shstrndx.value = elf_hdr.e_shstrndx[0]; //SHN_UNDEF
		} else if (e_shstrndx.raw_dec >= elf_hdr["SHN_LORESERVE"]) {
			e_shstrndx.value = elf_hdr.e_shstrndx[0xffff]; // SHN_XINDEX
		}
		
		// set members
		let e_entries: ElfHeaderRestInterface = {
			e_type: e_type,
			e_machine: e_machine,
			e_version: e_version,
			e_entry: e_entry,
			e_phoff: e_phoff,
			e_shoff: e_shoff,
			e_flags: e_flags,
			e_ehsize: e_ehsize,
			e_phentsize: e_phentsize,
			e_phnum: e_phnum,
			e_shentsize: e_shentsize,
			e_shnum: e_shnum,
			e_shstrndx: e_shstrndx,
		};
		
		return [e_entries, dataReader.offset];
	}
}
