import Lexer from "./Lexer"
import Parser from "./Parser"
import { readCode } from "./utils"

const filePath = process.argv[2]
if (!filePath) throw new Error("Please input a file path")
const code = await readCode(filePath)

const lexer = new Lexer(code)
lexer.lexAnalysis()

const parser = new Parser(lexer.getTokenList())
const rootNode = parser.parseCode()
parser.run(rootNode)
