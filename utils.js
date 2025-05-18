const isCharVariable = char => /[A-Za-z]/.test(char) || /[0-9]/.test(char)

const isCharOperator = char => /[!&&|]/.test(char)

// not used for now
const isCharBlock = char => /[\(\)]/.test(char)

const TYPES = {
    VARIABLE: "VARIABLE",
    OPERATOR: "OPERATOR",
    START_BLOCK: "START_BLOCK",
    END_BLOCK: "END_BLOCK",
    NOT: "NOT",
    AND: "AND",
    OR: "OR",
}

// module.exports = {
//     isCharVariable,
//     isCharOperator,
//     TYPES
// }