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
    
    const e_type = elf_hdr.e_type[elfFile.getUint16(16, this.is_lsb)];
    const e_machine = elf_hdr.e_machine[elfFile.getUint16(18, this.is_lsb)];
    const e_version = elf_hdr.e_version[elfFile.getUint32(20, this.is_lsb)];
    const e_entry = Number(elfFile.getBigUint64(24, this.is_lsb));
    const e_phoff = Number(elfFile.getBigUint64(32, this.is_lsb));
    const e_shoff = Number(elfFile.getBigUint64(40, this.is_lsb));
    const e_flags = elfFile.getUint32(48, this.is_lsb);
    const e_ehsize = elfFile.getUint16(52, this.is_lsb);
    const e_phentsize = elfFile.getUint16(54, this.is_lsb);
    const e_phnum = elfFile.getUint16(56, this.is_lsb);
    const e_shentsize = elfFile.getUint16(58, this.is_lsb);
    const e_shnum = elfFile.getUint16(60, this.is_lsb);
    const e_shstrndx = elfFile.getUint16(62, this.is_lsb);
    
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
        const p_flags = elf_phdr.p_flags[elfFile.getUint32(phdr_entry_offset + 4, this.is_lsb)];
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


ELF.prototype.processElfShdr32 = function(elfFile){
    
};

ELF.prototype.processElfShdr64 = function(elfFile){
    
    var shdr_entries = [];
    
    for(var shdr_entry_count = 0; shdr_entry_count < this.elf_hdr.e_shnum; shdr_entry_count++){
        
        var shdr_entry_offset = this.elf_hdr.e_shoff + shdr_entry_count * this.elf_hdr.e_shentsize;

        const sh_name = elfFile.getUint32(shdr_entry_offset, this.is_lsb);	/* Section name, index in string tbl */
        const sh_type = elf_shdr.sh_type[elfFile.getUint32(shdr_entry_offset + 4, this.is_lsb)];		/* Type of section */
        const sh_flags = elf_shdr.sh_flags[elfFile.getUint32(shdr_entry_offset + 8, this.is_lsb)];		/* Miscellaneous section attributes */
        const sh_addr = Number(elfFile.getBigUint64(shdr_entry_offset + 16, this.is_lsb));		/* Section virtual addr at execution */
        const sh_offset = Number(elfFile.getBigUint64(shdr_entry_offset + 24, this.is_lsb));		/* Section file offset */
        const sh_size = Number(elfFile.getBigUint64(shdr_entry_offset + 32, this.is_lsb));		/* Size of section in bytes */
        // const sh_link = ;		/* Index of another section */
        // const sh_info = ;		/* Additional section information */
        // const sh_addralign = ;	/* Section alignment */
        // const sh_entsize = ;	/* Entry size if section holds table */
        
        var shdr_entry = {
            sh_name : sh_name,
            sh_type : sh_type,
            sh_flags : sh_flags,
            sh_addr : sh_addr,
            sh_offset : sh_offset,
            sh_size : sh_size
        };

        console.log(elfFile.getUint32(shdr_entry_offset + 8, this.is_lsb));

        // if(sh_type == null) {
        //     console.log(elfFile.getUint32(shdr_entry_offset + 4, this.is_lsb));
        // }

        shdr_entries.push(shdr_entry);
    }

    return shdr_entries;
    
    
    
};

ELF.prototype.processByClass = function(functionPrefix, elfFile) {
    const processorSuffix = this.e_ident.EI_CLASS;
    const suffixShort = this.e_ident.EI_CLASS == "ELFCLASS64" ? "64" : "32";
    const processorName = `${functionPrefix}${suffixShort}`;
    
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