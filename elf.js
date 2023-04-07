function ELF(){}

ELF.prototype.loadFile = function(file){
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (event) => {
            resolve(event.target.result);
        };
    });
};

ELF.prototype.parseELF = function(arrayBuffer){
    
    this.file_length = arrayBuffer.byteLength;
    
    this.elfFile = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
    
    try{
        this.e_ident = this.processEIdent();
    }catch(error){
        console.log(error);
    }
    
    // check if file is lsb or msb
    this.is_lsb = this.e_ident.EI_DATA.value == "ELFDATA2LSB" ? true : false;
    // check if file is 64 or 32 bit architecture
    this.is_64 = this.e_ident.EI_CLASS.value == "ELFCLASS64" ? true : false;
    // assign correct data types depending on bit-architecture
    this.data_types = this.is_64 ? elf_base_types[64] : elf_base_types[32];
    
    this.elf_contents = {}
    this.elf_contents.e_ident = this.e_ident;
    this.elf_contents.elf_hdr = this.processElfHdr()
    this.elf_contents.elf_phdr = this.processElfPhdr()
    this.elf_contents.elf_shdr = this.processElfShdr();
    this.elf_contents.elf_dyn = this.processElfDyn();
    this.elf_contents.elf_symtab = this.processElfSymtab();
    this.elf_contents.elf_dynsymtab = this.processElfDynSymtab();
    
    
};

