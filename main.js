
function printHexValues(dataView, addressToPartMapping) {
    const length = dataView.byteLength;
  
    let table = "<table role='grid' class='hex-table'>";
    table += "<tr><th>Offset</th><th>Hex Bytes</th><th>ASCII</th></tr>";
  
    for (let address = 0; address < length; address += 16) {
      let hexValues = "";
      let asciiValues = "";
  
      for (let offset = 0; offset < 16; offset++) {
        if (address + offset < length) {
          const hexValue = dataView.getUint8(address + offset).toString(16).padStart(2, "0");
          const asciiChar = dataView.getUint8(address + offset);
          const asciiValue = (asciiChar >= 32 && asciiChar <= 126) ? String.fromCharCode(asciiChar) : ".";
  
          const part = addressToPartMapping[address + offset];
  
          // Generate a hyperlink to the corresponding ELF file part
          const hyperlink = part ? `<a href="#${part.offset}">${hexValue}</a>` : hexValue;
  
          hexValues += (offset % 2 === 1) ? `${hyperlink} ` : hyperlink;
          asciiValues += asciiValue;
        }
      }
  
      // Append a row to the table with the address, hex values, and ASCII values
      table += `<tr>
                  <td>${address.toString(16).padStart(8, "0")}</td>
                  <td>${hexValues.padEnd(39, " ")}</td>
                  <td>${asciiValues}</td>
                </tr>`;
    }
  
    table += "</table>";
  
    return table;
  }
  


function create_table(parsedElf){
    
    var addressToPartMapping = {};
    
    for (const partName in parsedElf.e_ident) {
        const part = parsedElf.e_ident[partName];
        const { offset, size_bytes } = part;
        
        for (var i = offset; i < offset + size_bytes; i++) {
            addressToPartMapping[i] = part;
        }
    }
    
    console.log(addressToPartMapping);
    
    document.getElementById("hexTable").innerHTML = printHexValues(parsedElf.elfFile, addressToPartMapping);
    
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