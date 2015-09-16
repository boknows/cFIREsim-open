'use strict';

describe("calcPayment", function() {

    var scenarios = [
        { rate: 0.01, nper: 30, pv: 100000, fv: -200000, pmt: 1856 },
        { rate: 0.01, nper: 30, pv: 100000, fv: -50000, pmt: -2413 },
        { rate: 0.01, nper: 30, pv: 100000, fv: 0, pmt: -3836 },
        { rate: 0.01, nper: 30, pv: 100000, fv: 50000, pmt: -5260 },
        { rate: 0.01, nper: 30, pv: 100000, fv: 200000, pmt: -9529 },
        { rate: 0.01, nper: 30, pv: 10000, fv: 0, pmt: -384 },
        { rate: 0.01, nper: 30, pv: 50000, fv: 0, pmt: -1918 },
        { rate: 0.01, nper: 30, pv: 100000, fv: 0, pmt: -3836 },
        { rate: 0.01, nper: 30, pv: 250000, fv: 0, pmt: -9591 },
        { rate: 0.01, nper: 30, pv: 1000000, fv: 0, pmt: -38364 },
        { rate: 0.01, nper: 10, pv: 100000, fv: 0, pmt: -10454 },
        { rate: 0.01, nper: 25, pv: 100000, fv: 0, pmt: -4496 },
        { rate: 0.01, nper: 50, pv: 100000, fv: 0, pmt: -2526 },
        { rate: 0.01, nper: 100, pv: 100000, fv: 0, pmt: -1571 },
        { rate: 0.01, nper: 250, pv: 100000, fv: 0, pmt: -1080 },
        { rate: 0.01, nper: 30, pv: 100000, fv: 0, pmt: -3836 },
        { rate: 0.02, nper: 30, pv: 100000, fv: 0, pmt: -4377 },
        { rate: 0.03, nper: 30, pv: 100000, fv: 0, pmt: -4953 },
        { rate: 0.04, nper: 30, pv: 100000, fv: 0, pmt: -5561 },
        { rate: 0.05, nper: 30, pv: 100000, fv: 0, pmt: -6195 }
    ];

    scenarios.forEach(function(scenario) {

        describe("rate: " + scenario.rate + ", nper: " + scenario.nper + ", pv: " + scenario.pv + ", fv: " + scenario.fv, function() {

            it("should calculate a payment of " + scenario.pmt, function() {

                var actualPayment = SpendingModule.calcPayment(scenario.rate, scenario.nper, scenario.pv, scenario.fv);

                expect(Math.round(actualPayment, 2)).toBe(scenario.pmt);
            });
        });
    });
});

describe("vpw", function() {

    describe("when calculating the spending for the first year of a simulation", function() {

        it("should calculate the correct spending", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2049,
                spending: { vpwRateOfReturn: 3.515322, vpwFutureValue: 0 }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 }, cumulativeInflation: 1 }
                ]
            ];

            var actualSpending = Math.round(SpendingModule['vpw'].calcSpending(form, sim, 0, 0));

            expect(actualSpending).toBe(48405);
        });
    });

    describe("when calculating the spending for the tenth year of a simulation", function() {

        it("should calculate the correct spending", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2049,
                spending: { vpwRateOfReturn: 3.515322, vpwFutureValue: 0 }
            };

            var sim = [[]];
            sim[0][9] = { portfolio: { start: 612891 }, cumulativeInflation: 1.1 };

            var actualSpending = Math.round(SpendingModule['vpw'].calcSpending(form, sim, 0, 9));

            expect(actualSpending).toBe(Math.round(35114));
        });
    });

    describe("when calculating the spending for the last year of a simulation", function() {

        it("should calculate the correct spending", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2049,
                spending: { vpwRateOfReturn: 3.515322, vpwFutureValue: 0 }
            };

            var sim = [[]];
            sim[0][34] = { portfolio: { start: 417029 }, cumulativeInflation: .9 };

            var actualSpending = Math.round(SpendingModule['vpw'].calcSpending(form, sim, 0, 34));

            expect(actualSpending).toBe(Math.round(417029));
        });
    });

    describe("when the spending falls below the floor", function() {

        it("should return the floor as the spending", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2049,
                spending: { vpwRateOfReturn: 3.515322, vpwFutureValue: 0, floor: "definedValue", floorValue: 50000 }
            };
            var sim = [
                [
                    { portfolio: { start: 1000000 }, cumulativeInflation: 1.1 }
                ]
            ];

            var actualSpending = Math.round(SpendingModule['vpw'].calcSpending(form, sim, 0, 0));

            expect(actualSpending).toBe(Math.round(50000 * 1.1));
        });
    });

    describe("when the spending rises above the ceiling", function() {

        it("should return the ceiling as the spending", function() {
            var form = {
                retirementStartYear: 2015,
                retirementEndYear: 2049,
                spending: { vpwRateOfReturn: 3.515322, vpwFutureValue: 0, ceiling: "definedValue", ceilingValue: 80000 }
            };

            var sim = [[]];
            sim[0][34] = { portfolio: { start: 417029 }, cumulativeInflation: .9 };

            var actualSpending = Math.round(SpendingModule['vpw'].calcSpending(form, sim, 0, 34));

            expect(actualSpending).toBe(Math.round(80000 * .9));
        });
    });
});