ELF.prototype.processEIdent = function(){
    
    var eident_offset = 0;
    
    /*
    The first byte of the magic number.  It must be filled with ELFMAG0.  (0: 0x7f) 
    */
    const EI_MAG0 = {
        value : this.elfFile.getUint8(eident_offset),
        raw_dec : this.elfFile.getUint8(eident_offset).toString(),
        raw_hex : this.elfFile.getUint8(eident_offset).toString(16),
        size_bytes : 1,
        offset : eident_offset,
        name : "EI_MAG0"
    };
    // move forward one byte in the e_ident array
    eident_offset += 1; 
    
    /*
    The second byte of the magic number.  It must be filled with ELFMAG1.  (1: 'E')
    */
    const EI_MAG1 = {
        value : this.elfFile.getUint8(eident_offset),
        raw_dec : this.elfFile.getUint8(eident_offset).toString(),
        raw_hex : this.elfFile.getUint8(eident_offset).toString(16),
        size_bytes : 1,
        offset : eident_offset,
        name : "EI_MAG1"
    };
    eident_offset += 1;
    
    /*
    The third byte of the magic number.  It must be filled with ELFMAG2.  (2: 'L')
    */
    const EI_MAG2 = {
        value : this.elfFile.getUint8(eident_offset),
        raw_dec : this.elfFile.getUint8(eident_offset).toString(),
        raw_hex : this.elfFile.getUint8(eident_offset).toString(16),
        size_bytes : 1,
        offset : eident_offset,
        name : "EI_MAG2"
    };
    eident_offset += 1;
    
    /*
    The fourth byte of the magic number.  It must be filled with ELFMAG3.  (3: 'F')
    */
    const EI_MAG3 = {
        value : this.elfFile.getUint8(eident_offset),
        raw_dec : this.elfFile.getUint8(eident_offset).toString(),
        raw_hex : this.elfFile.getUint8(eident_offset).toString(16),
        size_bytes : 1,
        offset : eident_offset,
        name : "EI_MAG3"
    };
    eident_offset += 1;
    
    // check if magic numbers are correct, if not, abort
    if(EI_MAG0.value != 127 ||  EI_MAG1.value != 69 || EI_MAG2.value != 76 || EI_MAG3.value != 70){
        const err = new Error("This does not appear to be an ELF-Binary - Magic numbers are wrong")
        throw err;
    }
    
    /* 
    ToDo: 
    readelf.c:check_magic_number checks for other file types (e.g. llvm and go)
    and suggest other tools - maybe do the same here!
    */
    
    
    /*
    The fifth byte identifies the architecture for this binary:
    */
    const EI_CLASS = {
        value : e_ident.EI_CLASS[this.elfFile.getUint8(eident_offset)],
        raw_dec : this.elfFile.getUint8(eident_offset).toString(),
        raw_hex : this.elfFile.getUint8(eident_offset).toString(16),
        size_bytes : 1,
        offset : eident_offset,
        name : "EI_CLASS"
    };
    eident_offset += 1;
    
    // check if class is invalid, if yes, abort
    if(EI_CLASS.value == "ELFCLASSNONE" || EI_CLASS.value == null){
        const err = new Error("None or invalid ELF-File Class: " + EI_CLASS.value);
        throw err;
    }
    
    /*
    The sixth byte specifies the data encoding of the processor-specific data in the file.
    */
    const EI_DATA = {
        value : e_ident.EI_DATA[this.elfFile.getUint8(eident_offset)],
        raw_dec : this.elfFile.getUint8(eident_offset).toString(),
        raw_hex : this.elfFile.getUint8(eident_offset).toString(16),
        size_bytes : 1,
        offset : eident_offset,
        name : "EI_DATA"
    };
    eident_offset += 1;
    
    // check if data encoding is invalid, if yes, abort
    if(EI_DATA.value == "ELFDATANONE" || EI_DATA.value == null){
        const err = new Error("None or invalid ELF-File Data Encoding: " + EI_DATA.value);
        throw err;
    }
    
    /*
    The seventh byte is the version number of the ELF specification:
    */
    const EI_VERSION = {
        value : e_ident.EI_VERSION[this.elfFile.getUint8(eident_offset)],
        raw_dec : this.elfFile.getUint8(eident_offset).toString(),
        raw_hex : this.elfFile.getUint8(eident_offset).toString(16),
        size_bytes : 1,
        offset : eident_offset,
        name : "EI_VERSION"
    };
    eident_offset += 1;
    
    /*
    The  eighth byte identifies the operating system and ABI to which the 
    object is targeted. Some fields in other ELF structures have flags 
    and values that have platform-specific meanings; the interpretation 
    of those fields is determined by the value of this byte.
    */
    const EI_OSABI = {
        value : e_ident.EI_OSABI[this.elfFile.getUint8(eident_offset)],
        raw_dec : this.elfFile.getUint8(eident_offset).toString(),
        raw_hex : this.elfFile.getUint8(eident_offset).toString(16),
        size_bytes : 1,
        offset : eident_offset,
        name : "EI_OSABI"
    };
    eident_offset += 1;
    
    /*
    The ninth byte identifies the version of the ABI to which the 
    object is targeted. This field is used to distinguish among 
    incompatible versions of an  ABI. The  interpretation  of
    this version number is dependent on the ABI identified by the 
    EI_OSABI field. Applications conforming to this specification use the value 0
    */
    const EI_ABIVERSION = {
        value : this.elfFile.getUint8(eident_offset),
        raw_dec : this.elfFile.getUint8(eident_offset).toString(),
        raw_hex : this.elfFile.getUint8(eident_offset).toString(16),
        size_bytes : 1,
        offset : eident_offset,
        name : "EI_ABIVERSION"
    };
    eident_offset += 1;
    
    
    /*
    Start of padding. These bytes are reserved and set to zero.  
    Programs which read them should ignore them.  
    The value for EI_PAD will change in the future if currently unused bytes
    are given meanings.
    */
    const EI_PAD = {
        value : this.elfFile.getUint8(eident_offset),
        raw_dec : this.elfFile.getUint8(eident_offset).toString(),
        raw_hex : this.elfFile.getUint8(eident_offset).toString(16),
        size_bytes : 6, //its actually just one byte but we need this for padding up to offset 15
        offset : eident_offset,
        name : "EI_PAD"
    };
    eident_offset = 15;
    
    /*
    The size of the e_ident array.
    */
    const EI_NIDENT = {
        value : this.elfFile.getUint8(eident_offset),
        raw_dec : this.elfFile.getUint8(eident_offset).toString(),
        raw_hex : this.elfFile.getUint8(eident_offset).toString(16),
        size_bytes : 1,
        offset : eident_offset,
        name : "EI_NIDENT"
    };
    
    
    return{
        EI_MAG0 : EI_MAG0,
        EI_MAG1 : EI_MAG1,
        EI_MAG2 : EI_MAG2,
        EI_MAG3 : EI_MAG3,
        EI_CLASS : EI_CLASS,
        EI_DATA : EI_DATA,
        EI_VERSION : EI_VERSION,
        EI_OSABI : EI_OSABI,
        EI_ABIVERSION : EI_ABIVERSION,
        EI_PAD : EI_PAD,
        EI_NIDENT : EI_NIDENT
    }
};


ELF.prototype.processElfHdr32 = function(){
    
};

