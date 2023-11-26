const R_SPARC_TYPE = {
  0: "R_SPARC_NONE",
  1: "R_SPARC_8",
  2: "R_SPARC_16",
  3: "R_SPARC_32",
  4: "R_SPARC_DISP8",
  5: "R_SPARC_DISP16",
  6: "R_SPARC_DISP32",
  7: "R_SPARC_WDISP30",
  8: "R_SPARC_WDISP22",
  9: "R_SPARC_HI22",
  10: "R_SPARC_22",
  11: "R_SPARC_13",
  12: "R_SPARC_LO10",
  13: "R_SPARC_GOT10",
  14: "R_SPARC_GOT13",
  15: "R_SPARC_GOT22",
  16: "R_SPARC_PC10",
  17: "R_SPARC_PC22",
  18: "R_SPARC_WPLT30",
  19: "R_SPARC_COPY",
  20: "R_SPARC_GLOB_DAT",
  21: "R_SPARC_JMP_SLOT",
  22: "R_SPARC_RELATIVE",
  23: "R_SPARC_UA32",

  /* ??? These 6 relocs are new but not currently used.  For binary
       compatibility in the sparc64-elf toolchain, we leave them out.
       A non-binary upward compatible change is expected for sparc64-elf.  */
  /* ??? New relocs on the UltraSPARC.  Not sure what they're for yet.  */
  24: "R_SPARC_PLT32",
  25: "R_SPARC_HIPLT22",
  26: "R_SPARC_LOPLT10",
  27: "R_SPARC_PCPLT32",
  28: "R_SPARC_PCPLT22",
  29: "R_SPARC_PCPLT10",

  /* v9 relocs */
  30: "R_SPARC_10",
  31: "R_SPARC_11",
  32: "R_SPARC_64",
  33: "R_SPARC_OLO10",
  34: "R_SPARC_HH22",
  35: "R_SPARC_HM10",
  36: "R_SPARC_LM22",
  37: "R_SPARC_PC_HH22",
  38: "R_SPARC_PC_HM10",
  39: "R_SPARC_PC_LM22",
  40: "R_SPARC_WDISP16",
  41: "R_SPARC_WDISP19",
  42: "R_SPARC_UNUSED_42",
  43: "R_SPARC_7",
  44: "R_SPARC_5",
  45: "R_SPARC_6",
  46: "R_SPARC_DISP64",
  47: "R_SPARC_PLT64",
  48: "R_SPARC_HIX22",
  49: "R_SPARC_LOX10",
  50: "R_SPARC_H44",
  51: "R_SPARC_M44",
  52: "R_SPARC_L44",
  53: "R_SPARC_REGISTER",
  54: "R_SPARC_UA64",
  55: "R_SPARC_UA16",

  56: "R_SPARC_TLS_GD_HI22",
  57: "R_SPARC_TLS_GD_LO10",
  58: "R_SPARC_TLS_GD_ADD",
  59: "R_SPARC_TLS_GD_CALL",
  60: "R_SPARC_TLS_LDM_HI22",
  61: "R_SPARC_TLS_LDM_LO10",
  62: "R_SPARC_TLS_LDM_ADD",
  63: "R_SPARC_TLS_LDM_CALL",
  64: "R_SPARC_TLS_LDO_HIX22",
  65: "R_SPARC_TLS_LDO_LOX10",
  66: "R_SPARC_TLS_LDO_ADD",
  67: "R_SPARC_TLS_IE_HI22",
  68: "R_SPARC_TLS_IE_LO10",
  69: "R_SPARC_TLS_IE_LD",
  70: "R_SPARC_TLS_IE_LDX",
  71: "R_SPARC_TLS_IE_ADD",
  72: "R_SPARC_TLS_LE_HIX22",
  73: "R_SPARC_TLS_LE_LOX10",
  74: "R_SPARC_TLS_DTPMOD32",
  75: "R_SPARC_TLS_DTPMOD64",
  76: "R_SPARC_TLS_DTPOFF32",
  77: "R_SPARC_TLS_DTPOFF64",
  78: "R_SPARC_TLS_TPOFF32",
  79: "R_SPARC_TLS_TPOFF64",

  80: "R_SPARC_GOTDATA_HIX22",
  81: "R_SPARC_GOTDATA_LOX10",
  82: "R_SPARC_GOTDATA_OP_HIX22",
  83: "R_SPARC_GOTDATA_OP_LOX10",
  84: "R_SPARC_GOTDATA_OP",

  85: "R_SPARC_H34",
  86: "R_SPARC_SIZE32",
  87: "R_SPARC_SIZE64",
  88: "R_SPARC_WDISP10",

  // EMPTY_RELOC  (R_SPARC_max_std) dont know what this does ...

  248: "R_SPARC_JMP_IREL",
  249: "R_SPARC_IRELATIVE",
  250: "R_SPARC_GNU_VTINHERIT",
  251: "R_SPARC_GNU_VTENTRY",
  252: "R_SPARC_REV32",
};
