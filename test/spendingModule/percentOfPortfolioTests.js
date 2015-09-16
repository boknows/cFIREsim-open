'use strict';

describe("percentOfPortfolio", function() {

    describe("when the portfolio value decreases from last year", function() {

        it("should lower the spending based on portfolio size", function() {
            var form = {
                retirementStartYear: new Date().getFullYear(),
                spending: { percentageOfPortfolioPercentage: 4, percentageOfPortfolioType: "constant" }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 } },
                    { portfolio: { start: 900000 } }
                ]
            ];

            var actualSpending = SpendingModule['percentOfPortfolio'].calcSpending(form, sim, 0, 1);

            expect(actualSpending).toBe(900000 * 0.04);
        });

        describe("and there is a percentage of portfolio floor that is hit", function() {

            it("should lower the spending to the floor", function() {
                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: {
                        percentageOfPortfolioPercentage: 4,
                        percentageOfPortfolioType: "withFloorAndCeiling",
                        percentageOfPortfolioFloorType: "percentageOfPortfolio",
                        percentageOfPortfolioFloorValue: 3,
                        percentageOfPortfolioCeilingType: "none"
                    }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 } },
                        { portfolio: { start: 500000 }, cumulativeInflation: 1.1 }
                    ]
                ];

                var actualSpending = SpendingModule['percentOfPortfolio'].calcSpending(form, sim, 0, 1);

                expect(actualSpending).toBe(1000000 * 0.03 * 1.1);
            });
        });

        describe("and there is a percentage of previous year floor that is hit", function() {

            it("should lower the spending to the floor", function() {
                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: {
                        percentageOfPortfolioPercentage: 4,
                        percentageOfPortfolioType: "withFloorAndCeiling",
                        percentageOfPortfolioFloorType: "percentageOfPreviousYear",
                        percentageOfPortfolioFloorValue: 95,
                        percentageOfPortfolioCeilingType: "none"
                    }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 }, spending: 40000, cumulativeInflation: 1 },
                        { portfolio: { start: 900000 }, cumulativeInflation: 1 }
                    ]
                ];

                var actualSpending = SpendingModule['percentOfPortfolio'].calcSpending(form, sim, 0, 1);

                expect(actualSpending).toBe(40000 * 0.95);
            });
        });

        describe("and the floor is set to no limit", function() {

            it("should lower the spending based on portfolio size", function() {
                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: {
                        percentageOfPortfolioPercentage: 4,
                        percentageOfPortfolioType: "withFloorAndCeiling",
                        percentageOfPortfolioFloorType: "none",
                        percentageOfPortfolioCeilingType: "none"
                    }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 } },
                        { portfolio: { start: 900000 } }
                    ]
                ];

                var actualSpending = SpendingModule['percentOfPortfolio'].calcSpending(form, sim, 0, 1);

                expect(actualSpending).toBe(900000 * 0.04);
            });
        });

        describe("and there is no percentageOfPortfolioFloorValue", function() {

            it("should have no floor", function() {
                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: {
                        percentageOfPortfolioPercentage: 4,
                        percentageOfPortfolioType: "withFloorAndCeiling",
                        percentageOfPortfolioFloorType: "percentageOfPortfolio"
                    }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 } },
                        { portfolio: { start: 900000 } }
                    ]
                ];

                var actualSpending = SpendingModule['percentOfPortfolio'].calcSpending(form, sim, 0, 1);

                expect(actualSpending).toBe(900000 * 0.04);
            });
        });

        describe("and there is no percentageOfPortfolioFloorValue for percentage of previous year", function() {

            it("should have no floor", function() {
                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: {
                        percentageOfPortfolioPercentage: 4,
                        percentageOfPortfolioType: "withFloorAndCeiling",
                        percentageOfPortfolioFloorType: "percentageOfPreviousYear"
                    }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 } },
                        { portfolio: { start: 900000 } }
                    ]
                ];

                var actualSpending = SpendingModule['percentOfPortfolio'].calcSpending(form, sim, 0, 1);

                expect(actualSpending).toBe(900000 * 0.04);
            });
        });
    });

    describe("when the portfolio value increases from last year", function() {

        it("should raise the spending based on portfolio size", function() {
            var form = {
                retirementStartYear: new Date().getFullYear(),
                spending: { percentageOfPortfolioPercentage: 4, percentageOfPortfolioType: "constant" }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 } },
                    { portfolio: { start: 1100000 } }
                ]
            ];

            var actualSpending = SpendingModule['percentOfPortfolio'].calcSpending(form, sim, 0, 1);

            expect(actualSpending).toBe(1100000 * 0.04);
        });

        describe("and there is a percentage of portfolio ceiling that is hit", function() {

            it("should raise the spending to the ceiling", function() {
                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: {
                        percentageOfPortfolioPercentage: 4,
                        percentageOfPortfolioType: "withFloorAndCeiling",
                        percentageOfPortfolioFloorType: "none",
                        percentageOfPortfolioCeilingType: "percentageOfPortfolio",
                        percentageOfPortfolioCeilingValue: 6
                    }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 } },
                        { portfolio: { start: 2000000 }, cumulativeInflation: 1.1 }
                    ]
                ];

                var actualSpending = SpendingModule['percentOfPortfolio'].calcSpending(form, sim, 0, 1);

                expect(actualSpending).toBe(1000000 * 0.06 * 1.1);
            });
        });

        describe("and the celing is set to no limit", function() {

            it("should raise the spending based on portfolio size", function() {
                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: {
                        percentageOfPortfolioPercentage: 4,
                        percentageOfPortfolioType: "withFloorAndCeiling",
                        percentageOfPortfolioFloorType: "none",
                        percentageOfPortfolioCeilingType: "none"
                    }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 } },
                        { portfolio: { start: 2000000 } }
                    ]
                ];

                var actualSpending = SpendingModule['percentOfPortfolio'].calcSpending(form, sim, 0, 1);

                expect(actualSpending).toBe(2000000 * 0.04);
            });
        });

        describe("and there is no percentageOfPortfolioCeilingPercentage", function() {

            it("should have no ceiling", function() {
                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: {
                        percentageOfPortfolioPercentage: 4,
                        percentageOfPortfolioType: "withFloorAndCeiling",
                        percentageOfPortfolioCeilingType: "percentageOfPortfolio"
                    }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 } },
                        { portfolio: { start: 900000 } }
                    ]
                ];

                var actualSpending = SpendingModule['percentOfPortfolio'].calcSpending(form, sim, 0, 1);

                expect(actualSpending).toBe(900000 * 0.04);
            });
        });
    });
});