ELF.prototype.processElfHdr64 = function(){
    
    var hdr_offset = 16;
    
    /* This member of the structure identifies the object file type */
    const e_type = {
        value : elf_hdr.e_type[this.elfFile.getUint16(hdr_offset, this.is_lsb)],
        raw_dec : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(),
        raw_hex : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(16),
        size_bytes : this.data_types.Elf_Half,
        offset : hdr_offset,
        name : "e_type"
    };
    hdr_offset += this.data_types.Elf_Half;
    
    
    /* This member of the structure identifies the object file type */
    const e_machine = {
        value : elf_hdr.e_machine[this.elfFile.getUint16(hdr_offset, this.is_lsb)],
        raw_dec : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(),
        raw_hex : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(16),
        size_bytes : this.data_types.Elf_Half,
        offset : hdr_offset,
        name : "e_machine"
    };
    hdr_offset += this.data_types.Elf_Half;
    
    /* This member of the structure identifies the object file type */
    const e_version = {
        value : elf_hdr.e_version[this.elfFile.getUint16(hdr_offset, this.is_lsb)],
        raw_dec : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(),
        raw_hex : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(16),
        size_bytes : this.data_types.Elf_Word,
        offset : hdr_offset,
        name : "e_version"
    };
    hdr_offset += this.data_types.Elf_Word;
    
    /* 
    This member gives the virtual address to which the system first 
    transfers control, thus starting the process.  
    If the file has no associated entry point, this member holds zero.
    */
    const e_entry = {
        value : Number(this.elfFile.getBigUint64(hdr_offset, this.is_lsb)),
        raw_dec : Number(this.elfFile.getBigUint64(hdr_offset, this.is_lsb)).toString(),
        raw_hex : Number(this.elfFile.getBigUint64(hdr_offset, this.is_lsb)).toString(16),
        size_bytes : this.data_types.Elf_Addr,
        offset : hdr_offset,
        name : "e_entry"
    };
    hdr_offset += this.data_types.Elf_Addr;
    
    /* 
    This member holds the program header table's file offset in bytes.  
    If the file has no program header table, this member holds zero. 
    */
    const e_phoff = {
        value : Number(this.elfFile.getBigUint64(hdr_offset, this.is_lsb)),
        raw_dec : Number(this.elfFile.getBigUint64(hdr_offset, this.is_lsb)).toString(),
        raw_hex : Number(this.elfFile.getBigUint64(hdr_offset, this.is_lsb)).toString(16),
        size_bytes : this.data_types.Elf_Off,
        offset : hdr_offset,
        name : "e_phoff"
    };
    hdr_offset += this.data_types.Elf_Off;
    
    /*
    This member holds the section header table's file offset in bytes.  
    If the file has no section header table, this member holds zero.
    */
    const e_shoff = {
        value : Number(this.elfFile.getBigUint64(hdr_offset, this.is_lsb)),
        raw_dec : Number(this.elfFile.getBigUint64(hdr_offset, this.is_lsb)).toString(),
        raw_hex : Number(this.elfFile.getBigUint64(hdr_offset, this.is_lsb)).toString(16),
        size_bytes : this.data_types.Elf_Off,
        offset : hdr_offset,
        name : "e_shoff"
    };
    hdr_offset += this.data_types.Elf_Off;
    
    /* 
    This member holds processor-specific flags associated with the file.  
    Flag names take the form EF_`machine_flag'.  Currently, no flags have been defined.
    */
    const e_flags = {
        value : this.elfFile.getUint32(hdr_offset, this.is_lsb),
        raw_dec : this.elfFile.getUint32(hdr_offset, this.is_lsb).toString(),
        raw_hex : this.elfFile.getUint32(hdr_offset, this.is_lsb).toString(16),
        size_bytes : this.data_types.Elf_Word,
        offset : hdr_offset,
        name : "e_flags"
    };
    hdr_offset += this.data_types.Elf_Word;
    
    /* 
    This member holds the ELF header's size in bytes.
    */
    const e_ehsize = {
        value : this.elfFile.getUint16(hdr_offset, this.is_lsb),
        raw_dec : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(),
        raw_hex : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(16),
        size_bytes : this.data_types.Elf_Half,
        offset : hdr_offset,
        name : "e_ehsize"
    };
    hdr_offset += this.data_types.Elf_Half;
    
    /* 
    This member holds the size in bytes of one entry in the file's program header table; 
    all entries are the same size.
    */
    const e_phentsize = {
        value : this.elfFile.getUint16(hdr_offset, this.is_lsb),
        raw_dec : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(),
        raw_hex : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(16),
        size_bytes : this.data_types.Elf_Half,
        offset : hdr_offset,
        name : "e_phentsize"
    };
    hdr_offset += this.data_types.Elf_Half;
    
    /* 
    This member holds the number of entries in the program header table.  
    Thus the product of e_phentsize and e_phnum gives the table's size in bytes.  
    If a file has no program header,  e_phnum holds the value zero.
    */
    var e_phnum = {
        value : this.elfFile.getUint16(hdr_offset, this.is_lsb),
        raw_dec : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(),
        raw_hex : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(16),
        size_bytes : this.data_types.Elf_Half,
        offset : hdr_offset,
        name : "e_phnum"
    };
    hdr_offset += this.data_types.Elf_Half;
    
    /*
    If the number of entries in the program header table is larger than or equal to 
    PN_XNUM (0xffff), this member holds PN_XNUM (0xffff) and the real number of 
    entries in the program header table is held in the sh_info member of the initial 
    entry in section header table. 
    */
    
    if(e_phnum >= elf_hdr["PN_XNUM"]){
        e_phnum = elf_hdr.e_phnum[0xffff]; //PN_XNUM
    }
    
    /* 
    This member holds a sections header's size in bytes.  
    A section header is one entry in the section header table; 
    all entries are the same size.
    */
    const e_shentsize = {
        value : this.elfFile.getUint16(hdr_offset, this.is_lsb),
        raw_dec : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(),
        raw_hex : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(16),
        size_bytes : this.data_types.Elf_Half,
        offset : hdr_offset,
        name : "e_shentsize"
    };
    hdr_offset += this.data_types.Elf_Half;
    
    /* 
    This member holds the number of entries in the section header table.  
    Thus the product of e_shentsize and e_shnum gives the section header table's size in bytes.  
    If a file has  no  section header table, e_shnum holds the value of zero.
    */
    var e_shnum = {
        value : this.elfFile.getUint16(hdr_offset, this.is_lsb),
        raw_dec : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(),
        raw_hex : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(16),
        size_bytes : this.data_types.Elf_Half,
        offset : hdr_offset,
        name : "e_shnum"
    };
    hdr_offset += this.data_types.Elf_Half;
    
    /*
    If the number of entries in the section header table is larger than or equal to 
    SHN_LORESERVE (0xff00), e_shnum holds the value zero and the real number of entries 
    in the section header table is held in the sh_size member of the initial 
    entry in section header table.  
    */
    
    if(e_shnum >= elf_hdr["SHN_LORESERVE"]){
        e_shnum = 0;
    }
    
    /* 
    This member holds the section header table index of the entry 
    associated with the section name string table. 
    */
    var e_shstrndx = {
        value : this.elfFile.getUint16(hdr_offset, this.is_lsb),
        raw_dec : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(),
        raw_hex : this.elfFile.getUint16(hdr_offset, this.is_lsb).toString(16),
        size_bytes : this.data_types.Elf_Half,
        offset : hdr_offset,
        name : "e_shstrndx"
    };
    hdr_offset += this.data_types.Elf_Half;
    
    /*
    If the file has no section name string  table,  this  member  holds  the  value
    SHN_UNDEF.
    
    If the index of section name string table section is larger than or equal to 
    SHN_LORESERVE (0xff00), this member holds SHN_XINDEX (0xffff) and the real index 
    of the section name string table section is held in the sh_link member of 
    the initial entry in section header table.  
    */
    
    if(e_shstrndx == elf_hdr["SHN_UNDEF"]){
        e_shstrndx = elf_hdr.e_shstrndx[0]; //SHN_UNDEF
    }else if(e_shstrndx >= elf_hdr["SHN_LORESERVE"]){
        e_shstrndx = elf_hdr.e_shstrndx[0xffff]; // SHN_XINDEX
    }
    
    
    return{
        e_type : e_type,
        e_machine : e_machine,
        e_version : e_version,
        e_entry : e_entry,
        e_phoff : e_phoff,
        e_shoff : e_shoff,
        e_flags : e_flags,
        e_ehsize : e_ehsize,
        e_phentsize : e_phentsize,
        e_phnum : e_phnum,
        e_shentsize : e_shentsize,
        e_shnum : e_shnum,
        e_shstrndx : e_shstrndx
    }
};

