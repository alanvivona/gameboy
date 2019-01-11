const fs = require('fs')
const readline = require('readline')

const pathToOpcodesFile = './opcodes.raw'

const pathToResultFile = './opcodes.json'

const lineReader = readline.createInterface({
    input: fs.createReadStream(pathToOpcodesFile, { flags: "r" })
})

const targetInstructionStructure = {
    opcode: null,         // Hex
    description: null,    // String
    mnemonic: null,       // String
    fullMnemonic: null,   // String
    operands: []          // Operand
}

const targetOperandStructure = {
    type: null,         // String
    size: null,         // Number (in bits)
    description: null  // String (show the operand as shown in the docs)
}
// const uniqueOperands = operandsAnalysis(isa)
/* 
    operand types :
    - r     register
    - rr    double register
    - h     inmediate hex value
    - *     anything (8 bits)
    - **    anything (16 bits)
    - f     flag
    - null  no operand
*/
const isaOperands = [

    // Registers
    { description: 'A', size: 8, type: "r" },
    { description: 'B', size: 8, type: "r" },
    { description: 'C', size: 8, type: "r" },
    { description: 'D', size: 8, type: "r" },
    { description: 'E', size: 8, type: "r" },
    { description: 'H', size: 8, type: "r" },
    { description: 'L', size: 8, type: "r" },

    // Double registers
    { description: 'AF', size: 16, type: "rr" },
    { description: 'BC', size: 16, type: "rr" },
    { description: 'DE', size: 16, type: "rr" },
    { description: 'HL', size: 16, type: "rr" },

    // 
    { description: '#', size: null, type: "" },
    
    { description: '($FF00+C)', size: null, type: "" },
    { description: '($FF00+n)', size: null, type: "" },
    { description: '(BC)', size: 8, type: "" },
    { description: '(C)', size: null, type: "" },
    { description: '(DE)', size: 8, type: "" },
    { description: '(HL)', size: 8, type: "" },
    { description: '(HL+)', size: null, type: "" },
    { description: '(HL-)', size: null, type: "" },
    { description: '(HLD)', size: null, type: "" },
    { description: '(HLI)', size: null, type: "" },
    { description: '(nn)', size: 8, type: "" },
    
    { description: '*', size: null, type: "" },
    { description: 'SP', size: null, type: "" },
    { description: 'b', size: null, type: "" },
    { description: 'n', size: 8, type: "*" },
    { description: 'nn', size: 16, type: "**" },
    
    // No operand
    { description: '-/-', size: null, type: null }

    // Hex hardcoded values
    { description: '00H', size: 0, type: "h" },
    { description: '08H', size: 0, type: "h" },
    { description: '10H', size: 0, type: "h" },
    { description: '18H', size: 0, type: "h" },
    { description: '20H', size: 0, type: "h" },
    { description: '28H', size: 0, type: "h" },
    { description: '30H', size: 0, type: "h" },
    { description: '38H', size: 0, type: "h" },
    
    // Flags
    { description: 'Z', size: null, type: "f" },
    { description: 'NC', size: null, type: "f" },
    { description: 'NZ', size: null, type: "f" },

]

let isa = {
    instructions: []
}

const clone = obj => JSON.parse(JSON.stringify(obj))

const operandsAnalysis = (isa) => {
    const uniqueOperandNomenclatures = isa.instructions
        .map(instruction => instruction.operands.map(operand => operand.description))
        .reduce((res, val) => res.concat(val), []) // flat to one dimentional array
        .filter((desc, i, arr) => arr.indexOf(desc) === i)  // unique values
        .sort()

    console.log("Operand nomenclatures:", uniqueOperandNomenclatures.length)
    console.log(uniqueOperandNomenclatures)
    return uniqueOperandNomenclatures
}

lineReader.on('line', line => {
    console.log('Read line from file:', line)

    // Example line: LD B,n 06 8
    const parameters = line.split(" ")
    const mnemonic = parameters[0]
    const operands = parameters[1]
    const opcode = parameters[2]
    const cpuCycles = parameters[3] // I don't find this usefull in this context so I'm dropping it

    let instruction = clone(targetInstructionStructure)

    instruction.opcode = parseInt(opcode, 16)
    instruction.description = "descriptions are not yet supported"
    instruction.mnemonic = mnemonic
    instruction.fullMnemonic = mnemonic + " " + operands
    instruction.operands = operands.split(",").map(o => {
        operand = clone(targetOperandStructure)
        // Need to see all the available nomenclature for the operands and come up with an algorithm to set the type and size
        operand.type = null
        operand.size = 0
        operand.description = o
        return operand
    })
    console.log('Resulting instruction:', instruction)
    isa.instructions.push(instruction)
})

lineReader.on('close', () => {
    console.log('Full set has :', isa.instructions.length, "instructions")

    isa.instructions = isa.instructions.sort((a, b) => a.opcode - b.opcode)

    fs.writeFile(pathToResultFile, JSON.stringify(isa), () => {
        console.log('Full set saved to  :', pathToResultFile)
    })
})
