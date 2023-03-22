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

    const elfFile = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
    
    this.e_ident = this.processEIdent(elfFile);
    this.is_lsb = this.e_ident.EI_DATA == "ELFDATA2LSB" ? true : false;
    
    this.elf_hdr = this.processElfHdr(elfFile);
    this.elf_phdr = this.processElfPhdr(elfFile);
    this.elf_shdr = this.processElfShdr(elfFile);
};

ELF.prototype.processEIdent = function(elfFile){
    
    const EI_MAG0 = elfFile.getUint8(0);
    const EI_MAG1 = elfFile.getUint8(1);
    const EI_MAG2 = elfFile.getUint8(2);
    const EI_MAG3 = elfFile.getUint8(3);
    const EI_CLASS = e_ident.EI_CLASS[elfFile.getUint8(4)];
    const EI_DATA = e_ident.EI_DATA[elfFile.getUint8(5)];
    const EI_VERSION = e_ident.EI_VERSION[elfFile.getUint8(6)];
    const EI_OSABI = e_ident.EI_OSABI[elfFile.getUint8(7)];
    const EI_ABIVERSION = elfFile.getUint8(8);
    const EI_NIDENT = elfFile.getUint8(15);
    
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
        EI_NIDENT : EI_NIDENT
    }
};


ELF.prototype.processElfHdr32 = function(elfFile){
    
};

