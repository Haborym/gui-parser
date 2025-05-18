/**
 * λab.a (K - C(KI))
 * 
 * @param {*} a 
 * @returns 
 */
const True = a => b => a
const T = True

/**
 * λab.b (KI - CK)
 * 
 * @param {*} a 
 * @returns 
 */
const False = a => b => b
const F = False

/**
 * λpq.pFT (C)
 * 
 * @param {*} x
 * @returns 
 */
const Not = x => x(F)(T)

/**
 * Conjunction
 * λpq.pqF - λpq.pqp
 * 
 * @param {*} x
 * @returns 
 */
const And = p => q => p(q)(F)

/**
 * Disjunction
 * λpq.pTq - λpq.ppq (M*)
 * 
 * @param {*} x
 * @returns 
 */
const Or = p => q => p(T)(q)

/**
 * Equality
 * λpq.p (qTF) (qFT)
 * 
 * @param {*} x
 * @returns 
 */
const Beq = p => q => p(q(T)(F))(q(F)(T))

module.exports = {
    T, True,
    F, False,
    Not,
    And,
    Or,
    Beq,
};