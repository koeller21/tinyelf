
/* sources for a lot of these flags: 

Good source (contains most definitions):
https://github.com/bminor/binutils-gdb/blob/148b93f23647dd184641fd9e3585bc3a8b455708/include/elf/common.h

so so source:
https://github.com/torvalds/linux/blob/master/include/uapi/linux/elf.h

so so source with explanation:
https://docs.oracle.com/cd/E19683-01/817-3677/chapter6-94076/index.html

*/


const e_ident = {
    
    /* File class */
    EI_CLASS: {
        0: "ELFCLASSNONE",  /* Invalid class */
        1: "ELFCLASS32",    /* 32-bit objects */
        2: "ELFCLASS64"     /* 64-bit objects */
    },
    /* Data encoding */
    EI_DATA: {
        0: "ELFDATANONE", /* Invalid data encoding */
        1: "ELFDATA2LSB", /* 2's complement, little endian */
        2: "ELFDATA2MSB"  /* 2's complement, big endian */
    },
    /* File version */
    EI_VERSION: {
        0: "EV_NONE",
        1: "EV_CURRENT"
    },
    /* Operating System/ABI indication */
    EI_OSABI: {
        0: "ELFOSABI_NONE",             /* UNIX System V ABI */
        1: "ELFOSABI_HPUX",             /* HP-UX operating system */
        2: "ELFOSABI_NETBSD",           /* NetBSD */
        3: "ELFOSABI_LINUX",            /* GNU and LINUX */
        4: "UNKNOWN",
        5: "UNKNOWN",
        6: "ELFOSABI_SOLARIS",          /* Solaris */
        7: "ELFOSABI_AIX",              /* AIX */
        8: "ELFOSABI_IRIX",             /* IRIX */
        9: "ELFOSABI_FREEBSD",          /* FreeBSD */
        10: "ELFOSABI_TRU64",           /* TRU64 UNIX */
        11: "ELFOSABI_MODESTO",         /* Novell Modesto */
        12: "ELFOSABI_OPENBSD",         /* OpenBSD */
        13 : "ELFOSABI_OPENVMS",        /* OpenVMS */
        14 : "ELFOSABI_NSK",            /* Hewlett-Packard Non-Stop Kernel */
        15 : "ELFOSABI_AROS",           /* AROS */
        16 : "ELFOSABI_FENIXOS",        /* FenixOS */
        17 : "ELFOSABI_CLOUDABI",       /* Nuxi CloudABI */
        18 : "ELFOSABI_OPENVOS",        /* Stratus Technologies OpenVOS */
        64 : "ELFOSABI_C6000_ELFABI",   /* Bare-metal TMS320C6000 */
        64 : "ELFOSABI_AMDGPU_HSA",     /* AMD HSA Runtime */
        65 : "ELFOSABI_C6000_LINUX",    /* Linux TMS320C6000 */
        65 : "ELFOSABI_AMDGPU_PAL",     /* AMD PAL Runtime */
        65 : "ELFOSABI_ARM_FDPIC",      /* ARM FDPIC */
        66 : "ELFOSABI_AMDGPU_MESA3D",  /* AMD Mesa3D Runtime */
        97: "ELFOSABI_ARM",             /* ARM */
        255: "ELFOSABI_STANDALONE"      /* Standalone (embedded) application */
    }
    
}

