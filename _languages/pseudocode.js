export default (Prism) => {
  const keywords = [
    "align", "allowzero", "and", "anyframe", "anytype", "async", "await", "break",
    "callconv", "cancel", "catch", "comptime", "const", "continue", "defer", "else",
    "enum", "errdefer", "error", "export", "extern", "fn", "for", "if", "inline",
    "linksection", "noalias", "noinline", "nosuspend", "null", "opaque", "or",
    "orelse", "packed", "promise", "pub", "resume", "return", "struct", "suspend",
    "switch", "test", "threadlocal", "try", "undefined", "union", "unreachable",
    "usingnamespace", "var", "volatile", "while",
  ];

  const identifier = String.raw`[A-Za-z_]\w*`;
  const keywordPattern = new RegExp(String.raw`\b(?:${keywords.join("|")})\b`);
  const builtinTypePattern = /\b(?:bool|void|type|noreturn|anyerror|[iu]size|[iu]\d+|u?int|f(?:16|32|64|80|128)|float|[iub]?vec\d+|[iu]?mat\d+)\b/;

  // Inside a type region, any remaining identifier is a type.
  const typeGrammar = {
    keyword: keywordPattern,
    "class-name": [
      {
        alias: "builtin-type",
        pattern: builtinTypePattern,
      },
      new RegExp(String.raw`${identifier}(?:\.${identifier})*`),
    ],
    number: /\d+/,
    operator: /[!?*]/,
    punctuation: /[[\]:.]/,
  };

  Prism.languages.pseudocode = {
    comment: [
      { pattern: /\/\/(?:\/(?!\/)|!).*/, alias: "doc-comment" },
      /\/\/.*/,
    ],
    string: [
      { pattern: /"(?:[^"\\\r\n]|\\.)*"/, greedy: true },
      { pattern: /`[^`]*`/, greedy: true },
    ],
    char: {
      pattern: /'(?:[^'\\\r\n]|\\(?:x[\da-fA-F]{2}|u\{[\da-fA-F]+\}|.))'/,
      greedy: true,
    },
    // Context rules: must precede `keyword`.
    "function-definition": {
      pattern: new RegExp(String.raw`(\bfn\s+)${identifier}`),
      lookbehind: true,
      alias: "function",
    },
    "type-annotation": {
      pattern: /(:\s*)[^,;{}()=\r\n]+/,
      lookbehind: true,
      inside: typeGrammar,
    },
    "return-type": {
      pattern: new RegExp(
        String.raw`(\)\s*(?:callconv\([^)]*\)\s*)?)[!?*]*${identifier}(?:\.${identifier})*(?=\s*[{;])`
      ),
      lookbehind: true,
      inside: typeGrammar,
    },

    keyword: keywordPattern,
    boolean: /\b(?:false|true)\b/,
    number: /\b(?:0b[01_]+|0o[0-7_]+|0x[\da-fA-F_]+(?:\.[\da-fA-F_]+)?(?:[pP][+-]?\d+)?|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?)\b/,
    function: [
      { pattern: new RegExp(String.raw`@${identifier}(?=\()`), alias: "builtin" },
      { pattern: new RegExp(String.raw`\b${identifier}(?=\()`), alias: "function-call" },
    ],
    "class-name": [
      { pattern: builtinTypePattern, alias: "builtin-type" },
      /\b[A-Z](?:\w*[a-z]\w*)?\b/,
    ],
    operator: /\.[*?]|\.{2,3}|[-=]>|\*\*|\+\+|\|\||(?:<<|>>|[-+*]%|[-+*/%^&|<>!=])=?|[?~]/,
    punctuation: [/[.:,;]/, { pattern: /[(){}[\]]/, alias: "bracket" }],
  };
};
