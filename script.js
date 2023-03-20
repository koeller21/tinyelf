
function ELF(){}

ELF.prototype.run = function(file){
    
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    
    reader.onload = function(loadedEvent){
        var arrayBuffer =  loadedEvent.target.result;
        var elfFile = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
        
        ElfN_Ehdr.e_ident.EI_MAG0 = elfFile.getUint8(0);
        ElfN_Ehdr.e_ident.EI_MAG1 = elfFile.getUint8(1);
        ElfN_Ehdr.e_ident.EI_MAG2 = elfFile.getUint8(2);
        ElfN_Ehdr.e_ident.EI_MAG3 = elfFile.getUint8(3);
        ElfN_Ehdr.e_ident.EI_CLASS = ElfN_Ehdr.e_ident.EI_CLASS[elfFile.getUint8(4)];
        ElfN_Ehdr.e_ident.EI_DATA = ElfN_Ehdr.e_ident.EI_DATA[elfFile.getUint8(5)];
        ElfN_Ehdr.e_ident.EI_VERSION = ElfN_Ehdr.e_ident.EI_VERSION[elfFile.getUint8(6)];
        ElfN_Ehdr.e_ident.EI_OSABI = ElfN_Ehdr.e_ident.EI_OSABI[elfFile.getUint8(7)];
        ElfN_Ehdr.e_ident.EI_ABIVERSION = elfFile.getUint8(8);
        ElfN_Ehdr.e_ident.EI_NIDENT = elfFile.getUint8(15);
    }
    
    return ElfN_Ehdr;
    
    
};

const ElfN_Ehdr = {
    e_ident : {
        EI_MAG0 : null,
        EI_MAG1 : null,
        EI_MAG2 : null,
        EI_MAG3 : null,
        EI_CLASS : {
            0 : "ELFCLASSNONE",
            1 : "ELFCLASS32",
            2 : "ELFCLASS64"
        },
        EI_DATA : {
            0 : "ELFDATANONE",
            1 : "ELFDATA2LSB",
            2 : "ELFDATA2MSB"
        },
        EI_VERSION : {
            0 : "EV_NONE",
            1 : "EV_CURRENT"
        },
        EI_OSABI : {
            0 : "ELFOSABI_SYSV", 
            1 : "ELFOSABI_HPUX",
            2 : "ELFOSABI_NETBSD",
            3 : "ELFOSABI_LINUX",
            4 : "UNKNOWN",
            5 : "UNKNOWN",
            6 : "ELFOSABI_SOLARIS",
            7 : "ELFOSABI_AIX",
            8 : "ELFOSABI_IRIX",
            9 : "ELFOSABI_FREEBSD",
            10 : "ELFOSABI_TRU64",
            11 : "ELFOSABI_MODESTO",
            12 : "ELFOSABI_OPENBSD",
            97 : "ELFOSABI_ARM",
            255 : "ELFOSABI_STANDALONE"
        },
        EI_ABIVERSION : null,
        EI_PAD : null,
        EI_NIDENT : null
    },
    e_type : null
}

function handleFiles() {
    
    var parser = new ELF();
    var x = parser.run(this.files[0]);
    console.log(x);
    
    // console.log(this.files[0]);
    
    // var reader = new FileReader();
    
    // reader.readAsArrayBuffer(this.files[0]);
    
    // reader.onload = function(loadedEvent){
    //     var arrayBuffer =  loadedEvent.target.result;
    //     var elfFile = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
    
    //     var elf = new ELFParser();
    
    //     elf32_hdr.e_ident.EI_MAG0 = elfFile.getUint8(0);
    //     elf32_hdr.e_ident.EI_MAG1 = elfFile.getUint8(1);
    //     elf32_hdr.e_ident.EI_MAG2 = elfFile.getUint8(2);
    //     elf32_hdr.e_ident.EI_MAG3 = elfFile.getUint8(3);
    //     elf32_hdr.e_ident.EI_CLASS = elfFile.getUint8(4);
    //     console.log(elf);
    
    
    
    // }
}


document.addEventListener("DOMContentLoaded", () => {
    
    const inputElement = document.getElementById("input");
    inputElement.addEventListener("change", handleFiles, false);
    
    
});