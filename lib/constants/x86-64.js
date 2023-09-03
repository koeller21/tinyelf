const R_X86_64_TYPE = {
    0 : "R_X86_64_NONE",           /* No reloc */
    1 : "R_X86_64_64",             /* Direct 64 bit  */
    2 : "R_X86_64_PC32",           /* PC relative 32 bit signed */
    3 : "R_X86_64_GOT32",          /* 32 bit GOT entry */
    4 : "R_X86_64_PLT32",          /* 32 bit PLT address */
    5 : "R_X86_64_COPY",           /* Copy symbol at runtime */
    6 : "R_X86_64_GLOB_DAT",       /* Create GOT entry */
    7 : "R_X86_64_JUMP_SLOT",      /* Create PLT entry */
    8 : "R_X86_64_RELATIVE",       /* Adjust by program base */
    9 : "R_X86_64_GOTPCREL",       /* 32 bit signed pc relative offset to GOT entry */
    10 : "R_X86_64_32",            /* Direct 32 bit zero extended */
    11 : "R_X86_64_32S",           /* Direct 32 bit sign extended */
    12 : "R_X86_64_16",            /* Direct 16 bit zero extended */
    13 : "R_X86_64_PC16",          /* 16 bit sign extended pc relative*/
    14 : "R_X86_64_8",             /* Direct 8 bit sign extended */
    15 : "R_X86_64_PC8",           /* 8 bit sign extended pc relative*/
    16 : "R_X86_64_DTPMOD64",      /* ID of module containing symbol */
    17 : "R_X86_64_DTPOFF64",      /* Offset in TLS block */
    18 : "R_X86_64_TPOFF64",       /* Offset in initial TLS block */
    19 : "R_X86_64_TLSGD",         /* PC relative offset to GD GOT block */
    20 : "R_X86_64_TLSLD",         /* PC relative offset to LD GOT block */
    21 : "R_X86_64_DTPOFF32",      /* Offset in TLS block */
    22 : "R_X86_64_GOTTPOFF",      /* PC relative offset to IE GOT entry */
    23 : "R_X86_64_TPOFF32",       /* Offset in initial TLS block */
    24 : "R_X86_64_PC64",          /* PC relative 64 bit */
    25 : "R_X86_64_GOTOFF64",      /* 64 bit offset to GOT */
    26 : "R_X86_64_GOTPC32",       /* 32 bit signed pc relative offset to GOT */
    27 : "R_X86_64_GOT64",         /* 64 bit GOT entry offset */
    28 : "R_X86_64_GOTPCREL64",    /* 64 bit signed pc relative offset to GOT entry */
    29 : "R_X86_64_GOTPC64",       /* 64 bit signed pc relative offset to GOT */
    30 : "R_X86_64_GOTPLT64",      /* Obsolete. The same as GOT64. */
    31 : "R_X86_64_PLTOFF64",      /* 64 bit GOT relative offset to PLT entry */
    32 : "R_X86_64_SIZE32",        /* 32-bit symbol size */
    33 : "R_X86_64_SIZE64",        /* 64-bit symbol size */
    34 : "R_X86_64_GOTPC32_TLSDESC", 
                        /* 32 bit signed pc relative
                       offset to TLS descriptor
                       in the GOT.  */
    35 : "R_X86_64_TLSDESC_CALL",  /* Relaxable call through TLS descriptor.  */
    36 : "R_X86_64_TLSDESC",       /* 2x64-bit TLS descriptor.  */
    37 : "R_X86_64_IRELATIVE",     /* Adjust indirectly by program base */
    38 : "R_X86_64_RELATIVE64",    /* 64bit adjust by program base */
    39 : "R_X86_64_PC32_BND",      /* PC relative 32 bit signed with BND prefix  */
    40 : "R_X86_64_PLT32_BND",     /* 32 bit PLT address with BND prefix */
    /* Load from 32 bit signed pc relative offset to GOT entry without
   REX prefix relaxable.  */
    41 : "R_X86_64_GOTPCRELX", 
    /* Load from 32 bit signed pc relative offset to GOT entry with
   REX prefix relaxable.  */
    42 : "R_X86_64_REX_GOTPCRELX", 
    250 : "R_X86_64_GNU_VTINHERIT",        /* GNU C++ hack  */
    251 : "R_X86_64_GNU_VTENTRY",          /* GNU C++ hack  */
};