function printHexValues(dataView, addressToPartMapping) {
    const length = dataView.byteLength;
    
    var table = "<table class='hex-table'>";
    table += "<tr><th>Address</th><th>Hex Bytes</th><th>ASCII Characters</th></tr>";
    
    for(var address = 0; address <= 784; address += 16 ){

        var hexValuesRow = "";
        var asciiValuesRow = "";

        
        for(var offset = address; offset < address+16; offset += addressToPartMapping[offset].size_bytes){
            
            var part = addressToPartMapping[offset];

            if(!part){
                break;
            }
            
            var hexValue = "";
            var asciiChar = 0;
            var asciiValue = "";
            for(var i = 0; i < part.size_bytes; i++){
                hexValue += dataView.getUint8(offset + i).toString(16).padStart(2, "0");
                asciiChar = dataView.getUint8(offset + i);
                asciiValue += (asciiChar >= 32 && asciiChar <= 126) ? String.fromCharCode(asciiChar) : ".";
            }

            if(typeof part.value == 'number'){
                value = "Value: " + part.raw_dec + " / 0x" + part.raw_hex;
            }else{
                value = part.value;
            }
            
            hexValuesRow += `<a href="#${part.name}" class="byte-container" data-tooltip="${value}"><span class="hex-value">${hexValue}</span><span class="field-name">${part.name}</span></a>`;
            hexValuesRow += " ";

            asciiValuesRow += asciiValue;

            
        }
        
        // Append a row to the table with the address, hex values, and ASCII values
        table += `<tr>
        <td>${offset.toString(16).padStart(8, "0")}</td>
        <td class="hex-values-cell">${hexValuesRow}</td>
        <td>${asciiValuesRow}</td>
        </tr>`;
    }
    
    
    table += "</table>";
    
    return table;
}

// function printHexValues(dataView, addressToPartMapping) {
//     const length = dataView.byteLength;

//     var table = "<table class='hex-table'>";
//     table += "<tr><th>Address</th><th>Hex Bytes</th><th>ASCII Characters</th></tr>";

//     for (var address = 0; address < 785; address += 16) {
//         var hexValuesRow = "";
//         var asciiValuesRow = "";

//         for (var offset = 0; offset < 16; offset += addressToPartMapping[offset].size_bytes) {
//             var currentAddress = address + offset;

//             // Stop processing if current address exceeds the dataView length
//             if (currentAddress >= length) {
//                 break;
//             }

//             console.log(currentAddress);

//             var part = addressToPartMapping[currentAddress];
//             var hexValue = dataView.getUint8(currentAddress).toString(16).padStart(2, "0");
//             var asciiChar = dataView.getUint8(currentAddress);
//             var asciiValue = (asciiChar >= 32 && asciiChar <= 126) ? String.fromCharCode(asciiChar) : ".";

//             if (part && offset === part.offset % 16) {
//                 hexValuesRow += `<a href="#${part.name}" class="byte-container"><span class="hex-value">${hexValue}</span><span class="field-name">${part.name}</span></a>`;
//             } else {
//                 hexValuesRow += `<span class="byte-container"><span class="hex-value">${hexValue}</span></span>`;
//             }

//             hexValuesRow += " ";
//             asciiValuesRow += asciiValue;
//         }

//         // Append a row to the table with the address, hex values, and ASCII values
//         table += `<tr>
//         <td>${address.toString(16).padStart(8, "0")}</td>
//         <td class="hex-values-cell">${hexValuesRow}</td>
//         <td>${asciiValuesRow}</td>
//         </tr>`;
//     }

//     table += "</table>";

//     return table;
// }

