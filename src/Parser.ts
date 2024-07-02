import BinOperationNode from "./AST/BinOperationNode"
import type ExpressionNode from "./AST/ExpressionNode"
import NumberNode from "./AST/NumberNode"
import StatementsNode from "./AST/StatementsNode"
import UnarOperationNode from "./AST/UnarOperationNode"
import VariableNode from "./AST/VariableNode"
import type Token from "./Token"
import type TokenType from "./TokenType"
import { tokenTypesList } from "./TokenType"

export default class Parser {
  public pos: number = 0
  public scope: { [key: string]: any } = {}
  constructor(public tokens: Token[]) {}

  match(...expected: TokenType[]): Token | null {
    if (this.pos < this.tokens.length) {
      const currentToken = this.tokens[this.pos]
      if (expected.find((type) => type.name === currentToken.type.name)) {
        this.pos += 1
        return currentToken
      }
    }

    return null
  }

  require(...expected: TokenType[]): Token {
    const token = this.match(...expected)
    if (!token) {
      throw new Error(`In position ${this.pos} expected ${expected[0].name}`)
    }
    return token
  }

  parseVariableOrNumber(): ExpressionNode {
    const number = this.match(tokenTypesList.NUMBER)

    if (number != null) return new NumberNode(number)
    const variable = this.match(tokenTypesList.VARIABLE)
    if (variable != null) return new VariableNode(variable)

    throw new Error(`In position  ${this.pos} expected variable or number`)
  }

  parseParenthesis(): ExpressionNode {
    if (this.match(tokenTypesList.LPAR) != null) {
      const node = this.parseFormula()
      this.require(tokenTypesList.RPAR)
      return node
    } else {
      return this.parseVariableOrNumber()
    }
  }

  parseFormula(): ExpressionNode {
    let leftNode = this.parseParenthesis()

    let operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS)

    while (operator !== null) {
      const rightNode = this.parseParenthesis()

      leftNode = new BinOperationNode(operator, leftNode, rightNode)

      operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS)
    }

    return leftNode
  }

  parsePrint(): ExpressionNode {
    const operatorLog = this.match(tokenTypesList.LOG)
    if (operatorLog != null) {
      return new UnarOperationNode(operatorLog, this.parseFormula())
    }

    throw new Error(`In position  ${this.pos} expected >>>`)
  }

  parseExpression() {
    if (this.match(tokenTypesList.VARIABLE) == null) {
      const printNode = this.parsePrint()
      return printNode
    }
    this.pos -= 1

    let variableNode = this.parseVariableOrNumber()

    const assignOperator = this.match(tokenTypesList.ASSIGN)

    if (assignOperator != null) {
      const rightFormulaNode = this.parseFormula()
      const binaryNode = new BinOperationNode(
        assignOperator,
        variableNode,
        rightFormulaNode
      )

      return binaryNode
    }

    throw new Error("After variable expected assign")
  }

  parseCode(): ExpressionNode {
    const root = new StatementsNode()

    while (this.pos < this.tokens.length) {
      const codeStringNode = this.parseExpression()
      this.require(tokenTypesList.SEMICOLON)
      root.addNode(codeStringNode)
    }

    return root
  }

  run(node: ExpressionNode): any {
    if (node instanceof NumberNode) {
      return parseInt(node.number.text)
    }

    if (node instanceof UnarOperationNode) {
      switch (node.operator.type.name) {
        case tokenTypesList.LOG.name:
          console.log(this.run(node.operand))
          return
      }
    }

    if (node instanceof BinOperationNode) {
      switch (node.operator.type.name) {
        case tokenTypesList.PLUS.name:
          return this.run(node.leftNode) + this.run(node.rightNode)
        case tokenTypesList.MINUS.name:
          return this.run(node.leftNode) - this.run(node.rightNode)
        case tokenTypesList.ASSIGN.name:
          const result = this.run(node.rightNode)
          const variableNode = <VariableNode>node.leftNode
          this.scope[variableNode.variable.text] = result
          return result
      }
    }

    if (node instanceof VariableNode) {
      if (this.scope[node.variable.text]) {
        return this.scope[node.variable.text]
      } else {
        throw new Error(`Undefined variable ${node.variable.text}`)
      }
    }

    if (node instanceof StatementsNode) {
      node.codeStrings.forEach((codeString) => {
        this.run(codeString)
      })
      return
    }
    throw new Error("Unknown node type")
  }
}
