const fs = require('fs')

const ISA = require('./isa/instructions')

const pathToRom = './samples/fake-sample.gb'
const bufferMaxSize = 0x100000

const disassembly = binary => {
    return binary.reduce((res, byte, byteIndex) => {
                res.grabBytes--
                resInstruction = {
                    opcodes: [],
                    asm: "UNKWN"
                }
                if (res.grabBytes == 0) {
                    foundISAInstructions = ISA.instructions.filter(instruction => instruction.opcode === byte)
                    if (foundISAInstructions.length === 1) {
                        resInstruction.opcodes.push(parseInt(byte, 16))
                        // TODO : make this actually get the value from the binary
                        resInstruction.asm = foundISAInstructions[0].fullMnemonic
                        res.grabBytes += foundISAInstructions[0].operands.map(operand => operand.size).reduce((val,res) => res+=val, 0)
                    } else {
                        console.log("Found unknown byte/opcode", parseInt(byte, 16), "at index:", parseInt(byteIndex, 16))
                    }
                    res.instructions.push(resInstruction)
                } else {
                    // TODO : make this actually get the value from the binary
                    res.grabBytes--
                }
                res.grabBytes++
                return res
            }, 
            {grabBytes: 1, instructions: [
                // {asm : "LD A,n", opcodes: "CC 04", index: "0x000040CC"}
            ]}
        ).instructions
}

fs.open(pathToRom, 'r', (status, fd) => {
    if (status) {
        console.log(status.message)
        return null
    }
    // load 1mg buffer
    // a rom bigger than this for the gb is just inconceivable
    let buffer = Buffer.alloc(bufferMaxSize)
    fs.read(fd, buffer, 0, bufferMaxSize, 0, (err, numberOfBytesRead, rom) => {
        console.log("The loaded buffer size is", rom.byteLength, "b ==", rom.byteLength / 1024, "kb")
        console.log("Read", numberOfBytesRead, "b ==", numberOfBytesRead / 1024, "kb from rom", pathToRom)
        rom = rom.filter((_, byteIndex) => byteIndex <= numberOfBytesRead)  
        const assemblyCode = disassembly(rom)

        assemblyCode.forEach(line => {
            console.log(line.asm)
        })
    })
})