"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.TinyELF = void 0;
var ElfHeader_1 = require("./lib/ElfHeader");
var TinyELF = /** @class */ (function () {
    function TinyELF() {
    }
    TinyELF.prototype.readFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var arrayBuffer, elf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Check if 'file' is provided and is a valid object
                        if (!file || typeof file !== 'object') {
                            throw new Error('Invalid file provided.');
                        }
                        return [4 /*yield*/, this.loadFile(file)];
                    case 1:
                        arrayBuffer = _a.sent();
                        elf = this.parseELF(arrayBuffer);
                        return [2 /*return*/, elf];
                }
            });
        });
    };
    TinyELF.prototype.loadFile = function (file) {
        return new Promise(function (resolve) {
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function (event) {
                resolve(event.target.result);
            };
        });
    };
    TinyELF.prototype.parseELF = function (arrayBuffer) {
        var data = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
        var elf;
        try {
            elf.elfHeader = new ElfHeader_1.ElfHeader(data).header;
        }
        catch (error) {
            console.log(error);
        }
        return elf;
        // try {
        //     this.e_ident = this.#processEIdent();
        // } catch (error) {
        //     console.log(error);
        // }
        // // check if file is lsb or msb
        // this.is_lsb = this.e_ident.EI_DATA.value == "ELFDATA2LSB";
        // // check if file is 64 or 32 bit architecture
        // this.is_64 = this.e_ident.EI_CLASS.value == "ELFCLASS64";
        // // assign correct data types depending on bit-architecture
        // this.data_types = this.is_64 ? ElfBaseTypes[64] : ElfBaseTypes[32];
        // this.elf_contents = {};
        // this.elf_contents.e_ident = this.e_ident;
        // this.elf_contents.elf_hdr = this.#processElfHdr();
        // // check what architecture file is (just a convient shortcut, less typing)
        // this.architecture = this.elf_contents.elf_hdr.e_machine.value;
        // this.elf_contents.elf_phdr = this.#processElfPhdr();
        // this.elf_contents.elf_shdr = this.#processElfShdr();
        // this.elf_contents.elf_dyn = this.#processElfDyn();
        // this.elf_contents.elf_symtab = this.#processElfSymtab();
        // this.elf_contents.elf_dynsymtab = this.#processElfDynSymtab();
        // this.elf_contents.elf_reloc = this.#processElfRelocation();
        // [this.elf_contents.elf_version_requirements, this.elf_contents.elf_version_requirements_auxillary] = this.#processElfVersionRequirements();
        // [this.elf_contents.elf_version_definitions, this.elf_contents.elf_version_definitions_auxillary] = this.#processElfVersionDefinitions();
    };
    return TinyELF;
}());
exports.TinyELF = TinyELF;
