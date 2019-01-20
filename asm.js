const ISA = {
    instructions: require('./isa/instructions').instructions,
    operands: require('./isa/operands').operands,
}

// syntax analysis
const parse = line => {

    console.log("Analyzing line", line)
    if (line.length > 0) {
        // Ignore comments
        instruction = line.trim().split(";")[0].trim().toUpperCase()

        // console.log("Removed comments, got instruction:", instruction)
        instruction = instruction.trim().split(" ")

        if (instruction.length > 0) {
            const mnemonic = instruction.shift().trim()
            // console.log("Got mnemonic:", mnemonic)
            // console.log("Got instruction:", instruction)

            // remove all whitespaces, they are not needed anymore at this point
            const operands = instruction
                .join("")
                .split(",")
                .map(x => x.replace(/ /g, ''))
                .filter(s => s.length > 0)
                .map(o => {
                    const isAddress = o[0] === '(' && o[o.length-1] === ')'
                    const value = isAddress ? Number(o.slice(1,o.length-1)) : Number(o)
                    return {
                        isAddress: isAddress,
                        value: value,
                        text: o
                    }
                })
            // console.log("Got", operands.length, "operands:", operands)

            return {
                mnemonic: mnemonic,
                operands: operands
            }
        } else {
            console.log("Can't parse line", line, "no whitespace between instruction and operands")
        }
    } else {
        console.log("Can't parse empty line", line)
    }

    return null
}

const assembly = syntaxObj => {

    const oneByte = Number(0xff)
    const twoBytes = Number(0xffff)

    console.log("Syntax:", syntaxObj)

    const instructionMatches = ISA.instructions
        .filter(isaInstruction => 
                    isaInstruction.mnemonic === syntaxObj.mnemonic && 
                    isaInstruction.operands.length === syntaxObj.operands.length
                )

    if (instructionMatches.length > 0) {
        console.log("Found", instructionMatches.length, "instruction matches for mnemonic:", syntaxObj.mnemonic, "with", syntaxObj.operands.length, "operands")

            const operandsMatchByValueAndType = instructionMatches.filter(isaInstruction => {
                // console.log("Looking for match with ISA instruction",isaInstruction.fullMnemonic)

                let matchedOperands = 0
                for (let o = 0; o < isaInstruction.operands.length; o++) {
                    const isaOperand = isaInstruction.operands[o]
                    const inputOperand = syntaxObj.operands[o]

                    switch (isaOperand.mask) {
                        case '':
                            if (isaOperand.description === inputOperand.text) {
                                matchedOperands++
                                break;
                            } else {
                                return false
                            }
                        case '(h)':
                            if (inputOperand.isAddress && inputOperand.value <= oneByte) {
                                matchedOperands++
                                break;
                            } else {                                
                                return false
                            }
                        case 'h':
                            if (inputOperand.value <= oneByte) {
                                matchedOperands++
                                break;
                            } else {
                                return false
                            }
                        case '(hh)':
                            if (inputOperand.isAddress && inputOperand.value <= twoBytes) {
                                matchedOperands++
                                break;
                            } else {
                                return false
                            }
                        case 'hh':
                            if (inputOperand.value <= twoBytes) {
                                matchedOperands++
                                break;
                            } else {
                                return false
                            }
                        default:
                            console.log("Unknown mask:", isaOperand.mask, "on ISA operand:", isaOperand)
                            return false
                    }
                }
                return matchedOperands === isaInstruction.operands.length
            })

            if (operandsMatchByValueAndType.length === 1) {
                const instructionMatch = operandsMatchByValueAndType[0]
                let machineCode = []
                machineCode.push(instructionMatch.opcode)
                instructionMatch.operands.forEach((operand, i) => {
                    if (operand.size && operand.size !== null && operand.size > 0) {    
                        machineCode.push(syntaxObj.operands[i].value)
                    }
                })
                console.log("Translated instruction", syntaxObj, "to machine code", machineCode)
                return machineCode
            } else {
                console.log("Ambiguous instruction", syntaxObj)
                console.log("Matches found:", operandsMatchByValueAndType)
            }

    } else {
        console.log("Can't find a variant of ", syntaxObj.mnemonic, "with", syntaxObj.operands.length, "operands")
    }

    return null
}

const asmLine = line => {
    const syntaxObj = parse(line)
    if (syntaxObj !== null) {
        const machineCode = assembly(syntaxObj)
        if (machineCode !== null) {
            if (machineCode.length > 0) {
                // console.log("Machine code:", machineCode)
                return machineCode
            }
        } else {
            console.log("Assembly failed on line:", line)
        }
    } else {
        console.log("Syntax analysis failed on line:", line)
    }
    return []
}

const asmFile = filePath => {
    const fs = require('fs')
    const readline = require('readline')

    const pathToAsmFile = filePath ? filePath : './samples/asm-sample.s'
    const pathToResultFile = './samples/machine-code.o'

    let machineCodeFullTranslation = []
    readline.createInterface({
        input: fs.createReadStream(pathToAsmFile, { flags: "r" })
    }).on('line', line => {
        console.log('Read line from file:', line)
        const machineCode = asmLine(line)
        machineCodeFullTranslation = machineCodeFullTranslation.concat(machineCode)
    }).on('close', () => {
        fs.writeFile(pathToResultFile, machineCodeFullTranslation.join(" "), () => {
            console.log('file saved to  :', pathToResultFile)
        })
    })
}

exports.asmLine = asmLine
exports.asmFile = asmFile