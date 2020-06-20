const mem = [
  0x00, 0xA5, 0x26, 0xC7,
  0x00, 0x03, 0x02, 0x00,
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00
];

let pc = 1;
let ir = 0;
let r  = 0;

function load() {
  console.log(parseInt(document.getElementById('address').value, 2)); // DEBUG
  let addr = parseInt(document.getElementById('address').value, 2);
  console.log(parseInt(document.getElementById('datain').value, 2)); // DEBUG
  let data = parseInt(document.getElementById('datain').value, 2);
  mem[addr] = data;
  let memstring = "";
  for (let i = 0; i < 16; i += 4) {
    let row = `${mem[i].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 1].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 2].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 3].toString(16).padStart(2, "0")} `;
    memstring += row + "\n";
    console.log(row); // debug
  }
  document.getElementById('memory').innerHTML = memstring;
}

function step() {
  let ir = mem[pc];

  let op = ir >> 4;
  let addr = ir & 0xF;
  console.log("IR: " + ir.toString(2).padStart(8, "0"));
  console.log("PC: " + pc.toString(2).padStart(4, "0"));
  console.log("Opcode: " + op.toString(2).padStart(4, "0"));
  console.log("Address: " + addr.toString(2).padStart(4, "0"));



  pc += 1;
  if (op == 0) return;
  switch(op) {
    case 2:  r = r + mem[addr];      break;
    case 4:  r = r & mem[addr];      break;
    case 6:  r = r ^ mem[addr];      break;
    case 8:  r = addr;               break;
    case 10: r = mem[addr];          break;
    case 12: mem[addr] = r;          break;
    case 14: if (r == 0) pc = addr;  break;
  }

  // refactor despues
  let memstring = "";
  for (let i = 0; i < 16; i += 4) {
    let row = `${mem[i].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 1].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 2].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 3].toString(16).padStart(2, "0")} `;
    memstring += row + "\n";
    // console.log(row); // debug
  }
  document.getElementById('memory').innerHTML = memstring;

  document.getElementById('ir').value = ir.toString(2).padStart(8, "0");
  document.getElementById('pc').value = pc.toString(2).padStart(4, "0");
  document.getElementById('r').value = r.toString(2).padStart(8, "0");

}

function run() {
  // implementar
}
