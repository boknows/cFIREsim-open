var formData = {
	"retirementStartYear": 2014,
	"retirementEndYear": 2043,

	"portfolio": {
		"initial": 1000000,
		"percentEquities": 75,
		"percentBonds": 25, 
		"percentGold": 0,
		"percentCash": 0,
		"growthOfCash": 0.25,
		"rebalanceAnnually": true
	},
	
	"spending": {
		"initial": 40000,
		"method": "inflationAdjusted" 
	},

	"extraIncome": {
		"socialSecurity": {
			"val": 0,
			"startYear": 2032,
			"endYear": 2100
		},
		"socialSecuritySpouse": {
			"val": 0,
			"startYear": 2032,
			"endYear": 2100
		}
	},
	
	"extraSpending": [
		{
			"label": "",
			"val": 0,
			"startYear": 2030,
			"endYear": 2034,
			"recurring": true,
			"inflationAdjusted": true,
			"inflationType": "CPI"
		}
	]
};