import type Token from "../Token"
import type ExpressionNode from "./ExpressionNode"

export default class UnarOperationNode {
  operator: Token
  operand: ExpressionNode

  constructor(operator: Token, operand: ExpressionNode) {
    this.operator = operator
    this.operand = operand
  }
}
