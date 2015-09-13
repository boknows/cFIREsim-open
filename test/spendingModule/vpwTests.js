'use strict';

describe("calcPayment", function() {

    var scenarios = [
        { rate: 0.01, nper: 30, pv: 100000, fv: -200000, pmt: 1875 },
        { rate: 0.01, nper: 30, pv: 100000, fv: -50000, pmt: -2437 },
        { rate: 0.01, nper: 30, pv: 100000, fv: 0, pmt: -3875 },
        { rate: 0.01, nper: 30, pv: 100000, fv: 50000, pmt: -5312 },
        { rate: 0.01, nper: 30, pv: 100000, fv: 200000, pmt: -9624 },
        { rate: 0.01, nper: 30, pv: 10000, fv: 0, pmt: -387 },
        { rate: 0.01, nper: 30, pv: 50000, fv: 0, pmt: -1937 },
        { rate: 0.01, nper: 30, pv: 100000, fv: 0, pmt: -3875 },
        { rate: 0.01, nper: 30, pv: 250000, fv: 0, pmt: -9687 },
        { rate: 0.01, nper: 30, pv: 1000000, fv: 0, pmt: -38748 },
        { rate: 0.01, nper: 10, pv: 100000, fv: 0, pmt: -10558 },
        { rate: 0.01, nper: 25, pv: 100000, fv: 0, pmt: -4541 },
        { rate: 0.01, nper: 50, pv: 100000, fv: 0, pmt: -2551 },
        { rate: 0.01, nper: 100, pv: 100000, fv: 0, pmt: -1587 },
        { rate: 0.01, nper: 250, pv: 100000, fv: 0, pmt: -1091 },
        { rate: 0.01, nper: 30, pv: 100000, fv: 0, pmt: -3875 },
        { rate: 0.02, nper: 30, pv: 100000, fv: 0, pmt: -4465 },
        { rate: 0.03, nper: 30, pv: 100000, fv: 0, pmt: -5102 },
        { rate: 0.04, nper: 30, pv: 100000, fv: 0, pmt: -5783 },
        { rate: 0.05, nper: 30, pv: 100000, fv: 0, pmt: -6505 }
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