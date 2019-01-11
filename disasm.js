const fs = require('fs')

const pathToRom = './samples/fake-sample.gb'
const bufferMaxSize = 0x100000

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
        
        rom.filter((_, byteIndex) => byteIndex <= numberOfBytesRead)
            .map((byte, byteIndex) => {
                if (byteIndex % 8 === 0) {
                    console.log(byteIndex, ":")
                }
                console.log(byte)
            })
        console.log("ROM EOF")
    })
})