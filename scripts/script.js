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

let base = 2;

// update mem array
function updateMemory() {
  let memstring = "";
  for (let i = 0; i < 16; i += 4) {
    let row = `${mem[i].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 1].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 2].toString(16).padStart(2, "0")} `;
    row += `${mem[i + 3].toString(16).padStart(2, "0")} `;
    memstring += row + "\n";
  }
  return memstring;
}

// load a byte into memory
function load() {
  let addr = parseInt(document.getElementById('address').value, 2);
  let data = parseInt(document.getElementById('datain').value, 2);
  mem[addr] = data;
  // update UI
  document.getElementById('memory').innerHTML = updateMemory();
}

// run a single instruction
function step() {
  // fetch instruction
  ir = mem[pc];
  // get opcode from instruction
  let op = ir >> 4;
  // get memory address from instruction
  let addr = ir & 0xF;

  // highlight current line of code
  document.getElementById('linenos').focus();
  document.getElementById('linenos').setSelectionRange((pc - 1) * 6, ((pc - 1) * 6) + 5);

  // TODO: highlight current memory word

  // increment PC
  pc += 1;
  updateRegisters();
  // decode instruction
  if (op == 0) return 0;                         // halt
  switch(op) {
    case 2:  r = (r + mem[addr]) % 256;  break;  // add
    case 4:  r = r & mem[addr];          break;  // and
    case 6:  r = r ^ mem[addr];          break;  // xor
    case 8:  r = addr;                   break;  // load address
    case 10: r = mem[addr];              break;  // load word
    case 12: mem[addr] = r;              break;  // store word
    case 14: if (r == 0) pc = addr;      break;  // branch if zero
  }
  // update UI
  document.getElementById('memory').innerHTML = updateMemory();
  updateRegisters();
  // no halt instruction
  return 1;
}

// update registers in UI
function updateRegisters() {
  if (base == 2) {
    let string = ir.toString(base).padStart(8, '0');
    let a = string.slice(0,4);
    let b = string.slice(4,8);
    document.getElementById('ir').value = a + ' ' + b;
    string = r.toString(base).padStart(8, '0');
    a = string.slice(0,4);
    b = string.slice(4,8);
    document.getElementById('r').value = a + ' ' + b;
    string = pc.toString(base).padStart(4, '0');
    document.getElementById('pc').value = string;
  } else if (base == 16) {
    let string = ir.toString(base).padStart(2, '0');
    document.getElementById('ir').value = string;
    string = r.toString(base).padStart(2, '0');
    document.getElementById('r').value = string;
    string = pc.toString(base);
    document.getElementById('pc').value = string;
  } else {
    let string = ir.toString(base);
    document.getElementById('ir').value = string;
    string = r.toString(base);
    document.getElementById('r').value = string;
    string = pc.toString(base);
    document.getElementById('pc').value = string;
  }
}

// run a program until halt instruction
function run() {
  while (true) {
    let exitcode = step();
    if (exitcode == 0) {
      return;
    }
  }
}

// radio buttons
function changeBase(e) {
  base = e.value;
  updateRegisters();
}

// load code from textarea into memory
function loadcode() {
  let code = document.getElementById('code').value;
  code = code.trim().split('\n');
  for (let i = 0; i < code.length; i++) {
    mem[i + 1] = parseInt(code[i], 16);
  }
  document.getElementById('memory').innerHTML = updateMemory();
  // reset registers
  pc = 1;
  ir = 0;
  r = 0;
  updateRegisters();
}
