
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

class Node {
    toString() {
        return this.value.toString();
    }

    addValue(value) {
        this.value = value;
    }
}

class Group extends Node {
    constructor(value) {
        super()
        this.value = value;
        this.operator = "( )";
    }

    toString() {
        return `(${this.value.toString()})`;
    }
}

class Duadic extends Node {
    constructor(firstOperand, secondOperand) {
        super()
        this.firstOperand = firstOperand;
        this.secondOperand = secondOperand;
        this.operator = null;
    }

    // toString() {
    //     return this.firstOperand.toString() + this.operator + this.secondOperand.toString()
    // }

    // toString() {
    //     return this.firstOperand
    // }

    addFirstOperand(value) {
        this.firstOperand = value;
    }

    addSecondOperand(value) {
        this.secondOperand = value;
    }
}

class Monadic extends Node {
    constructor(value) {
        super();
        this.value = value;
        this.operator = "NOT";
    }

    toString() {
        return this.operator + this.value;
    }
}

// Terminal nodes
class Variable extends Node {
    constructor(value) {
        super()
        this.value = value;
    }

    //λx.x
    toString() {
        return `(λ${this.value}.${this.value})`;
    }
}

class Not extends Monadic {
    constructor(value) {
        super(value);
        this.operator = "!";
    }

    //λpq.pλab.b.λab.a Fλab.b Tλab.a
    toString() {
        return `λ${this.value}${this.value}.${this.value}λ${this.value}${this.value}.${this.value}.λ${this.value}${this.value}.${this.value}`;
    }
}

class And extends Duadic {
    constructor(firstOperand, secondOperand) {
        super(firstOperand, secondOperand)
        this.operator = "&&"
    }

    //λpq.pqp
    toString() {
        return `λ${this.firstOperand.value}${this.secondOperand.value}.${this.firstOperand.value}${this.secondOperand.value}${this.firstOperand.value}`
    }
}

class Or extends Duadic {
    constructor(firstOperand, secondOperand) {
        super(firstOperand, secondOperand)
        this.operator = "||"
    }

    //λpq.ppq
    toString() {
        return `λ${this.firstOperand.value}${this.secondOperand.value}.${this.firstOperand.value}${this.firstOperand.value}${this.secondOperand.value}`
    }
}

// module.exports = {
//     And,
//     Duadic,
//     Group,
//     Monadic,
//     Node,
//     Not,
//     Or,
//     Variable,
// }

// const combinator = require("./definitions/combinator")
// const logic = require("./definitions/logic")
// const utils = require("./utils")
// const t = require("./tree")
// const util = require('util')


// const TYPES = TYPES


/**
 * <expression> ::= <variable> | <operation> | <block>
 * <block> ::= <start_block> <expression> <end_block>
 * <operation> ::= <monadic> | <duadic>
 * <monadic> ::= <monadic_operator> <expression>
 * <duadic> ::= <expression> <duadic_operator> <expression>
 * <variable> ::= /[A-Za-z][A-Za-z0-9]^/
 * <monadic_operator> ::= <not>
 * <duadic_operator> ::= <and> | <or>
 * <start_block> ::= (
 * <end_block> ::= )
 * <not> ::= !
 * <and> ::= &&
 * <or> ::= ||
 * 
 * https://bnfplayground.pauliankline.com/?bnf=%20%3Cexpression%3E%20%3A%3A%3D%20%3Cvariable%3E%20%7C%20%3Coperation%3E%20%7C%20%3Cblock%3E%0A%20%3Cblock%3E%20%3A%3A%3D%20%3Cstart_block%3E%20%3Cexpression%3E%20%3Cend_block%3E%0A%20%3Coperation%3E%20%3A%3A%3D%20%3Cmonadic%3E%20%7C%20%3Cduadic%3E%0A%20%3Cmonadic%3E%20%3A%3A%3D%20%3Cmonadic_operator%3E%20%3Cexpression%3E%0A%20%3Cduadic%3E%20%3A%3A%3D%20%3Cexpression%3E%20%3Cduadic_operator%3E%20%3Cexpression%3E%0A%20%3Cvariable%3E%20%3A%3A%3D%20%5Ba-z%5D%0A%20%3Cmonadic_operator%3E%20%3A%3A%3D%20%3Cnot%3E%0A%20%3Cduadic_operator%3E%20%3A%3A%3D%20%3Cand%3E%20%7C%20%3Cor%3E%0A%20%3Cstart_block%3E%20%3A%3A%3D%20%22(%22%0A%20%3Cend_block%3E%20%3A%3A%3D%20%22)%22%0A%20%3Cnot%3E%20%3A%3A%3D%20%22!%22%0A%20%3Cand%3E%20%3A%3A%3D%20%22%26%26%22%0A%20%3Cor%3E%20%3A%3A%3D%20%22%7C%7C%22&name=
 */