ELF.prototype.processElfHdr64 = function(elfFile){
    
    /* This member of the structure identifies the object file type */
    const e_type = elf_hdr.e_type[elfFile.getUint16(16, this.is_lsb)];

    /* This member of the structure identifies the object file type */
    const e_machine = elf_hdr.e_machine[elfFile.getUint16(18, this.is_lsb)];

    /* This member of the structure identifies the object file type */
    const e_version = elf_hdr.e_version[elfFile.getUint32(20, this.is_lsb)]; 

    /* 
    This member gives the virtual address to which the system first 
    transfers control, thus starting the process.  
    If the file has no associated entry point, this member holds zero.
    */
    const e_entry = Number(elfFile.getBigUint64(24, this.is_lsb)); 

    /* 
    This member holds the program header table's file offset in bytes.  
    If the file has no program header table, this member holds zero. 
    */
    const e_phoff = Number(elfFile.getBigUint64(32, this.is_lsb));

    /*
    This member holds the section header table's file offset in bytes.  
    If the file has no section header table, this member holds zero.
    */
    const e_shoff = Number(elfFile.getBigUint64(40, this.is_lsb));

    /* 
    This member holds processor-specific flags associated with the file.  
    Flag names take the form EF_`machine_flag'.  Currently, no flags have been defined.
    */
    const e_flags = elfFile.getUint32(48, this.is_lsb);

    /* 
    This member holds the ELF header's size in bytes.
    */
    const e_ehsize = elfFile.getUint16(52, this.is_lsb);

    /* 
    This member holds the size in bytes of one entry in the file's program header table; 
    all entries are the same size.
    */
    const e_phentsize = elfFile.getUint16(54, this.is_lsb);

    /* 
    This member holds the number of entries in the program header table.  
    Thus the product of e_phentsize and e_phnum gives the table's size in bytes.  
    If a file has no program header,  e_phnum holds the value zero.
    */
    var e_phnum = elfFile.getUint16(56, this.is_lsb);

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
    const e_shentsize = elfFile.getUint16(58, this.is_lsb);

    /* 
    This member holds the number of entries in the section header table.  
    Thus the product of e_shentsize and e_shnum gives the section header table's size in bytes.  
    If a file has  no  section header table, e_shnum holds the value of zero.
    */
    var e_shnum = elfFile.getUint16(60, this.is_lsb);

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
    var e_shstrndx = elfFile.getUint16(62, this.is_lsb);

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

ELF.prototype.processElfPhdr32 = function(elfFile){
    
};

ELF.prototype.processElfPhdr64 = function(elfFile){
    
    var phdr_entries = [];
    
    for(var phdr_entry_count = 0; phdr_entry_count < this.elf_hdr.e_phnum; phdr_entry_count++){
        var phdr_entry_offset = this.elf_hdr.e_phoff + phdr_entry_count * this.elf_hdr.e_phentsize;
        
        const p_type = elf_phdr.p_type[elfFile.getUint32(phdr_entry_offset, this.is_lsb)];
        const p_flags = this.getSetFlags(elfFile.getUint32(phdr_entry_offset + 4, this.is_lsb), elf_phdr.p_flags);
        const p_offset = Number(elfFile.getBigUint64(phdr_entry_offset + 8, this.is_lsb));		/* Segment file offset */
        const p_vaddr = Number(elfFile.getBigUint64(phdr_entry_offset + 16, this.is_lsb));		/* Segment virtual address */
        const p_paddr = Number(elfFile.getBigUint64(phdr_entry_offset + 24, this.is_lsb));	    /* Segment physical address */
        const p_filesz = Number(elfFile.getBigUint64(phdr_entry_offset + 32, this.is_lsb));	    /* Segment size in file */
        const p_memsz = Number(elfFile.getBigUint64(phdr_entry_offset + 40, this.is_lsb));		/* Segment size in memory */
        const p_align = Number(elfFile.getBigUint64(phdr_entry_offset + 48, this.is_lsb));		/* Segment alignment, file & memory */
        
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

ELF.prototype.getSectionHeaderString = function(elfFile, offset) {
    
    // Initialize an array to store the characters
    var chars = [];

    // Read the first character from the given offset in the ELF file
    var currentChar = elfFile.getUint8(offset, this.is_lsb);

    // Initialize an offset counter to track the read position
    var offsetCounter = 0;

    // Continue reading characters until a null byte (0) is encountered
    while (currentChar !== 0) {
        // Add the current character to the array
        chars.push(String.fromCharCode(currentChar));

        // Increment the offset counter
        offsetCounter++;

        // Read the next character from the ELF file
        currentChar = elfFile.getUint8(offset + offsetCounter, this.is_lsb);
    }

    // Join the characters into a string and return the result
    return chars.join("");
}

ELF.prototype.processElfShdr32 = function(elfFile){
    
};

ELF.prototype.processElfShdr64 = function(elfFile){

    /*
    Get .shstrtab - section offset so we can resolve sh_name
    - e_shstrndx contains section header index to .shstrtab (e.g. 36)
    - therefore, e_shstrndx can be used to fetch offset address of 
      actual .shstrtab section (e.g. 0x3eb4)
    - sh_name is then just an index offset into the section header string table section
    */
    const shstrtab_entry_offset = this.elf_hdr.e_shoff + this.elf_hdr.e_shstrndx * this.elf_hdr.e_shentsize;
    const shstrtab_sh_offset = Number(elfFile.getBigUint64(shstrtab_entry_offset + 24, this.is_lsb));

    
    var shdr_entries = [];
    
    for(var shdr_entry_count = 0; shdr_entry_count < this.elf_hdr.e_shnum; shdr_entry_count++){
        
        // calculate shdr_entry offset
        var shdr_entry_offset = this.elf_hdr.e_shoff + shdr_entry_count * this.elf_hdr.e_shentsize;

        /*
        This member specifies the name of the section. 
        Its value is an index into the section header string table section, 
        giving the location of a null-terminated string.
        */
        const sh_name_offset = elfFile.getUint32(shdr_entry_offset, this.is_lsb);
        const sh_name = this.getSectionHeaderString(elfFile, shstrtab_sh_offset + sh_name_offset);

        /*
        This member categorizes the section's contents and semantics.
        */
        const sh_type = elf_shdr.sh_type[elfFile.getUint32(shdr_entry_offset + 4, this.is_lsb)];

        /*
        Sections support one-bit flags that describe miscellaneous attributes.  
        If a flag bit is set in sh_flags, the attribute is "on" for the section.  
        Otherwise, the attribute is "off"  or  does not apply.  
        Undefined attributes are set to zero.
        */
        const sh_flags = this.getSetFlags(elfFile.getUint32(shdr_entry_offset + 8, this.is_lsb), elf_shdr.sh_flags);


        const sh_addr = Number(elfFile.getBigUint64(shdr_entry_offset + 16, this.is_lsb));		/* Section virtual addr at execution */
        const sh_offset = Number(elfFile.getBigUint64(shdr_entry_offset + 24, this.is_lsb));		/* Section file offset */
        const sh_size = Number(elfFile.getBigUint64(shdr_entry_offset + 32, this.is_lsb));		/* Size of section in bytes */
        const sh_link = elfFile.getUint32(shdr_entry_offset + 40, this.is_lsb);		/* Index of another section */
        const sh_info = elfFile.getUint32(shdr_entry_offset + 44, this.is_lsb);	 	/* Additional section information */
        const sh_addralign = Number(elfFile.getBigUint64(shdr_entry_offset + 48, this.is_lsb));	/* Section alignment */
        const sh_entsize = Number(elfFile.getBigUint64(shdr_entry_offset + 56, this.is_lsb));	/* Entry size if section holds table */
        
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

ELF.prototype.processByClass = function(functionPrefix, elfFile) {

    const processorSuffix = this.e_ident.EI_CLASS == "ELFCLASS64" ? "64" : "32";
    const processorName = `${functionPrefix}${processorSuffix}`;
    
    const processor = this[processorName];
    
    if (processor && typeof processor === 'function') {
        return processor.call(this, elfFile);
    } else {
        console.error(`Unsupported processor for EI_CLASS '${this.e_ident.EI_CLASS}' and prefix '${functionPrefix}'`);
    }
};

ELF.prototype.processElfHdr = function(elfFile) {
    return this.processByClass('processElfHdr', elfFile);
};

ELF.prototype.processElfPhdr = function(elfFile) {
    return this.processByClass('processElfPhdr', elfFile);
};

ELF.prototype.processElfShdr = function(elfFile) {
    return this.processByClass('processElfShdr', elfFile);
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


function handleFiles() {
    
    var elf = new ELF();
    elf
    .run(this.files[0])
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    
    const inputElement = document.getElementById("input");
    inputElement.addEventListener("change", handleFiles, false);
    
    
});