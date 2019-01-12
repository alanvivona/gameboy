/*
    ====== OPERAND ANALYSIS =======

    const uniqueOperands = operandsAnalysis(isa)
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

    ====== ====== ====== =======
*/

const fs = require('fs')
const readline = require('readline')

const pathToOpcodesFile = './opcodes.raw'
const pathToResultFile = './instructions.json'

const ISA_OPERANDS = require('./operands').operands
console.log("FULL ISA OPERANDS", ISA_OPERANDS)

let ISA = {instructions:[]}

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
    description: null   // String (show the operand as shown in the docs)
}

const clone = obj => JSON.parse(JSON.stringify(obj))

lineReader.on('line', line => {
    console.log('Read line from file:', line)

    // Example line: LD B,n 06 8
    const parameters = line.split(" ")
    const mnemonic = parameters[0]
    const operands = parameters[1]
    const opcode = parameters[2]
    // const cpuCycles = parameters[3] // I don't find this usefull in this context so I'm dropping it

    let instruction = clone(targetInstructionStructure)

    instruction.opcode = parseInt(opcode, 16)
    instruction.description = "descriptions are not yet supported"
    instruction.mnemonic = mnemonic
    instruction.fullMnemonic = mnemonic + " " + operands
    instruction.operands = operands.split(",").map(operandString => {
        console.log("Looking for operand", operandString, "on isa operands set")
        isaOperandsFound = ISA_OPERANDS.filter(isaOperand => operandString === isaOperand.description)
        if (isaOperandsFound.length === 1) {
            return clone(isaOperandsFound[0])
        } else {
            unknownOperand = clone(targetOperandStructure)
            unknownOperand.description = operandString
            console.warn("Found unknown operand : ", operandString, "isa search returned: ", isaOperandsFound)
            return unknownOperand
        }
    })
    console.log('Parsed instruction:', instruction)
    ISA.instructions.push(instruction)
})

lineReader.on('close', () => {
    console.log('Full set has :', ISA.instructions.length, "instructions")

    ISA.instructions = ISA.instructions.sort((a, b) => a.opcode - b.opcode)

    fs.writeFile(pathToResultFile, JSON.stringify(ISA), () => {
        console.log('Full set saved to  :', pathToResultFile)
    })
})
