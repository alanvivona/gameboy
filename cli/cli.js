#!/usr/bin/env node

const Chalk = require('chalk')
const Clear = require('clear')
const Figlet = require('figlet')
const Inquirer = require('inquirer')
const Clui = require('clui')

const Assembler = require('../asm')

const replPrompt = [
    {
        name: '>',
        type: 'input',
        validate: value => value.length > 0
    },
]

Clear()
// const printInitScreen = () => console.log(Chalk.yellow(Figlet.textSync('gb(dis)asm', { horizontalLayout: 'full' })))

const promptForInstruction = () => Inquirer.prompt(replPrompt).then(i => {
    const spinner = new Clui.Spinner('Assembling...')
    spinner.start()
    let input = i['>'].toUpperCase()
    if (input !== "Q") {
        console.log("Requested assembly for instruction: ", input)
        const result = Assembler.asmLine(input)
        console.log("Result:", result)
        spinner.stop()
        // printInitScreen()
        promptForInstruction()
    } else {
        spinner.stop()
        console.log("Bye!")
        process.exit(0)
    }
})

promptForInstruction()