import type Token from "../Token"
import ExpressionNode from "./ExpressionNode"

export default class NumberNode extends ExpressionNode {
  number: Token

  constructor(number: Token) {
    super()
    this.number = number
  }
}
