'use strict';

describe("guytonKlinger", function() {

    describe("when the portfolio value stays the same from last year", function() {

        it("should update the spending amount by inflation", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2044,
                spending: { initial: 40000, guytonKlingerExceeds: 20, guytonKlingerCut: 10, guytonKlingerFall: 20, guytonKlingerRaise: 10 }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 }, cumulativeInflation: 1, spending: 40000 },
                    { portfolio: { start: 1000000 }, cumulativeInflation: 1.1 }
                ]
            ];

            var actualSpending = SpendingModule['guytonKlinger'].calcSpending(form, sim, 0, 1);

            expect(actualSpending).toBe(40000 * 1.1);
        });
    });

    describe("when the portfolio value falls by less than the exceeds amount", function() {

        it("should update the spending amount by inflation", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2044,
                spending: { initial: 40000, guytonKlingerExceeds: 20, guytonKlingerCut: 10, guytonKlingerFall: 20, guytonKlingerRaise: 10 }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 }, cumulativeInflation: 1, spending: 40000 },
                    { portfolio: { start: 900000 }, cumulativeInflation: 1.1 }
                ]
            ];

            var actualSpending = SpendingModule['guytonKlinger'].calcSpending(form, sim, 0, 1);

            expect(actualSpending).toBe(40000 * 1.1);
        });
    });

    describe("when the portfolio value falls by exactly the exceeds amount", function() {

        it("should update the spending amount by inflation", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2044,
                spending: { initial: 40000, guytonKlingerExceeds: 20, guytonKlingerCut: 10, guytonKlingerFall: 20, guytonKlingerRaise: 10 }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 }, cumulativeInflation: 1, spending: 40000 },
                    { portfolio: { start: 833334 }, cumulativeInflation: 1.1 }
                ]
            ];

            var actualSpending = SpendingModule['guytonKlinger'].calcSpending(form, sim, 0, 1);

            expect(actualSpending).toBe(40000 * 1.1);
        });
    });

    describe("when the portfolio value falls by more the exceeds amount", function() {

        it("should update the spending amount by inflation", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2044,
                spending: { initial: 40000, guytonKlingerExceeds: 20, guytonKlingerCut: 10, guytonKlingerFall: 20, guytonKlingerRaise: 10 }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 }, cumulativeInflation: 1, spending: 40000 },
                    { portfolio: { start: 800000 }, cumulativeInflation: 1.1 }
                ]
            ];

            var actualSpending = SpendingModule['guytonKlinger'].calcSpending(form, sim, 0, 1);

            expect(actualSpending).toBe(40000 * 1.1 * .9);
        });
    });

    describe("when the portfolio value falls by more than the floor", function() {

        it("should stop the cut at the floor", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2044,
                spending: { initial: 40000, guytonKlingerExceeds: 20, guytonKlingerCut: 10, guytonKlingerFall: 20, guytonKlingerRaise: 10, floor: "definedValue", floorValue: 38000 }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 }, cumulativeInflation: 1, spending: 40000 },
                    { portfolio: { start: 800000 }, cumulativeInflation: 1.05 }
                ]
            ];

            var actualSpending = SpendingModule['guytonKlinger'].calcSpending(form, sim, 0, 1);

            expect(actualSpending).toBe(Math.round(38000 * 1.05));
        });
    });

    describe("when the portfolio value falls by more than the fall amount but it within the last 15 years of the simulation", function() {

        it("should stop the cut at the floor", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2044,
                spending: { initial: 40000, guytonKlingerExceeds: 20, guytonKlingerCut: 10, guytonKlingerFall: 20, guytonKlingerRaise: 10 }
            };
            var sim = [[]];
            sim[0][0] = { portfolio: { start: 1000000 }, cumulativeInflation: 1, spending: 40000 };
            sim[0][14] = { portfolio: { start: 1000000 }, cumulativeInflation: 1, spending: 40000 };
            sim[0][15] = { portfolio: { start: 800000 }, cumulativeInflation: 1.05 };

            var actualSpending = SpendingModule['guytonKlinger'].calcSpending(form, sim, 0, 15);

            expect(actualSpending).toBe(Math.round(40000 * 1.05));
        });
    });

    describe("when the portfolio value falls by more than the fall amount but it is just before the last 15 years of the simulation", function() {

        it("should stop the cut at the floor", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2044,
                spending: { initial: 40000, guytonKlingerExceeds: 20, guytonKlingerCut: 10, guytonKlingerFall: 20, guytonKlingerRaise: 10 }
            };
            var sim = [[]];
            sim[0][0] = { portfolio: { start: 1000000 }, cumulativeInflation: 1, spending: 40000 };
            sim[0][13] = { portfolio: { start: 1000000 }, cumulativeInflation: 1, spending: 40000 };
            sim[0][14] = { portfolio: { start: 800000 }, cumulativeInflation: 1.05 };

            var actualSpending = SpendingModule['guytonKlinger'].calcSpending(form, sim, 0, 14);

            expect(actualSpending).toBe(Math.round(40000 * .9 * 1.05));
        });
    });

    describe("when the portfolio value raises by less than the falls amount", function() {

        it("should update the spending amount by inflation", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2044,
                spending: { initial: 40000, guytonKlingerExceeds: 20, guytonKlingerCut: 10, guytonKlingerFall: 20, guytonKlingerRaise: 10 }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 }, cumulativeInflation: 1, spending: 40000 },
                    { portfolio: { start: 1100000 }, cumulativeInflation: 1.1 }
                ]
            ];

            var actualSpending = SpendingModule['guytonKlinger'].calcSpending(form, sim, 0, 1);

            expect(actualSpending).toBe(40000 * 1.1);
        });
    });

    describe("when the portfolio value raises by exactly the falls amount", function() {

        it("should update the spending amount by inflation", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2044,
                spending: { initial: 40000, guytonKlingerExceeds: 20, guytonKlingerCut: 10, guytonKlingerFall: 20, guytonKlingerRaise: 10 }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 }, cumulativeInflation: 1, spending: 40000 },
                    { portfolio: { start: 1200000 }, cumulativeInflation: 1.1 }
                ]
            ];

            var actualSpending = SpendingModule['guytonKlinger'].calcSpending(form, sim, 0, 1);

            expect(actualSpending).toBe(40000 * 1.1);
        });
    });

    describe("when the portfolio value raises by more the falls amount", function() {

        it("should update the spending amount by inflation", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2044,
                spending: { initial: 40000, guytonKlingerExceeds: 20, guytonKlingerCut: 10, guytonKlingerFall: 20, guytonKlingerRaise: 10 }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 }, cumulativeInflation: 1, spending: 40000 },
                    { portfolio: { start: 1300000 }, cumulativeInflation: 1.05 }
                ]
            ];

            var actualSpending = SpendingModule['guytonKlinger'].calcSpending(form, sim, 0, 1);

            expect(actualSpending).toBe(Math.round(40000 * 1.05 * 1.1));
        });
    });

    describe("when the portfolio value raises by more than the ceiling", function() {

        it("should stop the raise at the ceiling", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2044,
                spending: { initial: 40000, guytonKlingerExceeds: 20, guytonKlingerCut: 10, guytonKlingerFall: 20, guytonKlingerRaise: 10, ceiling: "definedValue", ceilingValue: 42000 }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 }, cumulativeInflation: 1, spending: 40000 },
                    { portfolio: { start: 1300000 }, cumulativeInflation: 1.05 }
                ]
            ];

            var actualSpending = SpendingModule['guytonKlinger'].calcSpending(form, sim, 0, 1);

            expect(actualSpending).toBe(Math.round(42000 * 1.05));
        });
    });
});