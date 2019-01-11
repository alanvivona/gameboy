const fs = require('fs')
const readline = require('readline')

const pathToOpcodesFile = './opcodes.raw'

const pathToResultFile = './opcodes.json'

const lineReader = readline.createInterface({
    input: fs.createReadStream(pathToOpcodesFile, {flags: "r"})
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
    description : null  // String (show the operand as shown in the docs)
}

let result = {
    opcodes : []
}

const clone = obj => JSON.parse(JSON.stringify(obj))

lineReader.on('line', line => {
    console.log('Read line from file:', line)

    // Example line: LD B,n 06 8
    const parameters    = line.split(" ")
    const mnemonic      = parameters[0]
    const operands      = parameters[1]
    const opcode        = parameters[2]
    const cpuCycles     = parameters[3] // I don't find this usefull in this context so I'm dropping it

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
    result.opcodes.push(instruction)
})

lineReader.on('close', () => {
    console.log('Full set has :', result.opcodes.length, "instructions")

    result.opcodes = result.opcodes.sort((a,b) => a.opcode - b.opcode)

    fs.writeFile(pathToResultFile, JSON.stringify(result), () => {
        console.log('Full set saved to  :', pathToResultFile)
    })
})