ELF.prototype.processElfPhdr32 = function(){
    
};

ELF.prototype.processElfPhdr64 = function(){
    
    var phdr_entries = [];
    
    for(var phdr_entry_count = 0; phdr_entry_count < this.elf_contents.elf_hdr.e_phnum.value; phdr_entry_count++){
        
        var phdr_entry_offset = this.elf_contents.elf_hdr.e_phoff.value + phdr_entry_count * this.elf_contents.elf_hdr.e_phentsize.value;
        
        /*
        This member of the structure indicates what kind of segment this array element 
        describes or how to interpret the array element's information.
        */
        const p_type = {
            value : elf_phdr.p_type[this.elfFile.getUint32(phdr_entry_offset, this.is_lsb)],
            raw_dec : this.elfFile.getUint32(phdr_entry_offset, this.is_lsb).toString(),
            raw_hex : this.elfFile.getUint32(phdr_entry_offset, this.is_lsb).toString(16),
            size_bytes : this.data_types.Elf_Word,
            offset : phdr_entry_offset,
            name : "p_type"
        };
        phdr_entry_offset += this.data_types.Elf_Word;
        
        
        /*
        This member holds a bit mask of flags relevant to the segment:
        */
        const p_flags = {
            value : this.getSetFlags(this.elfFile.getUint32(phdr_entry_offset, this.is_lsb), elf_phdr.p_flags),
            raw_dec : this.elfFile.getUint32(phdr_entry_offset, this.is_lsb).toString(),
            raw_hex : this.elfFile.getUint32(phdr_entry_offset, this.is_lsb).toString(16),
            size_bytes : this.data_types.Elf_Word,
            offset : phdr_entry_offset,
            name : "p_flags"
        };
        phdr_entry_offset += this.data_types.Elf_Word;
        
        
        /*
        This member holds the offset from the beginning of the file at which the first byte of the segment resides.
        */
        const p_offset = {
            value : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)),
            raw_dec : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)).toString(),
            raw_hex : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)).toString(16),
            size_bytes : this.data_types.Elf_Off,
            offset : phdr_entry_offset,
            name : "p_offset"
        };
        phdr_entry_offset += this.data_types.Elf_Off;
        
        
        /*
        This member holds the virtual address at which the first byte of the segment resides in memory.
        */
        const p_vaddr = {
            value : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)),
            raw_dec : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)).toString(),
            raw_hex : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)).toString(16),
            size_bytes : this.data_types.Elf_Addr,
            offset : phdr_entry_offset,
            name : "p_vaddr"
        };
        phdr_entry_offset += this.data_types.Elf_Addr;
        
        
        /*
        On systems for which physical addressing is relevant, this member is reserved for the segment's physical address.  
        Under BSD this member is not used and must be zero.
        */
        const p_paddr = {
            value : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)),
            raw_dec : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)).toString(),
            raw_hex : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)).toString(16),
            size_bytes : this.data_types.Elf_Addr,
            offset : phdr_entry_offset,
            name : "p_paddr"
        };
        phdr_entry_offset += this.data_types.Elf_Addr;
        
        
        /*
        This member holds the number of bytes in the file image of the segment.  It may be zero.
        */
        const p_filesz = {
            value : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)),
            raw_dec : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)).toString(),
            raw_hex : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)).toString(16),
            size_bytes : this.data_types.Elf_Addr,
            offset : phdr_entry_offset,
            name : "p_filesz"
        };
        phdr_entry_offset += this.data_types.Elf_Xword;
        
        
        /*
        This member holds the number of bytes in the memory image of the segment.  It may be zero.
        */
        const p_memsz = {
            value : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)),
            raw_dec : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)).toString(),
            raw_hex : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)).toString(16),
            size_bytes : this.data_types.Elf_Addr,
            offset : phdr_entry_offset,
            name : "p_memsz"
        };
        phdr_entry_offset += this.data_types.Elf_Xword;
        
        
        /*
        This  member  holds  the  value  to which the segments are aligned in memory and in the file.  
        Loadable process segments must have congruent values for p_vaddr and p_offset, modulo the page
        size. Values of zero and one mean no alignment is required.
        Otherwise, p_align should be a positive, integral power of two, and p_vaddr should equal p_offset, modulo p_align.
        */
        const p_align = {
            value : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)),
            raw_dec : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)).toString(),
            raw_hex : Number(this.elfFile.getBigUint64(phdr_entry_offset, this.is_lsb)).toString(16),
            size_bytes : this.data_types.Elf_Addr,
            offset : phdr_entry_offset,
            name : "p_align"
        };
        phdr_entry_offset += this.data_types.Elf_Xword;
        
        var phdr_entry = {
            p_type : p_type,
            p_flags : p_flags,
            p_offset : p_offset,
            p_vaddr : p_vaddr,
            p_paddr : p_paddr,
            p_filesz : p_filesz,
            p_memsz : p_memsz,
            p_align : p_align
        };
        
        phdr_entries.push(phdr_entry);
        
    }
    
    return phdr_entries;
    
};

