
const e_ident = {

    EI_MAG0: null,
    EI_MAG1: null,
    EI_MAG2: null,
    EI_MAG3: null,
    EI_CLASS: {
        0: "ELFCLASSNONE",
        1: "ELFCLASS32",
        2: "ELFCLASS64"
    },
    EI_DATA: {
        0: "ELFDATANONE",
        1: "ELFDATA2LSB",
        2: "ELFDATA2MSB"
    },
    EI_VERSION: {
        0: "EV_NONE",
        1: "EV_CURRENT"
    },
    EI_OSABI: {
        0: "ELFOSABI_SYSV",
        1: "ELFOSABI_HPUX",
        2: "ELFOSABI_NETBSD",
        3: "ELFOSABI_LINUX",
        4: "UNKNOWN",
        5: "UNKNOWN",
        6: "ELFOSABI_SOLARIS",
        7: "ELFOSABI_AIX",
        8: "ELFOSABI_IRIX",
        9: "ELFOSABI_FREEBSD",
        10: "ELFOSABI_TRU64",
        11: "ELFOSABI_MODESTO",
        12: "ELFOSABI_OPENBSD",
        97: "ELFOSABI_ARM",
        255: "ELFOSABI_STANDALONE"
    },
    EI_ABIVERSION: null,
    EI_PAD: null,
    EI_NIDENT: null

}

const elf_hdr = {
    e_type: {
        0: "ET_NONE",
        1: "ET_REL",
        2: "ET_EXEC",
        3: "ET_DYN",
        4: "ET_CORE"
    },
    e_machine: {
        0 : "EM_NONE",
        1 : "EM_M32",	
        2 : "EM_SPARC",
        3 : "EM_386",	
        4 : "EM_68K",
        5 : "EM_88K",
        6 : "EM_486", /* Perhaps disused */
        7 : "EM_860",
        8 : "EM_MIPS", /* MIPS R3000 (officially, big-endian only) */
        /* Next two are historical and binaries and
           modules of these types will be rejected by
           Linux.  */
        10 : "EM_MIPS_RS3_LE", /* MIPS R3000 little-endian */
        10 : "EM_MIPS_RS4_BE", /* MIPS R4000 big-endian */
        15 : "EM_PARISC",	/* HPPA */
        18 : "EM_SPARC32PLUS", /* Sun's "v8plus" */
        20 : "EM_PPC", /* PowerPC */
        21 : "EM_PPC64", /* PowerPC64 */
        23 : "EM_SPU",	/* Cell BE SPU */
        40 : "EM_ARM",	/* ARM 32 bit */
        42 : "EM_SH",	/* SuperH */
        43 : "EM_SPARCV9",	/* SPARC v9 64-bit */
        46 : "EM_H8_300",	/* Renesas H8/300 */
        50 : "EM_IA_64",	/* HP/Intel IA-64 */
        62 : "EM_X86_64",	/* AMD x86-64 */
        22 : "EM_S390", /* IBM S/390 */
        76 : "EM_CRIS", /* Axis Communications 32-bit "embedded processor */
        88 : "EM_M32R", /* Renesas M32R */
        89 : "EM_MN10300",	/* Panasonic/MEI MN10300, AM33 */
        92 : "EM_OPENRISC", /* OpenRISC 32-bit "embedded processor */
        93 : "EM_ARCOMPACT",	/* ARCompact processor */
        94 : "EM_XTENSA",	/* Tensilica Xtensa Architecture */
        106 : "EM_BLACKFIN", /* ADI Blackfin Processor */
        110 : "EM_UNICORE", /* UniCore-32 */
        113 : "EM_ALTERA_NIOS2", /* Altera Nios II soft-core processor */
        140 : "EM_TI_C6000", /* TI C6X DSPs */
        164 : "EM_HEXAGON", /* QUALCOMM Hexagon */
        167 : "EM_NDS32",	/* Andes Technology compact code size embedded RISC processor family */
        183 : "EM_AARCH64", /* ARM 64 bit */
        188 : "EM_TILEPRO", /* Tilera TILEPro */
        189 : "EM_MICROBLAZE", /* Xilinx MicroBlaze */
        191 : "EM_TILEGX", /* Tilera TILE-Gx */
        195 : "EM_ARCV2", /* ARCv2 Cores */
        243 : "EM_RISCV", /* RISC-V */
        247 : "EM_BPF", /* Linux BPF - in-kernel virtual machine */
        252 : "EM_CSKY", /* C-SKY */
        258 : "EM_LOONGARCH", /* LoongArch */
        0x5441 : "EM_FRV", /* Fujitsu FR-V */
        0x9026 : "EM_ALPHA",  /* This is an interim value that we will use until the committee comes up with a final number. */
        0x9041 : "EM_CYGNUS_M32R", /* Bogus old m32r magic number, used by old tools. */
        0xA390 : "EM_S390_OLD", /* This is the old interim value for S/390 architecture */
        0xbeef : "EM_CYGNUS_MN10300" /* Also Panasonic/MEI MN10300, AM33 */

    },
    e_version : {
        0 : "EV_NONE",
        1 : "EV_CURRENT"
    }
}

