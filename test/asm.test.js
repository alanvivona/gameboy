const assembler = require('../asm')

const testCases = [

    // LD instruction reg to reg
    { "input": "LD B,B", "hex": "40" },
    { "input": "LD B,C", "hex": "41" },
    { "input": "LD B,D", "hex": "42" },
    { "input": "LD B,E", "hex": "43" },
    { "input": "LD B,H", "hex": "44" },
    { "input": "LD B,L", "hex": "45" },
    { "input": "LD C,B", "hex": "48" },
    { "input": "LD C,C", "hex": "49" },
    { "input": "LD C,D", "hex": "4a" },
    { "input": "LD C,E", "hex": "4b" },
    { "input": "LD C,H", "hex": "4c" },
    { "input": "LD C,L", "hex": "4d" },
    { "input": "LD B,A", "hex": "47" },
    { "input": "LD C,A", "hex": "4f" },
    { "input": "LD D,B", "hex": "50" },
    { "input": "LD D,C", "hex": "51" },
    { "input": "LD D,D", "hex": "52" },
    { "input": "LD D,E", "hex": "53" },
    { "input": "LD D,H", "hex": "54" },
    { "input": "LD D,L", "hex": "55" },
    { "input": "LD D,A", "hex": "57" },
    { "input": "LD E,B", "hex": "58" },
    { "input": "LD E,C", "hex": "59" },
    { "input": "LD E,D", "hex": "5a" },
    { "input": "LD E,E", "hex": "5b" },
    { "input": "LD E,H", "hex": "5c" },
    { "input": "LD E,L", "hex": "5d" },
    { "input": "LD E,A", "hex": "5f" },
    { "input": "LD H,B", "hex": "60" },
    { "input": "LD H,C", "hex": "61" },
    { "input": "LD H,D", "hex": "62" },
    { "input": "LD H,E", "hex": "63" },
    { "input": "LD H,H", "hex": "64" },
    { "input": "LD H,L", "hex": "65" },
    { "input": "LD H,A", "hex": "67" },
    { "input": "LD L,B", "hex": "68" },
    { "input": "LD L,C", "hex": "69" },
    { "input": "LD L,D", "hex": "6a" },
    { "input": "LD L,E", "hex": "6b" },
    { "input": "LD L,H", "hex": "6c" },
    { "input": "LD L,L", "hex": "6d" },
    { "input": "LD L,A", "hex": "6f" },
    { "input": "LD A,B", "hex": "78" },
    { "input": "LD A,B", "hex": "78" },
    { "input": "LD A,C", "hex": "79" },
    { "input": "LD A,C", "hex": "79" },
    { "input": "LD A,D", "hex": "7a" },
    { "input": "LD A,D", "hex": "7a" },
    { "input": "LD A,E", "hex": "7b" },
    { "input": "LD A,E", "hex": "7b" },
    { "input": "LD A,H", "hex": "7c" },
    { "input": "LD A,H", "hex": "7c" },
    { "input": "LD A,L", "hex": "7d" },
    { "input": "LD A,L", "hex": "7d" },
    { "input": "LD A,A", "hex": "7f" },
    { "input": "LD A,A", "hex": "7f" },
    { "input": "LD A,A", "hex": "7f" },

]

const statistics = {
    tests : 0,
    passed : 0,
    failed : 0,
    failedData : []
}
testCases.forEach(test => {
    console.log("=================================================")
    statistics.tests += 1
    const machineCode = assembler.asmLine(test.input)
    const resultText = machineCode.map(c => Number(c).toString(16)).join()
    if (resultText === test.hex) {
        statistics.passed += 1
        console.log("TEST PASSED!")
    } else {
        statistics.failed += 1
        test.result = resultText
        statistics.failedData.push(test)
    }
    console.log("=================================================")
})
console.log("STATISTICS")
console.log(statistics)
