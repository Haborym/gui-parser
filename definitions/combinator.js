/**
 * I - Identity function
 * λx.x
 * 
 * @param {*} x 
 * @returns x
 */
const Indentity = x => x
const I = Indentity


/**
 * M - Self-application
 * λf.ff
 * 
 * @param {*} f 
 * @returns f(f)
 */
const Mockingbird = f => f(f)
const M = Mockingbird


/**
 * K - True, First, const
 * λab.a
 * 
 * @param {*} a
 * @param {*} b
 * @returns a
 */
const Kestrel = a => b => a
const K = Kestrel


/**
 * KI - False, Second
 * λab.b (KI, CK)
 * 
 * @param {*} a
 * @param {*} b 
 * @returns b
 */
const Kite = a => b => b
const KI = Kite


/**
 * C - Flip, Reverse the arguments
 * λfab.fba
 * 
 * @param {*} f
 * @param {*} a
 * @param {*} b
 */
const Cardinal = f => a => b => f(b)(a)
const C = Cardinal


/**
 * B - Composition function 1 degree
 * λfga.f(ga)
 * 
 * @param {Function} f
 * @param {Function} g
 * @param {*} a
 * @returns 
 */
const Bluebird = f => g => a => f(g(a))
const B = Bluebird


/**
 * Th - Holds an argument
 * λaf.fa (CI)
 * 
 * @param {*} a
 * @param {Function} f
 */
const Thrush = a => f => f(a)
const Th = Thrush


/**
 * V - Holds a pair of args
 * λabf.fab (BCT)
 * 
 * @param {*} a 
 * @returns 
 */
const Vireo = a => b => f => f(a)(b)
const V = Vireo


/**
 * B1 - Composition of 2 degree
 * λfgab.f(gab) (BBB)
 * 
 * @param {Function} f
 * @param {Function} g
 * @param {*} a
 * @param {*} b
 * @returns 
 */
const Blackbird = B(B)(B)
const B1 = Blackbird


module.exports = {
    I, Indentity,
    M, Mockingbird,
    K, Kestrel,
    KI, Kite,
    C, Cardinal,
    B, Bluebird,
    Th, Thrush,
    V, Vireo,
    B1, Blackbird,
};