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

            var expectedSpendingAdjustment = (((900000 / (1000000 * 1.05) - 1) * 0.5) + 1)
            expect(actualSpending).toBe(expectedSpendingAdjustment * 40000 * 1.05);
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

        describe("and the floor is null", function() {

            it("should not have a floor", function() {

                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: { initial: 40000, variableSpendingZValue: 0.5, floor: "definedValue" }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 } },
                        { portfolio: { start: 900000 }, cumulativeInflation: 1.05 }
                    ]
                ];

                var actualSpending = SpendingModule['variableSpending'].calcSpending(form, sim, 0, 1);

                var expectedSpendingAdjustment = (((900000 / (1000000 * 1.05) - 1) * 0.5) + 1)
                expect(actualSpending).toBe(expectedSpendingAdjustment * 40000 * 1.05);
            });
        });

        describe("and it goes back below the ceiling", function() {

            it("should return the adjusted spending", function() {

                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: { initial: 40000, variableSpendingZValue: 0.5, ceiling: "definedValue", ceilingValue: 60000 }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 } },
                        { portfolio: { start: 3000000 } },
                        { portfolio: { start: 1000000 }, cumulativeInflation: 1.05 }
                    ]
                ];

                var actualSpending = SpendingModule['variableSpending'].calcSpending(form, sim, 0, 2);

                var expectedSpendingAdjustment = (((1000000 / (1000000 * 1.05) - 1) * 0.5) + 1);
                expect(actualSpending).toBe(expectedSpendingAdjustment * 40000 * 1.05);
            });
        });

        describe("and the ceiling is null", function() {

            it("should not have a ceiling", function() {

                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: { initial: 40000, variableSpendingZValue: 0.5, ceiling: "definedValue" }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 } },
                        { portfolio: { start: 2000000 }, cumulativeInflation: 1.05 }
                    ]
                ];

                var actualSpending = SpendingModule['variableSpending'].calcSpending(form, sim, 0, 1);

                var expectedSpendingAdjustment = (((2000000 / (1000000 * 1.05) - 1) * 0.5) + 1);
                expect(actualSpending).toBe(expectedSpendingAdjustment * 40000 * 1.05);
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

            it("should return the adjusted spending", function() {

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

        describe("and it hits the ceiling", function() {

            it("should return the ceiling", function() {

                var form = {
                    retirementStartYear: new Date().getFullYear(),
                    spending: { initial: 40000, variableSpendingZValue: 0.5, ceiling: "definedValue", ceilingValue: 60000 }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 } },
                        { portfolio: { start: 3000000 }, cumulativeInflation: 1.05 }
                    ]
                ];

                var actualSpending = SpendingModule['variableSpending'].calcSpending(form, sim, 0, 1);

                expect(actualSpending).toBe(60000 * 1.05);
            });
        });
    });
});

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
                        percentageOfPortfolioFloorPercentage: 3,
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
                        percentageOfPortfolioFloorPercentage: 95,
                        percentageOfPortfolioCeilingType: "none"
                    }
                };
                var sim = [
                    [
                        { portfolio: { start: 1000000 }, spending: 40000 },
                        { portfolio: { start: 900000 } }
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

        describe("and there is no percentageOfPortfolioFloorPercentage", function() {

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

        describe("and there is no percentageOfPortfolioFloorPercentage for percentage of previous year", function() {

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
                        percentageOfPortfolioCeilingPercentage: 6
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