const elf_hdr = {
    /* Values for e_type, which identifies the object file type.  */
    e_type: {
        0: "ET_NONE",           /* No file type */
        1: "ET_REL",            /* Relocatable file */
        2: "ET_EXEC",           /* Position-dependent executable file */
        3: "ET_DYN",            /* Position-independent executable or shared object file */
        4: "ET_CORE",           /* Core file */
        0xFE00 : "ET_LOOS",	    /* Operating system-specific */
        0xFEFF : "ET_HIOS",	    /* Operating system-specific */
        0xFF00 : "ET_LOPROC",	/* Processor-specific */
        0xFFFF : "ET_HIPROC"	/* Processor-specific */
    },
    
    /* Values for e_machine, which identifies the architecture.  These numbers
    are officially assigned by registry@sco.com.  See below for a list of
    ad-hoc numbers used during initial development.  */
    
    e_machine: {
        
        0 : "EM_NONE",  	        /* No machine */
        1 : "EM_M32",		  	    /* AT&T WE 32100 */
        2 : "EM_SPARC",	  	        /* SUN SPARC */
        3 : "EM_386",		  	    /* Intel 80386 */
        4 : "EM_68K",		  	    /* Motorola m68k family */
        5 : "EM_88K",		  	    /* Motorola m88k family */
        6 : "EM_IAMCU",	  	        /* Intel MCU */
        7 : "EM_860",		  	    /* Intel 80860 */
        8 : "EM_MIPS",		  	    /* MIPS R3000 (officially, big-endian only) */
        9 : "EM_S370",		  	    /* IBM System/370 */
        10 : "EM_MIPS_RS3_LE",	    /* MIPS R3000 little-endian (Oct 4 1999 Draft).  Deprecated.  */
        11 : "EM_OLD_SPARCV9",	    /* Old version of Sparc v9, from before the ABI.  Deprecated.  */
        11 : "EM_res011",	 	    /* Reserved */
        12 : "EM_res012",	 	    /* Reserved */
        13 : "EM_res013",	 	    /* Reserved */
        14 : "EM_res014",	 	    /* Reserved */
        15 : "EM_PARISC",	 	    /* HPPA */
        16 : "EM_res016",	 	    /* Reserved */
        17 : "EM_PPC_OLD",	 	    /* Old version of PowerPC.  Deprecated.  */
        17 : "EM_VPP550",	 	    /* Fujitsu VPP500 */
        18 : "EM_SPARC32PLUS",	    /* Sun's "v8plus" */
        19 : "EM_960",		 	    /* Intel 80960 */
        20 : "EM_PPC",		 	    /* PowerPC */
        21 : "EM_PPC64",	 	    /* 64-bit PowerPC */
        22 : "EM_S390",		 	    /* IBM S/390 */
        23 : "EM_SPU",		 	    /* Sony/Toshiba/IBM SPU */
        24 : "EM_res024",	 	    /* Reserved */
        25 : "EM_res025",	 	    /* Reserved */
        26 : "EM_res026",	 	    /* Reserved */
        27 : "EM_res027",	 	    /* Reserved */
        28 : "EM_res028",	 	    /* Reserved */
        29 : "EM_res029",	 	    /* Reserved */
        30 : "EM_res030",	 	    /* Reserved */
        31 : "EM_res031",	 	    /* Reserved */
        32 : "EM_res032",	 	    /* Reserved */
        33 : "EM_res033",	 	    /* Reserved */
        34 : "EM_res034",	 	    /* Reserved */
        35 : "EM_res035",	 	    /* Reserved */
        36 : "EM_V800",		 	    /* NEC V800 series */
        37 : "EM_FR20",		 	    /* Fujitsu FR20 */
        38 : "EM_RH32",		 	    /* TRW RH32 */
        39 : "EM_MCORE",	 	    /* Motorola M*Core */ /* May also be taken by Fujitsu MMA */
        39 : "EM_RCE",		 	    /* Old name for MCore */
        40 : "EM_ARM",		 	    /* ARM */
        41 : "EM_OLD_ALPHA",	 	/* Digital Alpha */
        42 : "EM_SH",		 	    /* Renesas (formerly Hitachi) / SuperH SH */
        43 : "EM_SPARCV9",	 	    /* SPARC v9 64-bit */
        44 : "EM_TRICORE",	 	    /* Siemens Tricore embedded processor */
        45 : "EM_ARC",		 	    /* ARC Cores */
        46 : "EM_H8_300",	 	    /* Renesas (formerly Hitachi) H8/300 */
        47 : "EM_H8_300H",	 	    /* Renesas (formerly Hitachi) H8/300H */
        48 : "EM_H8S",		 	    /* Renesas (formerly Hitachi) H8S */
        49 : "EM_H8_500",	 	    /* Renesas (formerly Hitachi) H8/500 */
        50 : "EM_IA_64",	 	    /* Intel IA-64 Processor */
        51 : "EM_MIPS_X",	 	    /* Stanford MIPS-X */
        52 : "EM_COLDFIRE",	 	    /* Motorola Coldfire */
        53 : "EM_68HC12",	 	    /* Motorola M68HC12 */
        54 : "EM_MMA",		 	    /* Fujitsu Multimedia Accelerator */
        55 : "EM_PCP",		 	    /* Siemens PCP */
        56 : "EM_NCPU",		 	    /* Sony nCPU embedded RISC processor */
        57 : "EM_NDR1",		 	    /* Denso NDR1 microprocessor */
        58 : "EM_STARCORE",	 	    /* Motorola Star*Core processor */
        59 : "EM_ME16",		 	    /* Toyota ME16 processor */
        60 : "EM_ST100",	 	    /* STMicroelectronics ST100 processor */
        61 : "EM_TINYJ",	 	    /* Advanced Logic Corp. TinyJ embedded processor */
        62 : "EM_X86_64",	 	    /* Advanced Micro Devices X86-64 processor */
        63 : "EM_PDSP",		 	    /* Sony DSP Processor */
        64 : "EM_PDP10",	 	    /* Digital Equipment Corp. PDP-10 */
        65 : "EM_PDP11",	 	    /* Digital Equipment Corp. PDP-11 */
        66 : "EM_FX66",		 	    /* Siemens FX66 microcontroller */
        67 : "EM_ST9PLUS",	 	    /* STMicroelectronics ST9+ 8/16 bit microcontroller */
        68 : "EM_ST7",		 	    /* STMicroelectronics ST7 8-bit microcontroller */
        69 : "EM_68HC16",	 	    /* Motorola MC68HC16 Microcontroller */
        70 : "EM_68HC11",	 	    /* Motorola MC68HC11 Microcontroller */
        71 : "EM_68HC08",	 	    /* Motorola MC68HC08 Microcontroller */
        72 : "EM_68HC05",	 	    /* Motorola MC68HC05 Microcontroller */
        73 : "EM_SVX",		 	    /* Silicon Graphics SVx */
        74 : "EM_ST19",		 	    /* STMicroelectronics ST19 8-bit cpu */
        75 : "EM_VAX",		 	    /* Digital VAX */
        76 : "EM_CRIS",		 	    /* Axis Communications 32-bit embedded processor */
        77 : "EM_JAVELIN",	 	    /* Infineon Technologies 32-bit embedded cpu */
        78 : "EM_FIREPATH",	 	    /* Element 14 64-bit DSP processor */
        79 : "EM_ZSP",		 	    /* LSI Logic's 16-bit DSP processor */
        80 : "EM_MMIX",		 	    /* Donald Knuth's educational 64-bit processor */
        81 : "EM_HUANY",	 	    /* Harvard's machine-independent format */
        82 : "EM_PRISM",	 	    /* SiTera Prism */
        83 : "EM_AVR",		 	    /* Atmel AVR 8-bit microcontroller */
        84 : "EM_FR30",		 	    /* Fujitsu FR30 */
        85 : "EM_D10V",		 	    /* Mitsubishi D10V */
        86 : "EM_D30V",		 	    /* Mitsubishi D30V */
        87 : "EM_V850",		 	    /* Renesas V850 (formerly NEC V850) */
        88 : "EM_M32R",		 	    /* Renesas M32R (formerly Mitsubishi M32R) */
        89 : "EM_MN10300",	 	    /* Matsushita MN10300 */
        90 : "EM_MN10200",	 	    /* Matsushita MN10200 */
        91 : "EM_PJ",		 	    /* picoJava */
        92 : "EM_OR1K",		 	    /* OpenRISC 1000 32-bit embedded processor */
        93 : "EM_ARC_COMPACT",	    /* ARC International ARCompact processor */
        94 : "EM_XTENSA",	 	    /* Tensilica Xtensa Architecture */
        95 : "EM_SCORE_OLD",	 	/* Old Sunplus S+core7 backend magic number. Written in the absence of an ABI.  */
        95 : "EM_VIDEOCORE",	 	/* Alphamosaic VideoCore processor */
        96 : "EM_TMM_GPP",	 	    /* Thompson Multimedia General Purpose Processor */
        97 : "EM_NS32K",	 	    /* National Semiconductor 32000 series */
        98 : "EM_TPC",		 	    /* Tenor Network TPC processor */
        99 : "EM_PJ_OLD",	 	    /* Old value for picoJava.  Deprecated.  */
        99 : "EM_SNP1K",	 	    /* Trebia SNP 1000 processor */
        100 : "EM_ST200",		    /* STMicroelectronics ST200 microcontroller */
        101 : "EM_IP2K",			/* Ubicom IP2022 micro controller */
        102 : "EM_MAX",			    /* MAX Processor */
        103 : "EM_CR",			    /* National Semiconductor CompactRISC */
        104 : "EM_F2MC16",		    /* Fujitsu F2MC16 */
        105 : "EM_MSP430",		    /* TI msp430 micro controller */
        106 : "EM_BLACKFIN",		/* ADI Blackfin */
        107 : "EM_SE_C33",		    /* S1C33 Family of Seiko Epson processors */
        108 : "EM_SEP",			    /* Sharp embedded microprocessor */
        109 : "EM_ARCA",			/* Arca RISC Microprocessor */
        110 : "EM_UNICORE",		    /* Microprocessor series from PKU-Unity Ltd. and MPRC of Peking University */
        111 : "EM_EXCESS",		    /* eXcess: 16/32/,64-bit configurable embedded CPU */
        112 : "EM_DXP",			    /* Icera Semiconductor Inc. Deep Execution Processor */
        113 : "EM_ALTERA_NIOS2",	/* Altera Nios II soft-core processor */
        114 : "EM_CRX",			    /* National Semiconductor CRX */
        115 : "EM_CR16_OLD",		/* Old, value for National Semiconductor CompactRISC.  Deprecated.  */
        115 : "EM_XGATE",		    /* Motorola XGATE embedded processor */
        116 : "EM_C166",			/* Infineon C16x/XC16x processor */
        117 : "EM_M16C",			/* Renesas M16C series microprocessors */
        118 : "EM_DSPIC30F",		/* Microchip Technology dsPIC30F Digital Signal Controller */
        119 : "EM_CE",			    /* Freescale Communication Engine RISC core */
        120 : "EM_M32C",			/* Renesas M32C series microprocessors */
        121 : "EM_res121",		    /* Reserved */
        122 : "EM_res122",		    /* Reserved */
        123 : "EM_res123",		    /* Reserved */
        124 : "EM_res124",		    /* Reserved */
        125 : "EM_res125",		    /* Reserved */
        126 : "EM_res126",		    /* Reserved */
        127 : "EM_res127",		    /* Reserved */
        128 : "EM_res128",		    /* Reserved */
        129 : "EM_res129",		    /* Reserved */
        130 : "EM_res130",		    /* Reserved */
        131 : "EM_TSK3000",		    /* Altium TSK3000 core */
        132 : "EM_RS08",			/* Freescale RS08 embedded processor */
        133 : "EM_res133",		    /* Reserved */
        134 : "EM_ECOG2",		    /* Cyan Technology eCOG2 microprocessor */
        135 : "EM_SCORE",		    /* Sunplus Score */
        135 : "EM_SCORE7",		    /* Sunplus S+core7 RISC processor */
        136 : "EM_DSP24",		    /* New Japan Radio (NJR) 24-bit DSP Processor */
        137 : "EM_VIDEOCORE3",	    /* Broadcom VideoCore III processor */
        138 : "EM_LATTICEMICO32",   /* RISC processor for Lattice FPGA architecture */
        139 : "EM_SE_C17",		    /* Seiko Epson C17 family */
        140 : "EM_TI_C6000",		/* Texas Instruments TMS320C6000 DSP family */
        141 : "EM_TI_C2000",		/* Texas Instruments TMS320C2000 DSP family */
        142 : "EM_TI_C5500",		/* Texas Instruments TMS320C55x DSP family */
        143 : "EM_res143",		    /* Reserved */
        144 : "EM_TI_PRU",		    /* Texas Instruments Programmable Realtime Unit */
        145 : "EM_res145",		    /* Reserved */
        146 : "EM_res146",		    /* Reserved */
        147 : "EM_res147",		    /* Reserved */
        148 : "EM_res148",		    /* Reserved */
        149 : "EM_res149",		    /* Reserved */
        150 : "EM_res150",		    /* Reserved */
        151 : "EM_res151",		    /* Reserved */
        152 : "EM_res152",		    /* Reserved */
        153 : "EM_res153",		    /* Reserved */
        154 : "EM_res154",		    /* Reserved */
        155 : "EM_res155",		    /* Reserved */
        156 : "EM_res156",		    /* Reserved */
        157 : "EM_res157",		    /* Reserved */
        158 : "EM_res158",		    /* Reserved */
        159 : "EM_res159",		    /* Reserved */
        160 : "EM_MMDSP_PLUS",	    /* STMicroelectronics 64bit VLIW Data Signal Processor */
        161 : "EM_CYPRESS_M8C",	    /* Cypress M8C microprocessor */
        162 : "EM_R32C",			/* Renesas R32C series microprocessors */
        163 : "EM_TRIMEDIA",		/* NXP Semiconductors TriMedia architecture family */
        164 : "EM_QDSP6",		    /* QUALCOMM DSP6 Processor */
        165 : "EM_8051",			/* Intel 8051 and variants */
        166 : "EM_STXP7X",		    /* STMicroelectronics STxP7x family */
        167 : "EM_NDS32",		    /* Andes Technology compact code size embedded RISC processor family */
        168 : "EM_ECOG1",		    /* Cyan Technology eCOG1X family */
        168 : "EM_ECOG1X",		    /* Cyan Technology eCOG1X family */
        169 : "EM_MAXQ30",		    /* Dallas Semiconductor MAXQ30 Core Micro-controllers */
        170 : "EM_XIMO16",		    /* New Japan Radio (NJR) 16-bit DSP Processor */
        171 : "EM_MANIK",		    /* M2000 Reconfigurable RISC Microprocessor */
        172 : "EM_CRAYNV2",		    /* Cray Inc. NV2 vector architecture */
        173 : "EM_RX",			    /* Renesas RX family */
        174 : "EM_METAG",		    /* Imagination Technologies Meta processor architecture */
        175 : "EM_MCST_ELBRUS",	    /* MCST Elbrus general purpose hardware architecture */
        176 : "EM_ECOG16",		    /* Cyan Technology eCOG16 family */
        177 : "EM_CR16",			/* National Semiconductor CompactRISC 16-bit processor */
        178 : "EM_ETPU",			/* Freescale Extended Time Processing Unit */
        179 : "EM_SLE9X",		    /* Infineon Technologies SLE9X core */
        180 : "EM_L1OM",			/* Intel L1OM */
        181 : "EM_K1OM",			/* Intel K1OM */
        182 : "EM_INTEL182",		/* Reserved by Intel */
        183 : "EM_AARCH64",		    /* ARM 64-bit architecture */
        184 : "EM_ARM184",		    /* Reserved by ARM */
        185 : "EM_AVR32",		    /* Atmel Corporation 32-bit microprocessor family */
        186 : "EM_STM8",			/* STMicroeletronics STM8 8-bit microcontroller */
        187 : "EM_TILE64",		    /* Tilera TILE64 multicore architecture family */
        188 : "EM_TILEPRO",		    /* Tilera TILEPro multicore architecture family */
        189 : "EM_MICROBLAZE",	    /* Xilinx MicroBlaze 32-bit RISC soft processor core */
        190 : "EM_CUDA",			/* NVIDIA CUDA architecture */
        191 : "EM_TILEGX",		    /* Tilera TILE-Gx multicore architecture family */
        192 : "EM_CLOUDSHIELD", 	/* CloudShield architecture family */
        193 : "EM_COREA_1ST", 	    /* KIPO-KAIST Core-A 1st generation processor family */
        194 : "EM_COREA_2ND", 	    /* KIPO-KAIST Core-A 2nd generation processor family */
        195 : "EM_ARC_COMPACT2",    /* Synopsys ARCompact V2 */
        196 : "EM_OPEN8", 		    /* Open8 8-bit RISC soft processor core */
        197 : "EM_RL78",			/* Renesas RL78 family.  */
        198 : "EM_VIDEOCORE5", 	    /* Broadcom VideoCore V processor */
        199 : "EM_78K0R",           /* Renesas 78K0R.  */
        200 : "EM_56800EX", 		/* Freescale 56800EX Digital Signal Controller (DSC) */
        201 : "EM_BA1", 			/* Beyond BA1 CPU architecture */
        202 : "EM_BA2", 			/* Beyond BA2 CPU architecture */
        203 : "EM_XCORE", 	        /* XMOS xCORE processor family */
        204 : "EM_MCHP_PIC", 	    /* Microchip 8-bit PIC(r) family */
        205 : "EM_INTELGT",		    /* Intel Graphics Technology */
        206 : "EM_INTEL206",		/* Reserved by Intel */
        207 : "EM_INTEL207",		/* Reserved by Intel */
        208 : "EM_INTEL208",		/* Reserved by Intel */
        209 : "EM_INTEL209",		/* Reserved by Intel */
        210 : "EM_KM32", 	        /* KM211 KM32 32-bit processor */
        211 : "EM_KMX32", 	        /* KM211 KMX32 32-bit processor */
        212 : "EM_KMX16", 	        /* KM211 KMX16 16-bit processor */
        213 : "EM_KMX8", 	        /* KM211 KMX8 8-bit processor */
        214 : "EM_KVARC", 	        /* KM211 KVARC processor */
        215 : "EM_CDP", 		    /* Paneve CDP architecture family */
        216 : "EM_COGE", 	        /* Cognitive Smart Memory Processor */
        217 : "EM_COOL", 	        /* Bluechip Systems CoolEngine */
        218 : "EM_NORC", 	        /* Nanoradio Optimized RISC */
        219 : "EM_CSR_KALIMBA",	    /* CSR Kalimba architecture family */
        220 : "EM_Z80", 			/* Zilog Z80 */
        221 : "EM_VISIUM",	        /* Controls and Data Services VISIUMcore processor */
        222 : "EM_FT32",            /* FTDI Chip FT32 high performance 32-bit RISC architecture */
        223 : "EM_MOXIE",           /* Moxie processor family */
        224 : "EM_AMDGPU", 	        /* AMD GPU architecture */
        243 : "EM_RISCV", 	        /* RISC-V */
        244 : "EM_LANAI",	        /* Lanai 32-bit processor.  */
        245 : "EM_CEVA",			/* CEVA Processor Architecture Family */
        246 : "EM_CEVA_X2",		    /* CEVA X2 Processor Family */
        247 : "EM_BPF",			    /* Linux BPF – in-kernel virtual machine.  */
        248 : "EM_GRAPHCORE_IPU",   /* Graphcore Intelligent Processing Unit */
        249 : "EM_IMG1",		    /* Imagination Technologies */
        250 : "EM_NFP",		        /* Netronome Flow Processor.  */
        251 : "EM_VE",		        /* NEC Vector Engine */
        252 : "EM_CSKY",		    /* C-SKY processor family.  */
        253 : "EM_ARC_COMPACT3_64",	/* Synopsys ARCv2.3 64-bit */
        254 : "EM_MCS6502",	    	/* MOS Technology MCS 6502 processor */
        255 : "EM_ARC_COMPACT3",	/* Synopsys ARCv2.3 32-bit */
        256 : "EM_KVX",		    	/* Kalray VLIW core of the MPPA processor family */
        257 : "EM_65816",	        /* WDC 65816/65C816 */
        258 : "EM_LOONGARCH",	    /* LoongArch */
        259 : "EM_KF32",		    /* ChipON KungFu32 */
        260 : "EM_U16_U8CORE",	    /* LAPIS nX-U16/U8 */
        261 : "EM_TACHYUM",	    	/* Tachyum */
        262 : "EM_56800EF",	    	/* NXP 56800EF Digital Signal Controller (DSC) */
        
        /* If it is necessary to assign new unofficial EM_* values, please pick large
        random numbers (0x8523, 0xa7f2, etc.) to minimize the chances of collision
        with official or non-GNU unofficial values.
        
        NOTE: Do not just increment the most recent number by one.
        Somebody else somewhere will do exactly the same thing, and you
        will have a collision.  Instead, pick a random number.
        
        Normally, each entity or maintainer responsible for a machine with an
        unofficial e_machine number should eventually ask registry@sco.com for
        an officially blessed number to be added to the list above.	*/
        
        0x1057 : "EM_AVR_OLD",		    /* AVR magic number.  Written in the absense of an ABI.  */
        0x1059 : "EM_MSP430_OLD",		/* MSP430 magic number.  Written in the absense of everything.  */
        0x2530 : "EM_MT",			    /* Morpho MT.   Written in the absense of an ABI.  */
        0x3330 : "EM_CYGNUS_FR30",		/* FR30 magic number - no EABI available.  */
        0x4157 : "EM_WEBASSEMBLY",		/* Unofficial value for Web Assembly binaries, as used by LLVM.  */
        0x4DEF : "EM_S12Z",             /* Freescale S12Z.   The Freescale toolchain generates elf files with this value.  */
        0x5aa5 : "EM_DLX",			    /* DLX magic number.  Written in the absense of an ABI.  */
        0x5441 : "EM_CYGNUS_FRV",		/* FRV magic number - no EABI available??.  */
        0x4688 : "EM_XC16X",            /* Infineon Technologies 16-bit microcontroller with C166-V2 core.  */
        0x7650 : "EM_CYGNUS_D10V",		/* D10V backend magic number.  Written in the absence of an ABI.  */
        0x7676 : "EM_CYGNUS_D30V",		/* D30V backend magic number.  Written in the absence of an ABI.  */
        0x8217 : "EM_IP2K_OLD",		    /* Ubicom IP2xxx;   Written in the absense of an ABI.  */
        0x9025 : "EM_CYGNUS_POWERPC",	/* Cygnus PowerPC ELF backend.  Written in the absence of an ABI.  */
        0x9026 : "EM_ALPHA",            /* Alpha backend magic number.  Written in the absence of an ABI.  */
        0x9041 : "EM_CYGNUS_M32R",		/* Cygnus M32R ELF backend.  Written in the absence of an ABI.  */
        0x9080 : "EM_CYGNUS_V850",		/* V850 backend magic number.  Written in the absense of an ABI.  */
        0xa390 : "EM_S390_OLD",		    /* old S/390 backend magic number. Written in the absence of an ABI.  */
        0xabc7 : "EM_XTENSA_OLD",		/* Old, unofficial value for Xtensa.  */
        0xad45 : "EM_XSTORMY16",		    
        0xbeef : "EM_CYGNUS_MN10300",	/* mn10200 and mn10300 backend magic numbers. Written in the absense of an ABI.  */
        0xdead : "EM_CYGNUS_MN10200",	    
        0xFEB0 : "EM_M32C_OLD",		    /* Renesas M32C and M16C.  */
        0xFEBA : "EM_IQ2000",		    /* Vitesse IQ2000.  */
        0xFEBB : "EM_NIOS32",		    /* NIOS magic number - no EABI available.  */
        0xF00D : "EM_CYGNUS_MEP",		/* Toshiba MeP */
        0xFEED : "EM_MOXIE_OLD",         /* Old, unofficial value for Moxie.  */
        0xbaab : "EM_MICROBLAZE_OLD",	/* Old MicroBlaze */
        0x1223 : "EM_ADAPTEVA_EPIPHANY"	/* Adapteva's Epiphany architecture.  */
        // 92 : "EM_OPENRISC",		    /* Old constant that might be in use by some software. */
        // 39 : "EM_CSKY_OLD",		    /* C-SKY historically used 39, the same value as MCORE, from which the architecture was derived.  */
        
        
        
    },
    /* Values for e_version.  */
    e_version : {
        0 : "EV_NONE", /* Invalid ELF version */
        1 : "EV_CURRENT" /* Current version */
    },
    /* Value for e_phnum. */
    e_phnum : {
        /*
        This is defined as 0xffff, the largest number e_phnum can have, 
        specifying where the actual number of program headers is assigned
        */
        0xffff : "PN_XNUM" /* Extended numbering */
    },

    e_shstrndx : {
        0 : "SHN_UNDEF",
        0xffff : "SHN_XINDEX",

    },


    "PN_XNUM" : 0xffff,

    /* special section indexes that are shared between other members*/

    "SHN_UNDEF" : 0x0,
    "SHN_LORESERVE" : 0xff00,
    "SHN_LOPROC" : 0xff00,
    "SHN_HIPROC" : 0xff1f,
    "SHN_LIVEPATCH" : 0xff20,
    "SHN_ABS" : 0xfff1,
    "SHN_COMMON" : 0xfff2,
    "SHN_HIRESERVE" : 0xffff

}