/**
 * From sentence that is a logical condition in js/ts,
 * this function does a lexical analysys and returns an array
 * of token that will be used during the parsing
 * 
 * Will throw an error if there is an error of syntax
 * 
 * @param {string} sentence 
 * @returns 
 */
function lexicalAnalysys(sentence) {
    sentence = sentence.trim().replaceAll(' ', '')

    if (sentence.length === 0) return;

    let variableNumber = 0;
    let uniqueVariableNumber = new Set();

    let isInSymbol = false;
    let currentVariable = "";
    let parenthesisValidity = 0;
    let maxParenthesisDepth = 0;

    let lexemes = [];

    for (let index = 0; index < sentence.length; index++) {
        let currentChar = sentence[index];
        let nextChar = "";
        if (index + 1 < sentence.length) {
            nextChar = sentence[index + 1];
        }
        let previousChar = "";
        if (index !== 0) {
            previousChar = sentence[index - 1];
        }
        if (isCharVariable(currentChar)) {
            if (!isInSymbol) {
                isInSymbol = true;
                variableNumber++;
            }
            currentVariable += currentChar;
        } else {
            if (isInSymbol) {
                isInSymbol = false;
                // TODO check if variable already existing in the already parsed code
                uniqueVariableNumber.add(currentVariable);
                const type = TYPES.VARIABLE
                lexemes.push({
                    type: TYPES.VARIABLE,
                    value: currentVariable
                });

            }
            currentVariable = "";

            if (isCharOperator(currentChar)) {

                // AND - OR
                if (currentChar === '&' || currentChar === '|') {
                    // Length is 1
                    if (isCharVariable(previousChar) && isCharVariable(nextChar)) {
                        throw `Operator too short`
                    }
                    // Lenght is > 2
                    if (previousChar === currentChar && currentChar === nextChar) {
                        throw `Operator too long`
                    }
                    // Wrong use
                    if (currentChar === "&" && previousChar === "|" ||
                        currentChar === "|" && previousChar === "&") {
                        throw `Wrong operator use`
                    }
                    const type = currentChar === "&" ? TYPES.AND : TYPES.OR;
                    if (previousChar === currentChar) {
                        lexemes.push({
                            type: type,
                            value: `${currentChar}${currentChar}`
                        });
                    }
                    isInOperator = false;
                }

                // NOT
                if (currentChar === '!') {
                    // EOL
                    if (index + 1 === sentence.length) {
                        throw `Cannot use ! alone`
                    }
                    if (nextChar === '|' || nextChar === '&' || nextChar === "!") {
                        throw `Wrong format for the NOT operation`;
                    }
                    lexemes.push({
                        type: TYPES.NOT,
                        value: "!"
                    });
                    isInOperator = false;
                }

                isInSymbol = false;
            }

            // BLOCK
            if (currentChar === "(") {
                currentVariable = "";

                if (nextChar === ")") {
                    throw "Wrong parenthesis use";
                }
                parenthesisValidity++;
                if (parenthesisValidity > maxParenthesisDepth) {
                    maxParenthesisDepth = parenthesisValidity;
                }
                lexemes.push({
                    type: TYPES.START_BLOCK,
                    value: "("
                });
            }
            if (currentChar === ")") {
                currentVariable = "";
                if (nextChar === "(" || (parenthesisValidity - 1 < 0)) {
                    throw "Wrong parenthesis use";
                }
                parenthesisValidity--;
                lexemes.push({
                    type: TYPES.END_BLOCK,
                    value: ")"
                });
            }
        }
    }
    if (parenthesisValidity > 0) {
        throw `Too many opened parenthesis`;
    }
    if (parenthesisValidity < 0) {
        throw `Too many closed parenthesis`;
    }
    if (isInSymbol && currentVariable !== "") {
        uniqueVariableNumber.add(currentVariable);
        lexemes.push({
            type: TYPES.VARIABLE,
            value: currentVariable
        });
    }

    return lexemes;
}
// module.exports = lexicalAnalysys;

