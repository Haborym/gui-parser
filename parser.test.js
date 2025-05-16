const lexicalAnalysys = require('../parser');


describe("lexical analysis", () => {
    describe('lexical analysis base case', () => {
        test('single character: a', () => {
            expect(
                lexicalAnalysys("a")).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            type: 'VARIABLE',
                            value: 'a'
                        })
                    ])
                )
        });
    })

    describe('lexical analysis errors :', () => {
        test('single !', () => {
            expect(() => lexicalAnalysys('!')).toThrow("Cannot use ! alone");
        });
        test('single (', () => {
            expect(() =>
                lexicalAnalysys('(')).toThrow("Too many opened parenthesis");
        });
        test('single )', () => {
            expect(() =>
                lexicalAnalysys(')')).toThrow("Wrong parenthesis use");
        });

    })
})
// [{ type: 'VARIABLE', value: 'a' }]