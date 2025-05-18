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