/* These constants are for the segment types stored in the image headers */
const elf_phdr = {
    /* Values for program header, p_type field.  */
    p_type: {
        0 : "PT_NULL",             /* Program header table entry unused */
        1 : "PT_LOAD",             /* Loadable program segment */
        2 : "PT_DYNAMIC",          /* Dynamic linking information */
        3 : "PT_INTERP",           /* Program interpreter */
        4 : "PT_NOTE",             /* Auxiliary information */
        5 : "PT_SHLIB",            /* Reserved, unspecified semantics */
        6 : "PT_PHDR",             /* Entry for header table itself */
        7 : "PT_TLS",              /* Thread local storage segment */
        0x60000000 : "PT_LOOS",    /* OS-specific */
        0x6fffffff : "PT_HIOS",    /* OS-specific */
        0x70000000 : "PT_LOPROC",  /* Processor-specific */
        0x7fffffff : "PT_HIPROC",  /* Processor-specific */
        0x6474E550 : "PT_GNU_EH_FRAME", /* Frame unwind information */
        // 0x6474E550 : "PT_SUNW_EH_FRAME",  /* Solaris uses the same value */
        0x6474E551 : "PT_GNU_STACK",    /* Stack flags */
        0x6474E552 : "PT_GNU_RELRO",    /* Read-only after relocation */
        0x6474E553 : "PT_GNU_PROPERTY",  /* GNU property */
        0x6474E554 : "PT_GNU_SFRAME",
        
        /* OpenBSD segment types.  */
        0x65a3dbe6 : "PT_OPENBSD_RANDOMIZE", /* Fill with random data.  */
        0x65a3dbe7 : "PT_OPENBSD_WXNEEDED ", /* Program does W^X violations.  */
        0x65a41be6 : "PT_OPENBSD_BOOTDATA ", /* Section for boot arguments.  */
        
        /* Mbind segments */
        4096 : "PT_GNU_MBIND_NUM", 
        0x6474e555 : "PT_GNU_MBIND_LO", 
        0x6474f554 : "PT_GNU_MBIND_HI" 
    },
    /* Program segment permissions, in program header p_flags field.  */
    p_flags : {
        0x1 : "PF_X", /* Segment is executable */
        0x2 : "PF_W", /* Segment is writable */
        0x4 : "PF_R", /* Segment is readable */
        0x0FF00000 : "PF_MASKOS", /* New value, Oct 4, 1999 Draft */
        0xF0000000 : "PF_MASKPROC" /* Processor-specific reserved bits */
    }
}

