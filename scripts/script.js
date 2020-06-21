// machine state
const mem = [
  0x00, 0xA5, 0x26, 0xC7,
  0x00, 0x03, 0x02, 0x00,
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00
];
let pc = 1;
let ir = 0;
let r  = 0;

// load a byte into memory
function load() {
  // DEBUG: console.log(parseInt(document.getElementById('address').value, 2));
  // DEBUG: console.log(parseInt(document.getElementById('datain').value, 2));
  let addr = parseInt(document.getElementById('address').value, 2);
  let data = parseInt(document.getElementById('datain').value, 2);
  mem[addr] = data;
  // update memory in UI (textarea)
  let memstring = "";
  for (let i = 0; i < 16; i += 4) {
    let row = `${mem[i].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 1].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 2].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 3].toString(16).padStart(2, "0")} `;
    memstring += row + "\n";
    // DEBUG: console.log(row);
  }

  // update UI
  document.getElementById('memory').innerHTML = memstring;
}

// run a single instruction
function step() {
  // fetch instruction
  let ir = mem[pc];
  // get opcode from instruction
  let op = ir >> 4;
  // get memory address from instruction
  let addr = ir & 0xF;

  // DEBUG: console.log("IR: " + ir.toString(2).padStart(8, "0"));
  // DEBUG: console.log("PC: " + pc.toString(2).padStart(4, "0"));
  // DEBUG: console.log("Opcode: " + op.toString(2).padStart(4, "0"));
  // DEBUG: console.log("Address: " + addr.toString(2).padStart(4, "0"));

  // TODO: highlight current line of code

  // increment PC
  pc += 1;

  // decode instruction
  if (op == 0) return 0;                     // halt
  switch(op) {
    case 2:  r = r + mem[addr];      break;  // add
    case 4:  r = r & mem[addr];      break;  // and
    case 6:  r = r ^ mem[addr];      break;  // xor
    case 8:  r = addr;               break;  // load address
    case 10: r = mem[addr];          break;  // load word
    case 12: mem[addr] = r;          break;  // store word
    case 14: if (r == 0) pc = addr;  break;  // branch if zero
  }

  // refactor despues, update memarray?
  let memstring = "";
  for (let i = 0; i < 16; i += 4) {
    let row = `${mem[i].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 1].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 2].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 3].toString(16).padStart(2, "0")} `;
    memstring += row + "\n";
    // DEBUG: console.log(row);
  }
  // update UI
  document.getElementById('memory').innerHTML = memstring;
  document.getElementById('ir').value = ir.toString(2).padStart(8, '0');
  document.getElementById('pc').value = pc.toString(2).padStart(4, '0');
  document.getElementById('r').value = r.toString(2).padStart(8, '0');
  // no halt instruction
  return 1;
}

// run a program until halt instruction
function run() {
  while (true) {
    // DEBUG: console.log(`${pc}:  ${mem[pc].toString(16).padStart(2, '0')}`);
    let exitcode = step();
    if (exitcode == 0) { console.log('exit'); return; }
  }
}

// TODO: load code to memory from textarea
function loadcode() {
  let code = document.getElementById('code').value;
  code = code.trim().split('\n');
  // code.pop();
  console.log(code);
  for (let i = 0; i < code.length; i++) {
    mem[i + 1] = parseInt(code[i], 16);
    // DEBUG: console.log(mem[i].toString(16));
  }
  // refactor despues, update memarray?
  let memstring = "";
  for (let i = 0; i < 16; i += 4) {
    let row = `${mem[i].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 1].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 2].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 3].toString(16).padStart(2, "0")} `;
    memstring += row + "\n";
    // DEBUG: console.log(row);
  }
  document.getElementById('memory').innerHTML = memstring;
}