ELF.prototype.getSectionHeaderString = function(offset) {
    
    // Initialize an array to store the characters
    var chars = [];
    
    // Read the first character from the given offset in the ELF file
    var currentChar = this.elfFile.getUint8(offset, this.is_lsb);
    
    // Initialize an offset counter to track the read position
    var offsetCounter = 0;
    
    // Continue reading characters until a null byte (0) is encountered
    while (currentChar !== 0) {
        // Add the current character to the array
        chars.push(String.fromCharCode(currentChar));
        
        // Increment the offset counter
        offsetCounter++;
        
        // Read the next character from the ELF file
        currentChar = this.elfFile.getUint8(offset + offsetCounter, this.is_lsb);
    }
    
    // Join the characters into a string and return the result
    return chars.join("");
}

ELF.prototype.processElfShdr32 = function(){
    // elf32_shdr and elf64_shdr structs are, member-order-wise, exactly the same
    // so we can just re-use the 64-bit function
    return this.processElfShdr64();
};

ELF.prototype.processElfShdr64 = function(){
    
    /*
    Get .shstrtab-section offset so we can resolve sh_name
    - e_shstrndx contains section header index to .shstrtab (e.g. 36)
    - therefore, e_shstrndx can be used to fetch offset address of 
    actual .shstrtab section (e.g. 0x3eb4)
    - sh_name is then just an index offset (e.g. 27) into the section header string table section
    */
    const shstrtab_entry_offset = this.elf_contents.elf_hdr.e_shoff.value + this.elf_contents.elf_hdr.e_shstrndx.value * this.elf_contents.elf_hdr.e_shentsize.value;
    const shstrtab_sh_offset = Number(this.elfFile.getBigUint64(shstrtab_entry_offset + 24, this.is_lsb));
    
    var shdr_entries = [];
    
    for(var shdr_entry_count = 0; shdr_entry_count < this.elf_contents.elf_hdr.e_shnum.value; shdr_entry_count++){
        
        // calculate shdr_entry offset
        var shdr_entry_offset = this.elf_contents.elf_hdr.e_shoff.value + shdr_entry_count * this.elf_contents.elf_hdr.e_shentsize.value;
        
        /*
        This member specifies the name of the section. 
        Its value is an index into the section header string table section, 
        giving the location of a null-terminated string.
        */
        const sh_name_offset = this.elfFile.getUint32(shdr_entry_offset, this.is_lsb);
        const sh_name = this.getSectionHeaderString(shstrtab_sh_offset + sh_name_offset);
        shdr_entry_offset += this.data_types.Elf_Word;
        
        /*
        This member categorizes the section's contents and semantics.
        */
        const sh_type = elf_shdr.sh_type[this.elfFile.getUint32(shdr_entry_offset, this.is_lsb)];
        shdr_entry_offset += this.data_types.Elf_Word;
        
        /*
        Sections support one-bit flags that describe miscellaneous attributes.  
        If a flag bit is set in sh_flags, the attribute is "on" for the section.  
        Otherwise, the attribute is "off"  or  does not apply.  
        Undefined attributes are set to zero.
        */
        const sh_flags = this.getSetFlags(this.elfFile.getUint32(shdr_entry_offset, this.is_lsb), elf_shdr.sh_flags);
        shdr_entry_offset += this.data_types.Elf_Xword;
        
        /*
        If this section appears in the (virtual) memory image of a process, this member 
        holds the address at which the section's first byte should reside.  
        Otherwise, the member contains zero.
        */
        
        const sh_addr = Number(this.elfFile.getBigUint64(shdr_entry_offset, this.is_lsb));
        shdr_entry_offset += this.data_types.Elf_Addr;
        
        /*
        This  member's value holds the byte offset from the beginning of the file to 
        the first byte in the section. One section type, SHT_NOBITS, occupies no space 
        in the file, and its sh_offset member locates the conceptual placement in the file.
        */
        const sh_offset = Number(this.elfFile.getBigUint64(shdr_entry_offset, this.is_lsb));
        shdr_entry_offset += this.data_types.Elf_Off;
        
        /*
        This member holds the section's size in bytes. Unless the section type is SHT_NOBITS, 
        the section occupies sh_size bytes in the file. A section of type SHT_NOBITS may have a nonzero size,
        but it occupies no space in the file.
        */
        const sh_size = Number(this.elfFile.getBigUint64(shdr_entry_offset, this.is_lsb));
        shdr_entry_offset += this.data_types.Elf_Xword;
        
        /*
        This member holds a section header table index link, whose interpretation depends on the section type.
        */
        const sh_link = this.elfFile.getUint32(shdr_entry_offset, this.is_lsb);
        shdr_entry_offset += this.data_types.Elf_Word;
        
        /*
        This member holds extra information, whose interpretation depends on the section type.
        */
        const sh_info = this.elfFile.getUint32(shdr_entry_offset, this.is_lsb);
        shdr_entry_offset += this.data_types.Elf_Word;
        
        /*
        Some sections have address alignment constraints. If a section holds a doubleword, 
        the system must ensure doubleword alignment for the entire section. That is, the value of sh_addr must
        be congruent to zero, modulo the value of sh_addralign. 
        Only zero and positive integral powers of two are allowed. 
        The value 0 or 1 means that the section has no alignment constraints.
        */
        const sh_addralign = Number(this.elfFile.getBigUint64(shdr_entry_offset, this.is_lsb));
        shdr_entry_offset += this.data_types.Elf_Xword;
        
        /*
        Some sections hold a table of fixed-sized entries, such as a symbol table.  
        For such a section, this member gives the size in bytes for each entry.  
        This member contains zero if the section
        does not hold a table of fixed-size entries.
        */
        const sh_entsize = Number(this.elfFile.getBigUint64(shdr_entry_offset, this.is_lsb));
        shdr_entry_offset += this.data_types.Elf_Xword;
        
        
        var shdr_entry = {
            sh_name : sh_name,
            sh_type : sh_type,
            sh_flags : sh_flags,
            sh_addr : sh_addr,
            sh_offset : sh_offset,
            sh_size : sh_size,
            sh_link : sh_link,
            sh_info : sh_info,
            sh_addralign : sh_addralign,
            sh_entsize : sh_entsize
        };
        
        shdr_entries.push(shdr_entry);
    }
    
    return shdr_entries;
    
    
    
};