const elf_shdr = {
    /* Values for section header, sh_type field.  */
    sh_type : {
        0 : "SHT_NULL", /* Section header table entry unused */
        1 : "SHT_PROGBITS", /* Program specific (private) data */
        2 : "SHT_SYMTAB", /* Link editing symbol table */
        3 : "SHT_STRTAB", /* A string table */
        4 : "SHT_RELA", /* Relocation entries with addends */
        5 : "SHT_HASH", /* A symbol hash table */
        6 : "SHT_DYNAMIC", /* Information for dynamic linking */
        7 : "SHT_NOTE", /* Information that marks file */
        8 : "SHT_NOBITS", /* Section occupies no space in file */
        9 : "SHT_REL", /* Relocation entries, no addends */
        10 : "SHT_SHLIB", /* Reserved, unspecified semantics */
        11 : "SHT_DYNSYM", /* Dynamic linking symbol table */
        12 : "SHT_NUM",
        14 : "SHT_INIT_ARRAY",	  		/* Array of ptrs to init functions */
        15 : "SHT_FINI_ARRAY",	  		/* Array of ptrs to finish functions */
        16 : "SHT_PREINIT_ARRAY", 		/* Array of ptrs to pre-init funcs */
        17 : "SHT_GROUP",	  		/* Section contains a section group */
        18 : "SHT_SYMTAB_SHNDX",  		/* Indices for SHN_XINDEX entries */
        19 : "SHT_RELR",	  		/* RELR relative relocations */
        
        0x60000000 : "SHT_LOOS",		/* First of OS specific semantics */
        0x6fffffff : "SHT_HIOS",		/* Last of OS specific semantics */
        0x6fff4700 : "SHT_GNU_INCREMENTAL_INPUTS",    /* incremental build data */
        0x6ffffff5 : "SHT_GNU_ATTRIBUTES", 	/* Object attributes */
        0x6ffffff6 : "SHT_GNU_HASH",		/* GNU style symbol hash table */
        0x6ffffff7 : "SHT_GNU_LIBLIST",		/* List of prelink dependencies */
        
        /* The next three section types are defined by Solaris, and are named
        SHT_SUNW*.  We use them in GNU code, so we also define SHT_GNU*
        versions.  */
        // 0x6ffffffd : "SHT_SUNW_verdef",		/* Versions defined by file */
        // 0x6ffffffe : "SHT_SUNW_verneed", 	/* Versions needed by file */
        // 0x6fffffff : "SHT_SUNW_versym",		/* Symbol versions */
        0x6ffffffd : "SHT_GNU_verdef",	
        0x6ffffffe : "SHT_GNU_verneed",	
        0x6fffffff : "SHT_GNU_versym",	
        
        0x70000000 : "SHT_LOPROC", /* Processor-specific semantics, lo */
        0x7fffffff : "SHT_HIPROC", /* Processor-specific semantics, hi */
        0x80000000 : "SHT_LOUSER", /* Application-specific semantics */
        0xffffffff : "SHT_HIUSER" /* New value, defined in Oct 4, 1999 Draft */
    },
    /* Values for section header, sh_flags field.  */
    sh_flags : {
        0x1 : "SHF_WRITE", /* Writable data during execution */
        0x2 : "SHF_ALLOC", /* Occupies memory during execution */
        0x4 : "SHF_EXECINSTR", /* Executable machine instructions */
        0x10 : "SHF_MERGE", /* Data in this section can be merged */
        0x20 : "SHF_STRINGS", /* Contains null terminated character strings */
        0x40 : "SHF_INFO_LINK", /* sh_info holds section header table index */
        0x80 : "SHF_LINK_ORDER", /* Preserve section ordering when linking */
        0x100 : "SHF_OS_NONCONFORMING", /* OS specific processing required */
        0x200 : "SHF_GROUP", /* Member of a section group */
        0x400 : "SHF_TLS", /* Thread local storage section */
        0x800 : "SHF_COMPRESSED", /* Section with compressed data */
        0x0FF00000 : "SHF_MASKOS", /* New value, Oct 4, 1999 Draft */
        0x200000 : "SHF_GNU_RETAIN", /* Section should not be garbage collected by the linker.  */
        0xF0000000 : "SHF_MASKPROC", /* Processor-specific semantics */
        0x80000000 : "SHF_EXCLUDE", /* Link editor is to exclude this section from executable and shared library that it builds when those objects are not to be further relocated.  */
        0x01000000 : "SHF_GNU_MBIND", /* Mbind section.  */
        0x00100000 : "SHF_RELA_LIVEPATCH",	
        0x00200000 : "SHF_RO_AFTER_INIT"
    },
    
    
}