function extractNot(lexemes) {
    let subGroup = [];
    let depth = 0;
    for (let i = 0; i < lexemes.length; i++) {
        const token = lexemes[i];
        if (i === 0) {
            if (token.type === TYPES.VARIABLE) {
                subGroup.push(token);
                break;
            } else if (token.type === TYPES.NOT) {
                // We do nothing now
            } else if (token.type === TYPES.START_BLOCK) {
                depth = 1;
            }
            else {
                throw 'extractNot first char is not in definition'
            }
        }

        if (token.type === TYPES.END_BLOCK) {
            if (depth - 1 === 0) {
                break;
            }

            depth--;
        }
        if (token.type === TYPES.START_BLOCK) {
            depth++;
        }
        subGroup.push(token);
    }

    return subGroup;
}

function extractGroup(lexemes) {
    let subGroup = [];
    let depth = 1;
    for (let i = 0; i < lexemes.length; i++) {
        const token = lexemes[i];

        if (token.type === TYPES.END_BLOCK) {
            if (depth - 1 === 0) {
                break;
            }

            depth--;
        }
        if (token.type === TYPES.START_BLOCK) {
            depth++;
        }
        subGroup.push(token);
    }

    return subGroup;
}

function buildTreeParser(lexemes) {
    let tree;
    for (let i = 0; i < lexemes.length; i++) {
        const token = lexemes[i];

        if (token.type === TYPES.VARIABLE) {
            tree = new Variable(token.value);
        } else if (token.type === TYPES.AND || token.type === TYPES.OR) {
            const leftOperand = Object.assign(Object.create(Object.getPrototypeOf(tree)), tree);
            const rightOperand = buildTreeParser((lexemes.slice(i + 1, lexemes.length)))

            return token.type === TYPES.AND
                ? new And(leftOperand, rightOperand)
                : new Or(leftOperand, rightOperand);
        } else if (token.type === TYPES.NOT) {
            const subTree = extractNot(lexemes.slice(i + 1, lexemes.length));
            tree = new Not(buildTreeParser(subTree));
            i = i + subTree.length;
        } else if (token.type === TYPES.START_BLOCK) {
            const subTree = extractGroup(lexemes.slice(i + 1, lexemes.length));
            tree = new Group(buildTreeParser(subTree));
            i = i + subTree.length + 1;
        }
    }

    return tree;
}
// !a&&(b||c)
// const c0 = ")"
// const c1 = "a || b && c && !b || c && !d"
// const c2 = "a || (b || b && a) || c !a"
// const c3 = "!(a && c || b)"
// const c4 = "a && b || c && d"
// const c5 = "a || b"
// const c6 = "!(a && !b || ((c && d) && !(!d || f)))"
// const c7 = "((a && b) && !(!c || d))"
// const c8 = "a || (b && c)"
// const c9 = "a || (a && b)"
// const c10 = "!a"
// const c11 = "!a&&b"
// const c11 = "a && b"

// const c0 = "!(a&&b)"
// const lexemes = lexicalAnalysys(c0);
// console.log(lexemes);
// util.inspect(
//     lexemes,
//     false,
//     null,
//     true));

// let tree = new Node();

// const result = buildTreeParser(lexemes)
// console.log(result)
// util.inspect(
//     result,
//     false,
//     null,
//     true);

// console.log(result.toString()); const util = require("util")
// const t = require("./tree")
// const utils = require("./utils")