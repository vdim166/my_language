export default class TokenType {
  constructor(public name: string, public regex: string) {}
}

export const tokenTypesList = {
  NUMBER: new TokenType("NUMBER", "[0-9]*"),
  VARIABLE: new TokenType("VARIABLE", "[a-z]*"),
  SEMICOLON: new TokenType("SEMICOLON", ";"),
  SPACE: new TokenType("SPACE", "[ \\n\\t\\r]"),
  ASSIGN: new TokenType("ASSIGN", "\\="),
  LOG: new TokenType("LOG", ">>>"),
  PLUS: new TokenType("PLUS", "\\+"),
  MINUS: new TokenType("MINUS", "\\-"),
  LPAR: new TokenType("LPAR", "\\("),
  RPAR: new TokenType("RPAR", "\\)"),
}
