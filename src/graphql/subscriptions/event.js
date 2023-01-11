export const eventSub = {
	id: true,
	status: true,
	betsCloseTime: true,
	creatorId: true,
	currencyPair: {
		symbol: true,
		id: true,
	},
	poolAboveEq: true,
	poolBelow: true,
	totalBetsAmount: true,
	totalLiquidityProvided: true,
	totalLiquidityShares: true,
	totalValueLocked: true,
	liquidityPercent: true,
	measurePeriod: true,
	closedOracleTime: true,
	createdTime: true,
	startRate: true,
	closedRate: true,
	winnerBets: true,
	targetDynamics: true,
	bets: {
		id: true,
		side: true,
		reward: true,
		amount: true,
		createdT