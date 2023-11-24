function printHexValues(dataView, addressToPartMapping) {
    const length = dataView.byteLength;
    
    let table = "<table class='hex-table'>";
    table += `<tr><td colspan="3">ELF File Content</td></tr>`;
    table += "<tr><th>Offset</th><th>Hex</th><th>ASCII</th></tr>";
    
    for(let address = 0; address <= length; address += 8 ){
        
        let hexValuesRow = "";
        let asciiValuesRow = "";
        
        
        for(let offset = address; offset < address+7; offset += addressToPartMapping[offset].size_bytes){
            
            let part = addressToPartMapping[offset];
            
            if(!part){
                break;
            }
            
            let hexValue = "";
            let asciiChar = 0;
            let asciiValue = "";
            for(let i = 0; i < part.size_bytes; i++){
                hexValue += dataView.getUint8(offset + i).toString(16).padStart(2, "0");
                
                asciiChar = dataView.getUint8(offset + i);
                asciiValue += (asciiChar >= 32 && asciiChar <= 126) ? String.fromCharCode(asciiChar) : ".";
            }
            
            
            
            let value = "";
            if(part.action_type == "link"){
                let peek = "";
                if(addressToPartMapping[parseInt(part.raw_dec)] != null){
                    let peek = `<span style="color:#00897b;"> &larr; ${addressToPartMapping[parseInt(part.raw_dec)].name}:${addressToPartMapping[parseInt(part.raw_dec)].value} </span>`;
                }
                let value = `<a href="#${part.raw_hex.padStart(8, "0")}">${part.raw_hex.padStart(8, "0")}</a> ${peek}`;
            }else{
                
                if(typeof part.value == 'number'){
                    value = `<span style="color:#00897b;">0x${part.raw_hex}</span>`;
                }else{
                    value = `<span style="color:#00897b;">${part.value}</span>`;
                }
                
            }
            
            hexValuesRow += `<span class="byte-container" >
            <span class="hex-value">${hexValue}</span>
            <span class="value-name">${value}</span>
            <span class="field-name">${part.name}</span>
            </span>`;
            hexValuesRow += " ";
            
            asciiValuesRow += asciiValue;
            
            
        }
        
        // Append a row to the table with the address, hex values, and ASCII values
        table += `<tr>
        <td>
        <a id="${address.toString(16).padStart(8, "0")}">
        ${address.toString(16).padStart(8, "0")}
        </a>
        </td>
        <td class="hex-values-cell">${hexValuesRow}</td>
        <td>${asciiValuesRow}</td>
        </tr>`;
    }
    
    
    table += "</table>";
    
    return table;
}


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
    
    // console.log(addressToPartMapping);
    
    // Use the printHexValues function to create the HTML table and insert it into the DOM.
    document.getElementById("hexTable").innerHTML = printHexValues(parsed_elf.elfFile, addressToPartMapping);
}



function create_prologue(parsed_elf){
    
    
    let table = "<table class='hex-table'>";
    table += `<tr><td colspan="4">Meta Information</td></tr>`;
    table += `<tr><td>Program Name:</td><td colspan="3" style="font-weight:bold;">${parsed_elf.file_name}</td></tr>`;
    table += `<tr><td>File Length:</td><td colspan="3">${parsed_elf.file_length} Bytes / ${Number(parsed_elf.file_length/1000/1000).toFixed(5)} MB</td></tr>`;
    table += `<tr><td>File Last Modified:</td><td colspan="3">${new Date(parsed_elf.file_last_modified).toLocaleString()}</td></tr>`;
    table += `<tr>
    <td>${parsed_elf.elf_contents.elf_hdr.e_type.value}</td>
    <td>${parsed_elf.elf_contents.elf_hdr.e_machine.value}</td>
    <td>${parsed_elf.elf_contents.e_ident.EI_CLASS.value}</td>
    <td>${parsed_elf.elf_contents.e_ident.EI_DATA.value}</td>
    </tr>`;
    
    
    table += "</table>";
    
    
    document.getElementById("prologue").innerHTML =  table;
}


function handleFiles() {
    
    let elf = new ELF();
    elf
    .run(this.files[0])
    .then((result) => {
        console.log(result);
        // create_prologue(result);
        // create_table(result);
    })
    .catch((error) => {
        console.error(error);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    
    const inputElement = document.getElementById("input");
    inputElement.addEventListener("change", handleFiles, false);
    
    
});