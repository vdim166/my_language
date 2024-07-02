import Token from "./Token"
import { tokenTypesList } from "./TokenType"

export default class Lexer {
  constructor(
    private code: string,
    private pos: number = 0,
    private tokenList: Token[] = []
  ) {}

  lexAnalysis(): Token[] {
    while (this.nextToken()) {}

    this.tokenList = this.tokenList.filter(
      (token) => token.type.name !== tokenTypesList.SPACE.name
    )

    return this.tokenList
  }

  getTokenList() {
    return this.tokenList
  }

  nextToken(): boolean {
    if (this.pos >= this.code.length) {
      return false
    }

    const tokenTypesValues = Object.values(tokenTypesList)

    for (let i = 0; i < tokenTypesValues.length; ++i) {
      const tokenType = tokenTypesValues[i]

      const regex = new RegExp("^" + tokenType.regex)
      const result = this.code.substring(this.pos).match(regex)

      if (result && result[0]) {
        const token = new Token(tokenType, result[0], this.pos)
        this.pos += result[0].length
        this.tokenList.push(token)
        return true
      }
    }
    throw new Error(`Position ${this.pos} have an error`)
  }
}