ELF.prototype.processElfDyn32 = function(){
    
}

ELF.prototype.processElfDyn64 = function(){
    /*
    The .dynamic section contains a series of structures 
    that hold relevant dynamic linking information.
    
    This function processes the .dynamic section.
    */
    
    var dynamic = null;
    
    for(var i = 0; i < this.elf_contents.elf_shdr.length; i++){
        if(this.elf_contents.elf_shdr[i].sh_type == "SHT_DYNAMIC"){
            dynamic = this.elf_contents.elf_shdr[i];
        }
    }
    
    // check if dynamic section even exists, if not, return null
    if(dynamic == null){
        return null;
    }
    
    // get number of entries in symtable
    var dynamic_entries_number = dynamic.sh_size / dynamic.sh_entsize;
    
    var dynamic_entries = [];
    
    for(var dynamic_entry_count = 0; dynamic_entry_count < dynamic_entries_number; dynamic_entry_count++){
        
        // calculate offset
        var dynamic_offset = dynamic.sh_offset + (dynamic_entry_count * dynamic.sh_entsize);
        
        /*
        The d_tag member controls the interpretation of the d_un entry
        */
        const d_tag = elf_dynamic.d_tag[this.elfFile.getBigInt64(dynamic_offset, this.is_lsb)];
        dynamic_offset += this.data_types.Elf_Sxword;
        
        const d_un = Number(this.elfFile.getBigUint64(dynamic_offset, this.is_lsb));
        dynamic_offset += this.data_types.Elf_Xword;
        
        var dynamic_entry = {
            d_tag : d_tag,
            d_un : d_un
        }
        
        dynamic_entries.push(dynamic_entry);
        
    }
    
    return dynamic_entries;
    
}