/*
for (var address = 0; address < length; address += 16) {
    var hexValuesRow = "";
    var asciiValuesRow = "";
    
    for (var offset = 0; offset < 16; offset += 2) {
        if (address + offset < length) {
            
            const part = addressToPartMapping[address + offset];
            if(part == null){
                continue;
            }
            
            var hexValue = "";
            var asciiChar = 0;
            var asciiValue = "";
            for(var i = 0; i < part.size_bytes; i++){
                hexValue += dataView.getUint8(address + offset + i).toString(16).padStart(2, "0");
                asciiChar = dataView.getUint8(address + offset + i);
                asciiValue += (asciiChar >= 32 && asciiChar <= 126) ? String.fromCharCode(asciiChar) : ".";
                
                
            }
            
            // const hexValue1 = dataView.getUint8(address + offset).toString(16).padStart(2, "0");
            // const hexValue2 = dataView.getUint8(address + offset + 1).toString(16).padStart(2, "0");
            
            // const asciiChar1 = dataView.getUint8(address + offset);
            // const asciiChar2 = dataView.getUint8(address + offset + 1);
            // const asciiValue1 = (asciiChar1 >= 32 && asciiChar1 <= 126) ? String.fromCharCode(asciiChar1) : ".";
            // const asciiValue2 = (asciiChar2 >= 32 && asciiChar2 <= 126) ? String.fromCharCode(asciiChar2) : ".";
            console.log("=========");
            console.log(part);
            console.log(part.name);
            console.log(part.size_bytes);
            console.log(hexValue);
            console.log(asciiValue);
            console.log(offset);
            console.log(part.offset);
            
            // Generate a hyperlink to the corresponding ELF file part
            // if (part && offset === part.offset % 16) {
            // hexValues += `<a href="#${part.name}" class="byte-container"><span class="hex-value">${hexValue}</span><span class="field-name">${part.name}</span></a>`;
            // } else {
            // hexValues += `<span class="byte-container"><span class="hex-value">${hexValue}</span></span>`;
            // }
            if(part){
                hexValuesRow += `<a href="#${part.name}" class="byte-container"><span class="hex-value">${hexValue}</span><span class="field-name">${part.name}</span></a>`;
            }
            
            
            
            hexValuesRow += " ";
            // asciiValues += asciiValue1 + asciiValue2;
        }
    }
    
    // Append a row to the table with the address, hex values, and ASCII values
    table += `<tr>
    <td>${address.toString(16).padStart(8, "0")}</td>
    <td class="hex-values-cell">${hexValuesRow}</td>
    <td>${asciiValuesRow}</td>
    </tr>`;
}

table += "</table>";

return table;
}
*/

/**
* Creates an HTML table with the hexadecimal representation of an ELF file's contents,
* mapping the raw hex bytes to the corresponding ELF file parts.
* 
* @param {Object} parsed_elf - An object containing the parsed ELF file contents and its DataView.
*/
function create_table(parsed_elf) {
    
    // Create an object to store the mapping between byte addresses and ELF file parts.
    var addressToPartMapping = {};
    
    // Iterate over the contents of the parsed ELF file.
    for (const content_name in parsed_elf.elf_contents) {
        
        // Check if the current content is an array and specifically the "elf_phdr" content.
        if (Array.isArray(parsed_elf.elf_contents[content_name]) ) {
            // Iterate over each item in the array.
            for (const array_item in parsed_elf.elf_contents[content_name]) {
                // Iterate over each member in the current item.
                for (const member_name in parsed_elf.elf_contents[content_name][array_item]) {
                    // Get the ELF part object.
                    const part = parsed_elf.elf_contents[content_name][array_item][member_name];
                    const { offset, size_bytes } = part;
                    
                    // Map the byte addresses to the current ELF part.
                    for (var i = offset; i < offset + size_bytes; i++) {
                        addressToPartMapping[i] = part;
                        // this is to skip as many entries of the mapping as the size of a member is large
                        // e.g. the e_type is 2 bytes large, then we dont want a mapping
                        //      offset => {e_type}
                        //      offset+1 => {e_type}
                        // but, rather just to keep the first offset which effectivly reduces the mappings size
                        i += part.size_bytes;
                    }
                }
            }
            
            // this case is for when the elf part is not an array, e.g. just the header or e_ident.
            // lots of elf parts are actually arrays (e.g. phdr, shdr, symtab, ...) because they hold multiple entries.
        } else {
            // Iterate over each member in the current content.
            for (const member_name in parsed_elf.elf_contents[content_name]) {
                // Get the ELF part object.
                const part = parsed_elf.elf_contents[content_name][member_name];
                const { offset, size_bytes } = part;
                
                // Map the byte addresses to the current ELF part.
                for (var i = offset; i < offset + size_bytes; i++) {
                    addressToPartMapping[i] = part;
                    // this is to skip as many entries of the mapping as the size of a member is large
                    // e.g. the e_type is 2 bytes large, then we dont want a mapping
                    //      offset => {e_type}
                    //      offset+1 => {e_type}
                    // but, rather just to keep the first offset which effectivly reduces the mappings size
                    i += part.size_bytes;
                }
            }
        }
    }
    
    // Log the address-to-part mapping object to the console for debugging purposes.
    console.log(addressToPartMapping);
    
    // Use the printHexValues function to create the HTML table and insert it into the DOM.
    document.getElementById("hexTable").innerHTML = printHexValues(parsed_elf.elfFile, addressToPartMapping);
}


function handleFiles() {
    
    var elf = new ELF();
    elf
    .run(this.files[0])
    .then((result) => {
        console.log(result);
        create_table(result);
    })
    .catch((error) => {
        console.error(error);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    
    const inputElement = document.getElementById("input");
    inputElement.addEventListener("change", handleFiles, false);
    
    
});