"use strict";
/* sources for a lot of these flags:

Good source (contains most definitions):
https://github.com/bminor/binutils-gdb/blob/148b93f23647dd184641fd9e3585bc3a8b455708/include/elf/common.h

so so source:
https://github.com/torvalds/linux/blob/master/include/uapi/linux/elf.h

so so source with explanation:
https://docs.oracle.com/cd/E19683-01/816-1386/index.html

*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ElfDataReader = exports.elf_hdr = exports.e_ident = exports.Elf64Types = exports.Elf32Types = exports.ElfBase = void 0;
var Elf32Types;
(function (Elf32Types) {
    Elf32Types[Elf32Types["char"] = 1] = "char";
    Elf32Types[Elf32Types["Elf_Half"] = 2] = "Elf_Half";
    Elf32Types[Elf32Types["Elf_Addr"] = 4] = "Elf_Addr";
    Elf32Types[Elf32Types["Elf_Off"] = 4] = "Elf_Off";
    Elf32Types[Elf32Types["Elf_Sword"] = 4] = "Elf_Sword";
    Elf32Types[Elf32Types["Elf_Word"] = 4] = "Elf_Word";
})(Elf32Types || (Elf32Types = {}));
exports.Elf32Types = Elf32Types;
;
var Elf64Types;
(function (Elf64Types) {
    Elf64Types[Elf64Types["char"] = 1] = "char";
    Elf64Types[Elf64Types["Elf_Half"] = 2] = "Elf_Half";
    Elf64Types[Elf64Types["Elf_SHalf"] = 2] = "Elf_SHalf";
    Elf64Types[Elf64Types["Elf_Sword"] = 4] = "Elf_Sword";
    Elf64Types[Elf64Types["Elf_Word"] = 4] = "Elf_Word";
    Elf64Types[Elf64Types["Elf_Off"] = 8] = "Elf_Off";
    Elf64Types[Elf64Types["Elf_Addr"] = 8] = "Elf_Addr";
    Elf64Types[Elf64Types["Elf_Xword"] = 8] = "Elf_Xword";
    Elf64Types[Elf64Types["Elf_Sxword"] = 8] = "Elf_Sxword";
})(Elf64Types || (Elf64Types = {}));
exports.Elf64Types = Elf64Types;
;
;
;
;
var ElfBase = /** @class */ (function () {
    function ElfBase(data) {
        this.endianness = true; // assuming its LSB first
        this.bit = 32; // assuming its 32 bit first
        this.data = data;
    }
    return ElfBase;
}());
exports.ElfBase = ElfBase;
var ElfDataReader = /** @class */ (function (_super) {
    __extends(ElfDataReader, _super);
    function ElfDataReader(data, offset) {
        var _this = _super.call(this, data) || this;
        _this.offset = 0;
        _this.offset = offset;
        return _this;
    }
    ElfDataReader.prototype.readData = function (name, size, encoding) {
        var value = 0;
        if (encoding == undefined) {
            value = this.readBytes(size);
        }
        else {
            value = encoding[this.readBytes(size)];
        }
        var elfData = {
            name: name,
            value: value,
            raw_dec: +value.toString(),
            raw_hex: +value.toString(16),
            size: size,
            offset: this.offset
        };
        this.offset += size;
        return elfData;
    };
    ElfDataReader.prototype.readBytes = function (size) {
        // 32 bit
        if (this.bit == 32) {
            switch (size) {
                case Elf32Types.char: return this.data.getUint8(this.offset);
                case Elf32Types.Elf_Half: return this.data.getUint16(this.offset, this.endianness);
                case Elf32Types.Elf_Word: return this.data.getUint32(this.offset, this.endianness);
                case Elf32Types.Elf_Addr: return this.data.getUint32(this.offset, this.endianness);
                case Elf32Types.Elf_Off: return this.data.getUint32(this.offset, this.endianness);
                case Elf32Types.Elf_Sword: return this.data.getInt32(this.offset, this.endianness);
                // Add other cases as needed
                default: throw new Error("No 32-bit read method for size ".concat(size));
            }
        }
        else {
            // 64 bit
            switch (size) {
                case Elf64Types.char: return this.data.getUint8(this.offset);
                case Elf64Types.Elf_Half: return this.data.getUint16(this.offset, this.endianness);
                case Elf64Types.Elf_SHalf: return this.data.getInt16(this.offset, this.endianness);
                case Elf64Types.Elf_Word: return this.data.getUint32(this.offset, this.endianness);
                case Elf64Types.Elf_Sword: return this.data.getInt32(this.offset, this.endianness);
                case Elf64Types.Elf_Addr: return Number(this.data.getBigUint64(this.offset, this.endianness));
                case Elf64Types.Elf_Off: return Number(this.data.getBigUint64(this.offset, this.endianness));
                case Elf64Types.Elf_Xword: return Number(this.data.getBigUint64(this.offset, this.endianness));
                case Elf64Types.Elf_Sxword: return Number(this.data.getBigInt64(this.offset, this.endianness));
                // Add other cases as needed
                default: throw new Error("No 64-bit read method for size ".concat(size));
            }
        }
    };
    return ElfDataReader;
}(ElfBase));
exports.ElfDataReader = ElfDataReader;
var e_ident = {
    /* File class */
    EI_CLASS: {
        0: "ELFCLASSNONE",
        1: "ELFCLASS32",
        2: "ELFCLASS64" /* 64-bit objects */
    },
    /* Data encoding */
    EI_DATA: {
        0: "ELFDATANONE",
        1: "ELFDATA2LSB",
        2: "ELFDATA2MSB" /* 2's complement, big endian */
    },
    /* File version */
    EI_VERSION: {
        0: "EV_NONE",
        1: "EV_CURRENT"
    },
    /* Operating System/ABI indication */
    EI_OSABI: {
        0: "ELFOSABI_NONE",
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
        13: "ELFOSABI_OPENVMS",
        14: "ELFOSABI_NSK",
        15: "ELFOSABI_AROS",
        16: "ELFOSABI_FENIXOS",
        17: "ELFOSABI_CLOUDABI",
        18: "ELFOSABI_OPENVOS",
        64: "ELFOSABI_C6000_ELFABI",
        64: "ELFOSABI_AMDGPU_HSA",
        65: "ELFOSABI_C6000_LINUX",
        65: "ELFOSABI_AMDGPU_PAL",
        65: "ELFOSABI_ARM_FDPIC",
        66: "ELFOSABI_AMDGPU_MESA3D",
        97: "ELFOSABI_ARM",
        255: "ELFOSABI_STANDALONE" /* Standalone (embedded) application */
    }
};
exports.e_ident = e_ident;
var elf_hdr = {
    /* Values for e_type, which identifies the object file type.  */
    e_type: {
        0: "ET_NONE",
        1: "ET_REL",
        2: "ET_EXEC",
        3: "ET_DYN",
        4: "ET_CORE",
        0xFE00: "ET_LOOS",
        0xFEFF: "ET_HIOS",
        0xFF00: "ET_LOPROC",
        0xFFFF: "ET_HIPROC" /* Processor-specific */
    },
    /* Values for e_machine, which identifies the architecture.  These numbers
    are officially assigned by registry@sco.com.  See below for a list of
    ad-hoc numbers used during initial development.  */
    e_machine: {
        0: "EM_NONE",
        1: "EM_M32",
        2: "EM_SPARC",
        3: "EM_386",
        4: "EM_68K",
        5: "EM_88K",
        6: "EM_IAMCU",
        7: "EM_860",
        8: "EM_MIPS",
        9: "EM_S370",
        10: "EM_MIPS_RS3_LE",
        11: "EM_OLD_SPARCV9",
        11: "EM_res011",
        12: "EM_res012",
        13: "EM_res013",
        14: "EM_res014",
        15: "EM_PARISC",
        16: "EM_res016",
        17: "EM_PPC_OLD",
        17: "EM_VPP550",
        18: "EM_SPARC32PLUS",
        19: "EM_960",
        20: "EM_PPC",
        21: "EM_PPC64",
        22: "EM_S390",
        23: "EM_SPU",
        24: "EM_res024",
        25: "EM_res025",
        26: "EM_res026",
        27: "EM_res027",
        28: "EM_res028",
        29: "EM_res029",
        30: "EM_res030",
        31: "EM_res031",
        32: "EM_res032",
        33: "EM_res033",
        34: "EM_res034",
        35: "EM_res035",
        36: "EM_V800",
        37: "EM_FR20",
        38: "EM_RH32",
        39: "EM_MCORE",
        39: "EM_RCE",
        40: "EM_ARM",
        41: "EM_OLD_ALPHA",
        42: "EM_SH",
        43: "EM_SPARCV9",
        44: "EM_TRICORE",
        45: "EM_ARC",
        46: "EM_H8_300",
        47: "EM_H8_300H",
        48: "EM_H8S",
        49: "EM_H8_500",
        50: "EM_IA_64",
        51: "EM_MIPS_X",
        52: "EM_COLDFIRE",
        53: "EM_68HC12",
        54: "EM_MMA",
        55: "EM_PCP",
        56: "EM_NCPU",
        57: "EM_NDR1",
        58: "EM_STARCORE",
        59: "EM_ME16",
        60: "EM_ST100",
        61: "EM_TINYJ",
        62: "EM_X86_64",
        63: "EM_PDSP",
        64: "EM_PDP10",
        65: "EM_PDP11",
        66: "EM_FX66",
        67: "EM_ST9PLUS",
        68: "EM_ST7",
        69: "EM_68HC16",
        70: "EM_68HC11",
        71: "EM_68HC08",
        72: "EM_68HC05",
        73: "EM_SVX",
        74: "EM_ST19",
        75: "EM_VAX",
        76: "EM_CRIS",
        77: "EM_JAVELIN",
        78: "EM_FIREPATH",
        79: "EM_ZSP",
        80: "EM_MMIX",
        81: "EM_HUANY",
        82: "EM_PRISM",
        83: "EM_AVR",
        84: "EM_FR30",
        85: "EM_D10V",
        86: "EM_D30V",
        87: "EM_V850",
        88: "EM_M32R",
        89: "EM_MN10300",
        90: "EM_MN10200",
        91: "EM_PJ",
        92: "EM_OR1K",
        93: "EM_ARC_COMPACT",
        94: "EM_XTENSA",
        95: "EM_SCORE_OLD",
        95: "EM_VIDEOCORE",
        96: "EM_TMM_GPP",
        97: "EM_NS32K",
        98: "EM_TPC",
        99: "EM_PJ_OLD",
        99: "EM_SNP1K",
        100: "EM_ST200",
        101: "EM_IP2K",
        102: "EM_MAX",
        103: "EM_CR",
        104: "EM_F2MC16",
        105: "EM_MSP430",
        106: "EM_BLACKFIN",
        107: "EM_SE_C33",
        108: "EM_SEP",
        109: "EM_ARCA",
        110: "EM_UNICORE",
        111: "EM_EXCESS",
        112: "EM_DXP",
        113: "EM_ALTERA_NIOS2",
        114: "EM_CRX",
        115: "EM_CR16_OLD",
        115: "EM_XGATE",
        116: "EM_C166",
        117: "EM_M16C",
        118: "EM_DSPIC30F",
        119: "EM_CE",
        120: "EM_M32C",
        121: "EM_res121",
        122: "EM_res122",
        123: "EM_res123",
        124: "EM_res124",
        125: "EM_res125",
        126: "EM_res126",
        127: "EM_res127",
        128: "EM_res128",
        129: "EM_res129",
        130: "EM_res130",
        131: "EM_TSK3000",
        132: "EM_RS08",
        133: "EM_res133",
        134: "EM_ECOG2",
        135: "EM_SCORE",
        135: "EM_SCORE7",
        136: "EM_DSP24",
        137: "EM_VIDEOCORE3",
        138: "EM_LATTICEMICO32",
        139: "EM_SE_C17",
        140: "EM_TI_C6000",
        141: "EM_TI_C2000",
        142: "EM_TI_C5500",
        143: "EM_res143",
        144: "EM_TI_PRU",
        145: "EM_res145",
        146: "EM_res146",
        147: "EM_res147",
        148: "EM_res148",
        149: "EM_res149",
        150: "EM_res150",
        151: "EM_res151",
        152: "EM_res152",
        153: "EM_res153",
        154: "EM_res154",
        155: "EM_res155",
        156: "EM_res156",
        157: "EM_res157",
        158: "EM_res158",
        159: "EM_res159",
        160: "EM_MMDSP_PLUS",
        161: "EM_CYPRESS_M8C",
        162: "EM_R32C",
        163: "EM_TRIMEDIA",
        164: "EM_QDSP6",
        165: "EM_8051",
        166: "EM_STXP7X",
        167: "EM_NDS32",
        168: "EM_ECOG1",
        168: "EM_ECOG1X",
        169: "EM_MAXQ30",
        170: "EM_XIMO16",
        171: "EM_MANIK",
        172: "EM_CRAYNV2",
        173: "EM_RX",
        174: "EM_METAG",
        175: "EM_MCST_ELBRUS",
        176: "EM_ECOG16",
        177: "EM_CR16",
        178: "EM_ETPU",
        179: "EM_SLE9X",
        180: "EM_L1OM",
        181: "EM_K1OM",
        182: "EM_INTEL182",
        183: "EM_AARCH64",
        184: "EM_ARM184",
        185: "EM_AVR32",
        186: "EM_STM8",
        187: "EM_TILE64",
        188: "EM_TILEPRO",
        189: "EM_MICROBLAZE",
        190: "EM_CUDA",
        191: "EM_TILEGX",
        192: "EM_CLOUDSHIELD",
        193: "EM_COREA_1ST",
        194: "EM_COREA_2ND",
        195: "EM_ARC_COMPACT2",
        196: "EM_OPEN8",
        197: "EM_RL78",
        198: "EM_VIDEOCORE5",
        199: "EM_78K0R",
        200: "EM_56800EX",
        201: "EM_BA1",
        202: "EM_BA2",
        203: "EM_XCORE",
        204: "EM_MCHP_PIC",
        205: "EM_INTELGT",
        206: "EM_INTEL206",
        207: "EM_INTEL207",
        208: "EM_INTEL208",
        209: "EM_INTEL209",
        210: "EM_KM32",
        211: "EM_KMX32",
        212: "EM_KMX16",
        213: "EM_KMX8",
        214: "EM_KVARC",
        215: "EM_CDP",
        216: "EM_COGE",
        217: "EM_COOL",
        218: "EM_NORC",
        219: "EM_CSR_KALIMBA",
        220: "EM_Z80",
        221: "EM_VISIUM",
        222: "EM_FT32",
        223: "EM_MOXIE",
        224: "EM_AMDGPU",
        243: "EM_RISCV",
        244: "EM_LANAI",
        245: "EM_CEVA",
        246: "EM_CEVA_X2",
        247: "EM_BPF",
        248: "EM_GRAPHCORE_IPU",
        249: "EM_IMG1",
        250: "EM_NFP",
        251: "EM_VE",
        252: "EM_CSKY",
        253: "EM_ARC_COMPACT3_64",
        254: "EM_MCS6502",
        255: "EM_ARC_COMPACT3",
        256: "EM_KVX",
        257: "EM_65816",
        258: "EM_LOONGARCH",
        259: "EM_KF32",
        260: "EM_U16_U8CORE",
        261: "EM_TACHYUM",
        262: "EM_56800EF",
        /* If it is necessary to assign new unofficial EM_* values, please pick large
        random numbers (0x8523, 0xa7f2, etc.) to minimize the chances of collision
        with official or non-GNU unofficial values.
        
        NOTE: Do not just increment the most recent number by one.
        Somebody else somewhere will do exactly the same thing, and you
        will have a collision.  Instead, pick a random number.
        
        Normally, each entity or maintainer responsible for a machine with an
        unofficial e_machine number should eventually ask registry@sco.com for
        an officially blessed number to be added to the list above.	*/
        0x1057: "EM_AVR_OLD",
        0x1059: "EM_MSP430_OLD",
        0x2530: "EM_MT",
        0x3330: "EM_CYGNUS_FR30",
        0x4157: "EM_WEBASSEMBLY",
        0x4DEF: "EM_S12Z",
        0x5aa5: "EM_DLX",
        0x5441: "EM_CYGNUS_FRV",
        0x4688: "EM_XC16X",
        0x7650: "EM_CYGNUS_D10V",
        0x7676: "EM_CYGNUS_D30V",
        0x8217: "EM_IP2K_OLD",
        0x9025: "EM_CYGNUS_POWERPC",
        0x9026: "EM_ALPHA",
        0x9041: "EM_CYGNUS_M32R",
        0x9080: "EM_CYGNUS_V850",
        0xa390: "EM_S390_OLD",
        0xabc7: "EM_XTENSA_OLD",
        0xad45: "EM_XSTORMY16",
        0xbeef: "EM_CYGNUS_MN10300",
        0xdead: "EM_CYGNUS_MN10200",
        0xFEB0: "EM_M32C_OLD",
        0xFEBA: "EM_IQ2000",
        0xFEBB: "EM_NIOS32",
        0xF00D: "EM_CYGNUS_MEP",
        0xFEED: "EM_MOXIE_OLD",
        0xbaab: "EM_MICROBLAZE_OLD",
        0x1223: "EM_ADAPTEVA_EPIPHANY" /* Adapteva's Epiphany architecture.  */
        // 92 : "EM_OPENRISC",		    /* Old constant that might be in use by some software. */
        // 39 : "EM_CSKY_OLD",		    /* C-SKY historically used 39, the same value as MCORE, from which the architecture was derived.  */
    },
    /* Values for e_version.  */
    e_version: {
        0: "EV_NONE",
        1: "EV_CURRENT" /* Current version */
    },
    /* Value for e_phnum. */
    e_phnum: {
        /*
        This is defined as 0xffff, the largest number e_phnum can have,
        specifying where the actual number of program headers is assigned
        */
        0xffff: "PN_XNUM" /* Extended numbering */
    },
    e_shstrndx: {
        0: "SHN_UNDEF",
        0xffff: "SHN_XINDEX"
    },
    /*
    A section  header table index is a subscript into this array. Some section header table indices
    are reserved: the initial entry and the indices between SHN_LORESERVE and SHN_HIRESERVE.
    The initial entry is used in ELF extensions for e_phnum, e_shnum, and e_shstrndx; in other cases,
    each field in the initial entry is set to zero.  An object file does not have sections for these special indices:
    */
    /* This value marks an undefined, missing, irrelevant, or otherwise meaningless section reference.*/
    "SHN_UNDEF": 0x0,
    /* This value specifies the lower bound of the range of reserved indices. */
    "SHN_LORESERVE": 0xff00,
    /*
    Values greater in the inclusive range [SHN_LOPROC, SHN_HIPROC] are reserved for
    processor-specific semantics.
    */
    "SHN_LOPROC": 0xff00,
    /*
    This value specifies the absolute value for the corresponding reference.
    For example, a symbol defined relative to section number SHN_ABS has an
    absolute value and is not affected by relocation.
    */
    "SHN_HIPROC": 0xff1f,
    "SHN_LIVEPATCH": 0xff20,
    /*
    This value specifies the absolute value for the corresponding reference.
    For example, a symbol defined relative to section number SHN_ABS has an absolute
    value and is not affected by relocation.
    */
    "SHN_ABS": 0xfff1,
    /*
    Symbols defined relative to this section are common symbols, such as FORTRAN COMMON or
    unallocated C external variables.
    */
    "SHN_COMMON": 0xfff2,
    /*
    This value specifies the upper bound of the range of reserved indices.
    The system reserves indices between SHN_LORESERVE and SHN_HIRESERVE, inclusive.
    The section header  table  does  not contain entries for the reserved indices.
    */
    "SHN_HIRESERVE": 0xffff
};
exports.elf_hdr = elf_hdr;
/* These constants are for the segment types stored in the image headers */
var elf_phdr = {
    /* Values for program header, p_type field.  */
    p_type: {
        0: "PT_NULL",
        1: "PT_LOAD",
        2: "PT_DYNAMIC",
        3: "PT_INTERP",
        4: "PT_NOTE",
        5: "PT_SHLIB",
        6: "PT_PHDR",
        7: "PT_TLS",
        0x60000000: "PT_LOOS",
        0x6fffffff: "PT_HIOS",
        0x70000000: "PT_LOPROC",
        0x7fffffff: "PT_HIPROC",
        0x6474E550: "PT_GNU_EH_FRAME",
        // 0x6474E550 : "PT_SUNW_EH_FRAME",  /* Solaris uses the same value */
        0x6474E551: "PT_GNU_STACK",
        0x6474E552: "PT_GNU_RELRO",
        0x6474E553: "PT_GNU_PROPERTY",
        0x6474E554: "PT_GNU_SFRAME",
        /* OpenBSD segment types.  */
        0x65a3dbe6: "PT_OPENBSD_RANDOMIZE",
        0x65a3dbe7: "PT_OPENBSD_WXNEEDED ",
        0x65a41be6: "PT_OPENBSD_BOOTDATA ",
        /* Mbind segments */
        4096: "PT_GNU_MBIND_NUM",
        0x6474e555: "PT_GNU_MBIND_LO",
        0x6474f554: "PT_GNU_MBIND_HI"
    },
    /* Program segment permissions, in program header p_flags field.  */
    p_flags: {
        0x1: "PF_X",
        0x2: "PF_W",
        0x4: "PF_R",
        0x0FF00000: "PF_MASKOS",
        0xF0000000: "PF_MASKPROC" /* Processor-specific reserved bits */
    }
};
var elf_shdr = {
    /* Values for section header, sh_type field.  */
    sh_type: {
        0: "SHT_NULL",
        1: "SHT_PROGBITS",
        2: "SHT_SYMTAB",
        3: "SHT_STRTAB",
        4: "SHT_RELA",
        5: "SHT_HASH",
        6: "SHT_DYNAMIC",
        7: "SHT_NOTE",
        8: "SHT_NOBITS",
        9: "SHT_REL",
        10: "SHT_SHLIB",
        11: "SHT_DYNSYM",
        12: "SHT_NUM",
        14: "SHT_INIT_ARRAY",
        15: "SHT_FINI_ARRAY",
        16: "SHT_PREINIT_ARRAY",
        17: "SHT_GROUP",
        18: "SHT_SYMTAB_SHNDX",
        19: "SHT_RELR",
        0x60000000: "SHT_LOOS",
        0x6fffffff: "SHT_HIOS",
        0x6fff4700: "SHT_GNU_INCREMENTAL_INPUTS",
        0x6ffffff5: "SHT_GNU_ATTRIBUTES",
        0x6ffffff6: "SHT_GNU_HASH",
        0x6ffffff7: "SHT_GNU_LIBLIST",
        /* The next three section types are defined by Solaris, and are named
        SHT_SUNW*.  We use them in GNU code, so we also define SHT_GNU*
        versions.  */
        // 0x6ffffffd : "SHT_SUNW_verdef",		/* Versions defined by file */
        // 0x6ffffffe : "SHT_SUNW_verneed", 	/* Versions needed by file */
        // 0x6fffffff : "SHT_SUNW_versym",		/* Symbol versions */
        0x6ffffffd: "SHT_GNU_verdef",
        0x6ffffffe: "SHT_GNU_verneed",
        0x6fffffff: "SHT_GNU_versym",
        0x70000000: "SHT_LOPROC",
        0x7fffffff: "SHT_HIPROC",
        0x80000000: "SHT_LOUSER",
        0xffffffff: "SHT_HIUSER" /* New value, defined in Oct 4, 1999 Draft */
    },
    /* Values for section header, sh_flags field.  */
    sh_flags: {
        0x1: "SHF_WRITE",
        0x2: "SHF_ALLOC",
        0x4: "SHF_EXECINSTR",
        0x10: "SHF_MERGE",
        0x20: "SHF_STRINGS",
        0x40: "SHF_INFO_LINK",
        0x80: "SHF_LINK_ORDER",
        0x100: "SHF_OS_NONCONFORMING",
        0x200: "SHF_GROUP",
        0x400: "SHF_TLS",
        0x800: "SHF_COMPRESSED",
        0x0FF00000: "SHF_MASKOS",
        0x200000: "SHF_GNU_RETAIN",
        0xF0000000: "SHF_MASKPROC",
        0x80000000: "SHF_EXCLUDE",
        0x01000000: "SHF_GNU_MBIND",
        0x00100000: "SHF_RELA_LIVEPATCH",
        0x00200000: "SHF_RO_AFTER_INIT"
    }
};
var elf_sym = {
    /* Values for symbol type */
    st_type: {
        0: "STT_NOTYPE",
        1: "STT_OBJECT",
        2: "STT_FUNC",
        3: "STT_SECTION",
        4: "STT_FILE",
        5: "STT_COMMON",
        6: "STT_TLS",
        8: "STT_RELC",
        9: "STT_SRELC",
        10: "STT_LOOS",
        10: "STT_GNU_IFUNC",
        12: "STT_HIOS",
        13: "STT_LOPROC",
        15: "STT_HIPROC" /* Processor-specific semantics */
    },
    /* values for symbol binding/scope */
    st_bind: {
        0: "STB_LOCAL",
        1: "STB_GLOBAL",
        2: "STB_WEAK",
        10: "STB_LOOS",
        10: "STB_GNU_UNIQUE",
        12: "STB_HIOS",
        13: "STB_LOPROC",
        15: "STB_HIPROC" /* Processor-specific semantics */
    },
    /* The following constants control how a symbol may be accessed once it has
    become part of an executable or shared library.  */
    st_other: {
        0: "STV_DEFAULT",
        1: "STV_INTERNAL",
        2: "STV_HIDDEN",
        3: "STV_PROTECTED" /* Treat as STB_LOCAL inside current component */
    }
};
var elf_dynamic = {
    /*
    The d_tag member controls the interpretation of d_un, which is a
    union of d_val, representing integer values with
    various interpretations and d_ptr, representing
    program  virtual  addresses.  When interpreting these addresses,
    the actual address should be computed based on the original file
    value and memory base address.  Files do not contain relocation
    entries to fixup these addresses.
    */
    d_tag: {
        0: "DT_NULL",
        1: "DT_NEEDED",
        2: "DT_PLTRELSZ",
        3: "DT_PLTGOT",
        4: "DT_HASH",
        5: "DT_STRTAB",
        6: "DT_SYMTAB",
        7: "DT_RELA",
        8: "DT_RELASZ",
        9: "DT_RELAENT",
        10: "DT_STRSZ",
        11: "DT_SYMENT",
        12: "DT_INIT",
        13: "DT_FINI",
        14: "DT_SONAME",
        15: "DT_RPATH",
        16: "DT_SYMBOLIC",
        17: "DT_REL",
        18: "DT_RELSZ",
        19: "DT_RELENT",
        20: "DT_PLTREL",
        21: "DT_DEBUG",
        22: "DT_TEXTREL",
        23: "DT_JMPREL",
        24: "DT_BIND_NOW",
        25: "DT_INIT_ARRAY",
        26: "DT_FINI_ARRAY",
        27: "DT_INIT_ARRAYSZ",
        28: "DT_FINI_ARRAYSZ",
        29: "DT_RUNPATH",
        30: "DT_FLAGS",
        32: "DT_PREINIT_ARRAY",
        33: "DT_PREINIT_ARRAYSZ",
        34: "DT_SYMTAB_SHNDX",
        35: "DT_RELRSZ",
        36: "DT_RELR",
        37: "DT_RELRENT",
        38: "DT_ENCODING",
        /* Note, the Oct 4, 1999 draft of the ELF ABI changed the values
        for DT_LOOS and DT_HIOS.  Some implementations however, use
        values outside of the new range (see below).	 */
        0x60000000: "OLD_DT_LOOS",
        0x6000000d: "DT_LOOS",
        0x6ffff000: "DT_HIOS",
        0x6fffffff: "OLD_DT_HIOS",
        0x70000000: "DT_LOPROC",
        0x7fffffff: "DT_HIPROC",
        /*
        The next 2 dynamic tag ranges, integer value range
        (DT_VALRNGLO to DT_VALRNGHI) and virtual address range
        (DT_ADDRRNGLO to DT_ADDRRNGHI),are used on Solaris.
        We support them everywhere.  Note these values lie
        outside of the (new) range for OS specific values.
        This is a deliberate special case and we maintain it
        for backwards compatability.
        */
        0x6ffffd00: "DT_VALRNGLO",
        0x6ffffdf4: "DT_GNU_FLAGS_1",
        0x6ffffdf5: "DT_GNU_PRELINKED",
        0x6ffffdf6: "DT_GNU_CONFLICTSZ",
        0x6ffffdf7: "DT_GNU_LIBLISTSZ",
        0x6ffffdf8: "DT_CHECKSUM",
        0x6ffffdf9: "DT_PLTPADSZ",
        0x6ffffdfa: "DT_MOVEENT",
        0x6ffffdfb: "DT_MOVESZ",
        0x6ffffdfc: "DT_FEATURE",
        0x6ffffdfd: "DT_POSFLAG_1",
        0x6ffffdfe: "DT_SYMINSZ",
        0x6ffffdff: "DT_SYMINENT",
        0x6ffffdff: "DT_VALRNGHI",
        0x6ffffe00: "DT_ADDRRNGLO",
        0x6ffffef5: "DT_GNU_HASH",
        0x6ffffef6: "DT_TLSDESC_PLT",
        0x6ffffef7: "DT_TLSDESC_GOT",
        0x6ffffef8: "DT_GNU_CONFLICT",
        0x6ffffef9: "DT_GNU_LIBLIST",
        0x6ffffefa: "DT_CONFIG",
        0x6ffffefb: "DT_DEPAUDIT",
        0x6ffffefc: "DT_AUDIT",
        0x6ffffefd: "DT_PLTPAD",
        0x6ffffefe: "DT_MOVETAB",
        0x6ffffeff: "DT_SYMINFO",
        0x6ffffeff: "DT_ADDRRNGHI",
        0x6ffffff9: "DT_RELACOUNT",
        0x6ffffffa: "DT_RELCOUNT",
        0x6ffffffb: "DT_FLAGS_1",
        0x6ffffffc: "DT_VERDEF",
        0x6ffffffd: "DT_VERDEFNUM",
        0x6ffffffe: "DT_VERNEED",
        0x6fffffff: "DT_VERNEEDNUM",
        /* This tag is a GNU extension to the Solaris version scheme.  */
        0x6ffffff0: "DT_VERSYM",
        0x70000000: "DT_LOPROC",
        0x7fffffff: "DT_HIPROC",
        /* These section tags are used on Solaris.  We support them
        everywhere, and hope they do not conflict.  */
        0x7ffffffd: "DT_AUXILIARY",
        0x7ffffffe: "DT_USED",
        0x7fffffff: "DT_FILTER"
    }
};
// flag values for certain dynamic d_tag values
var DT_FLAGS = {};
DT_FLAGS[1 << 0] = "DF_ORIGIN"; /* $ORIGIN processing required */
DT_FLAGS[1 << 1] = "DF_SYMBOLIC"; /* Symbolic symbol resolution required. */
DT_FLAGS[1 << 2] = "DF_TEXTREL"; /* Text relocations exist. */
DT_FLAGS[1 << 3] = "DF_BIND_NOW"; /* Non-lazy binding required. */
var DT_FLAGS_1 = {};
DT_FLAGS_1[1 << 0] = "DF_1_NOW"; /* Perform complete relocation processing. */
DT_FLAGS_1[1 << 1] = "DF_1_GLOBAL"; /* Unused */
DT_FLAGS_1[1 << 2] = "DF_1_GROUP"; /* Indicate object is a member of a group. */
DT_FLAGS_1[1 << 3] = "DF_1_NODELETE"; /* Object cannot be deleted from a process. */
DT_FLAGS_1[1 << 4] = "DF_1_LOADFLTR"; /* Ensure immediate loading of filtees. */
DT_FLAGS_1[1 << 5] = "DF_1_INITFIRST"; /* Objects' initialization occurs first. */
DT_FLAGS_1[1 << 6] = "DF_1_NOOPEN"; /* Object can not be used with dlopen(3DL). */
DT_FLAGS_1[1 << 7] = "DF_1_ORIGIN"; /* $ORIGIN processing required. */
DT_FLAGS_1[1 << 8] = "DF_1_DIRECT"; /* Direct bindings enabled */
DT_FLAGS_1[1 << 10] = "DF_1_INTERPOSE"; /* Object is an interposer */
DT_FLAGS_1[1 << 11] = "DF_1_NODEFLIB"; /* Ignore default library search path */
DT_FLAGS_1[1 << 12] = "DF_1_NODUMP"; /* Object cannot be dumped with dldump(3DL) */
DT_FLAGS_1[1 << 13] = "DF_1_CONFALT"; /* Object is a configuration alternative. */
DT_FLAGS_1[1 << 14] = "DF_1_ENDFILTEE"; /* Filtee terminates filter's search. */
DT_FLAGS_1[1 << 15] = "DF_1_DISPRELDNE"; /* Displacement relocation done. */
DT_FLAGS_1[1 << 16] = "DF_1_DISPRELPND"; /* Displacement relocation pending. */
DT_FLAGS_1[1 << 17] = "DF_1_NODIRECT"; /* Do not create dynamic relocations for references to external symbols. */
DT_FLAGS_1[1 << 18] = "DF_1_IGNMULDEF"; /* Ignore multiple definitions of the same symbol. */
DT_FLAGS_1[1 << 19] = "DF_1_NOKSYMS"; /* Object does not participate in symbol resolution. */
DT_FLAGS_1[1 << 20] = "DF_1_NOHDR"; /* Object does not have an ELF header. */
DT_FLAGS_1[1 << 21] = "DF_1_EDITED"; /* Object has been edited by runtime linker. */
DT_FLAGS_1[1 << 22] = "DF_1_NORELOC"; /* Do not perform relocations. */
DT_FLAGS_1[1 << 23] = "DF_1_SYMINTPOSE"; /* Object has symbols that are subject to interposition. */
DT_FLAGS_1[1 << 24] = "DF_1_GLOBAUDIT"; /* Object requires global auditing. */
DT_FLAGS_1[1 << 25] = "DF_1_SINGLETON"; /* Object is a singleton. */
DT_FLAGS_1[1 << 26] = "DF_1_STUB"; /* Object is a stub. */
DT_FLAGS_1[1 << 27] = "DF_1_PIE"; /* Object is position independent. */
DT_FLAGS_1[1 << 28] = "DF_1_KMOD"; /* Object is a kernel module. */
DT_FLAGS_1[1 << 29] = "DF_1_WEAKFILTER"; /* Object supports weak filtering. */
DT_FLAGS_1[1 << 30] = "DF_1_NOCOMMON"; /* Object does not have common symbols. */
var DT_POSFLAG_1 = {};
DT_POSFLAG_1[1 << 0] = "DF_P1_LAZYLOAD"; /* Identify lazy loaded dependency. */
DT_POSFLAG_1[1 << 1] = "DF_P1_GROUPPERM"; /* Identify group dependency. */
var DT_FEATURE = {};
DT_FEATURE[1 << 0] = "DTF_1_PARINIT"; /* Partial initialization is required. */
DT_FEATURE[1 << 1] = "DTF_1_CONFEXP"; /* A Configuration file is expected. */
var DT_GNU_FLAGS_1 = {};
DT_GNU_FLAGS_1[1 << 0] = "DF_GNU_1_UNIQUE";