/* These constants are for the segment types stored in the image headers */
const elf_phdr = {
    p_type : {
        0 : "PT_NULL",
        1 : "PT_LOAD",
        2 : "PT_DYNAMIC",
        3 : "PT_INTERP",
        4 : "PT_NOTE",
        5 : "PT_SHLIB",
        6 : "PT_PHDR",
        7 : "PT_TLS", /* Thread local storage segment */
        0x60000000 : "PT_LOOS", /* OS-specific */
        0x6fffffff : "PT_HIOS", /* OS-specific */
        0x70000000 : "PT_LOPROC", 
        0x7fffffff : "PT_HIPROC",
        0x6474E550 : "PT_GNU_EH_FRAME",
        0x6474E551 : "PT_GNU_STACK",
        0x6474E552 : "PT_GNU_RELRO",
        0x6474E553 : "PT_GNU_PROPERTY"
    },
    p_flags : {
        0x1 : "PF_X",
        0x2 : "PF_W",
        0x4 : "PF_R"
    }
}

const elf_shdr = {
    sh_type : {
        /* sh_type */
        0 : "SHT_NULL",
        1 : "SHT_PROGBITS",
        2 : "SHT_SYMTAB",
        3 : "SHT_STRTAB",
        4 : "SHT_RELA",
        5 : "SHT_HASH",
        6 : "SHT_DYNAMIC",
        7 : "SHT_NOTE",
        8 : "SHT_NOBITS",
        9 : "SHT_REL",
        10 : "SHT_SHLIB",
        11 : "SHT_DYNSYM",
        12 : "SHT_NUM",
        0x70000000 : "SHT_LOPROC",
        0x7fffffff : "SHT_HIPROC",
        0x80000000 : "SHT_LOUSER",
        0xffffffff : "SHT_HIUSER"
    },

    sh_flags : {
        /* sh_flags */
        0x1 : "SHF_WRITE",
        0x2 : "SHF_ALLOC",
        0x4 : "SHF_EXECINSTR",
        0x00100000 : "SHF_RELA_LIVEPATCH",	
        0x00200000 : "SHF_RO_AFTER_INIT",	
        0xf0000000 : "SHF_MASKPROC"	
    },


}



// /* special section indexes */
// 0 SHN_UNDEF	
// 0xff00 SHN_LORESERVE	
// 0xff00 SHN_LOPROC	
// 0xff1f SHN_HIPROC	
// 0xff20 SHN_LIVEPATCH	
// 0xfff1 SHN_ABS	
// 0xfff2 SHN_COMMON	
// 0xffff SHN_HIRESERVE	