ELF.prototype.processElfDynSymtab32 = function(){
    
}

ELF.prototype.processElfDynSymtab64 = function(){
    return this.processElfSymbolTables("SHT_DYNSYM");
}

ELF.prototype.processElfSymtab32 = function(){
    
}

ELF.prototype.processElfSymtab64 = function(){
    return this.processElfSymbolTables("SHT_SYMTAB");
    
}

ELF.prototype.processElfSymbolTables = function(symbol_table_type) {
    
    var symtab = null;
    var strtab_offset = 0; // strtab used for symtab st_name
    
    // get symtab from elf section header
    // to my knowledge, there no other way but to check for 
    // sh_type SHT_SYMTAB to get symbol table 
    // for the dynamic symbols, you could also check the dynamic section
    // for DT_SYMTAB
    for(var i = 0; i < this.elf_contents.elf_shdr.length; i++){
        if(this.elf_contents.elf_shdr[i].sh_type == symbol_table_type){
            symtab = this.elf_contents.elf_shdr[i];
            strtab_offset = this.elf_contents.elf_shdr[symtab.sh_link].sh_offset;
            
        }
    }
    
    // Handle if no symtab section present (e.g. if not compiled with -g flag in gcc)
    if(symtab == null){
        return null;
    }
    
    // check if sh_size is 0 or sh_size is greater than entire file size, if yes, abort
    if(symtab.sh_size == 0 || symtab.sh_size > this.file_length){
        const err = new Error("symbol table section size error: " + symtab.sh_size);
        return err;
    }
    
    // check if sh_entsize is 0 or if sh_entsize is greater than sh_size, if yes, abort
    if(symtab.sh_entsize == 0 || symtab.sh_entsize > symtab.sh_size){
        const err = new Error("symbol table section table member size error: " + symtab.sh_entsize);
        return err;
    }
    
    // get number of entries in symtable
    var symtab_entries_number = symtab.sh_size / symtab.sh_entsize;
    
    var symtab_entries = [];
    
    for(var symtab_entry_count = 0; symtab_entry_count < symtab_entries_number; symtab_entry_count++){
        
        // calculate offset
        var symtab_offset = symtab.sh_offset + (symtab_entry_count * symtab.sh_entsize);
        
        /*
        This  member holds an index into the object file's symbol string table, which holds 
        character representations of the symbol names. If the value is nonzero, it represents a 
        string table index that gives the symbol name. Otherwise, the symbol has no name.
        */
        const st_name_offset = this.elfFile.getUint32(symtab_offset, this.is_lsb);
        const st_name = this.getSectionHeaderString(strtab_offset + st_name_offset);
        symtab_offset += this.data_types.Elf_Word;
        
        /*
        This member specifies the symbol's type and binding attributes.
        Its made up of 8 bits, the first four bits represent the type (T) 
        and the last four bits represent the binding (B):
        
        
        bit value | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 | 
        {B,T}     | B   | B  | B  | B  | T | T | T | T |
        Operation |         >> 4       |       &0xF    |
        
        Thus, we do some bit shifting and bitwise operation to get the 
        type and the binding
        */
        
        const st_bind = elf_sym.st_bind[this.elfFile.getUint8(symtab_offset, this.is_lsb) >> 4]; 
        const st_type = elf_sym.st_type[this.elfFile.getUint8(symtab_offset, this.is_lsb) & 0xF];
        symtab_offset += this.data_types.char;
        
        /* 
        This member defines the symbol visibility.
        This controls how a symbol may be accessed once it has
        become part of an executable or shared library.
        
        Its made up of 8 bits but only the first two represent (4 combinations) the visibility (V), thus
        bit value | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 | 
        {V}       | -   | -  | -  | -  | - | - | V | V |
        Operation |            -               |  &0x3 |
        
        */
        const st_other = elf_sym.st_other[this.elfFile.getUint8(symtab_offset, this.is_lsb) & 0x3] ;
        symtab_offset += this.data_types.char;
        
        /*
        Every symbol table entry is "defined" in relation to some section.  
        This member holds the relevant section header table index.
        */
        const st_shndx = this.elfFile.getUint16(symtab_offset, this.is_lsb);
        symtab_offset += this.data_types.Elf_Half;
        
        
        /*
        This member gives the value of the associated symbol.
        This actually points to the address of that symbol if the
        st_type is of FUNC
        */
        const st_value = Number(this.elfFile.getBigUint64(symtab_offset, this.is_lsb));
        symtab_offset += this.data_types.Elf_Addr;
        
        /*
        Many symbols have associated sizes. This member holds zero if the symbol has no size or an unknown size.
        */
        const st_size = Number(this.elfFile.getBigUint64(symtab_offset, this.is_lsb));
        symtab_offset += this.data_types.Elf_Xword;
        
        var symtab_entry = {
            st_name : st_name,
            st_bind : st_bind,
            st_type : st_type,
            st_other : st_other,
            st_shndx : st_shndx,
            st_value : st_value,
            st_size : st_size
        }
        
        symtab_entries.push(symtab_entry);
        
    }
    
    return symtab_entries;
}

