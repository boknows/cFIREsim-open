'use strict';

describe("variableSpending", function() {

    it("should calculate the first years spending in a cycle equal to the initial spending value", function() {
        var form = {
            retirementStartYear: new Date().getFullYear(),
            spending: { initial: 40000 }
        };

        var actualSpending = SpendingModule['variableSpending'].calcSpending(form, null, 0, 0);

        expect(actualSpending).toBe(form.spending.initial);
    });

    describe("when the portfolio value decreases from last year", function() {

        it("should adjust the next years spending by the change in portfolio value multiplied by the variable spending ratio", function() {
            var form = {
                retirementStartYear: new Date().getFullYear(),
                spending: { initial: 40000, variableSpendingZValue: 0.5 }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 } },
                    { portfolio: { start: 900000 }, cumulativeInflation: 1.05 }
                ]
            ];

            var actualSpending = SpendingModule['variableSpending'].calcSpending(form, sim, 0, 1);

            expect(actualSpending).toBe(38000 * 1.05);
        });

        describe("and it hits the floor", function() {

            it("should return the floor", function() {

                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: { initial: 40000, variableSpendingZValue: 0.5, floor: "definedValue", floorValue: 40000 }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 } },
                        { portfolio: { start: 900000 }, cumulativeInflation: 1.05 }
                    ]
                ];

                var actualSpending = SpendingModule['variableSpending'].calcSpending(form, sim, 0, 1);

                expect(actualSpending).toBe(40000 * 1.05);
            });
        });
    });

    describe("when the portfolio value increases from last year", function() {

        it("should adjust the next years spending by the change in portfolio value multiplied by the variable spending ratio", function() {
            var form = {
                retirementStartYear: new Date().getFullYear(),
                spending: { initial: 40000, variableSpendingZValue: 0.5 }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 } },
                    { portfolio: { start: 1100000 }, cumulativeInflation: 1 }
                ]
            ];

            var actualSpending = SpendingModule['variableSpending'].calcSpending(form, sim, 0, 1);

            expect(actualSpending).toBe(42000);
        });

        describe("and it goes above the floor", function() {

            it("should return the floor", function() {

                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: { initial: 40000, variableSpendingZValue: 0.5, floor: "definedValue", floorValue: 40000 }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 } },
                        { portfolio: { start: 900000 } },
                        { portfolio: { start: 1100000 }, cumulativeInflation: 1 },
                    ]
                ];

                var actualSpending = SpendingModule['variableSpending'].calcSpending(form, sim, 0, 2);

                expect(actualSpending).toBe(42000);
            });
        });
    });
});