/* These functions disassemble and assemble a symbol table st_info field,
which contains the symbol binding and symbol type.  The STB_ and STT_
defines identify the binding and type.  */

ELF.prototype.processByClass = function(functionPrefix) {
    
    const processorSuffix = this.e_ident.EI_CLASS.value == "ELFCLASS64" ? "64" : "32";
    const processorName = `${functionPrefix}${processorSuffix}`;
    
    const processor = this[processorName];
    
    if (processor && typeof processor === 'function') {
        return processor.call(this);
    } else {
        const err = new Error(`Unsupported processor for EI_CLASS '${this.e_ident.EI_CLASS.value}' and prefix '${functionPrefix}'`)
        throw err;
    }
};

ELF.prototype.processElfHdr = function() {
    return this.processByClass('processElfHdr');
};

ELF.prototype.processElfPhdr = function() {
    return this.processByClass('processElfPhdr');
};

ELF.prototype.processElfShdr = function() {
    return this.processByClass('processElfShdr');
};

ELF.prototype.processElfDyn = function() {
    return this.processByClass('processElfDyn');
};

ELF.prototype.processElfSymtab = function() {
    return this.processByClass('processElfSymtab');
};

ELF.prototype.processElfDynSymtab = function() {
    return this.processByClass('processElfDynSymtab');
};



ELF.prototype.getFlagName = function(bitmask, currentFlag, flags) {
    return (bitmask & currentFlag) !== 0 ? flags[currentFlag] : null;
}

ELF.prototype.getSetFlags = function(bitmask, flags) {
    const setFlags = [];
    for (const currentFlag in flags) {
        const flagName = this.getFlagName(bitmask, currentFlag, flags);
        if (flagName) {
            setFlags.push(flagName);
        }
    }
    return setFlags;
}


ELF.prototype.run = function(file){
    
    return this.loadFile(file).then((arrayBuffer) => {
        this.parseELF(arrayBuffer);
        return this;
    });
}


