//@flow
import { quoteTokens } from '../../config/quotes'
import { tokens } from '../../config/tokens'
import { generateTokenPairs, getPairSymbol, getBaseToken } from '../../utils/tokens'
import type { Token, TokenPair, TokenPairs, TokenPairState, TokenPairDataMap } from '../../types/tokens'

const defaultTokenPairs = generateTokenPairs(quoteTokens, tokens)

const defaultInitialState = {
  byPair: defaultTokenPairs,
  data: {},
  favorites: [],
  currentPair: 'WETH/USDC',
  sortedPairs: [],
}

//By default the application is started with a default create from tokens in a configuration file. To
//create a tokenpair domain with less tokens, the initialized function can be called with a custom initial
//token pair state (that can be created with the createInitialState function).
export const initialized = (customInitialState?: Object) => {
  let initialState = customInitialState || defaultInitialState
  const event = (state: TokenPairState = initialState) => state
  return event
}

export const currentPairUpdated = (pair: string) => {
  const event = (state: TokenPairState) => ({
    ...state,
    currentPair: pair
  })

  return event
}

export const tokenPairsUpdated = (pairs: TokenPairs) => {
  const event = (state: TokenPairState) => {
    let byPair = pairs.reduce(
      (result, pair) => {
        let pairSymbol = getPairSymbol(pair.baseTokenSymbol, pair.quoteTokenSymbol)
        result[pairSymbol] = {
          pair: pairSymbol,
          baseTokenSymbol: pair.baseTokenSymbol,
          quoteTokenSymbol: pair.quoteTokenSymbol,
          baseTokenAddress: pair.baseTokenAddress,
          quoteTokenAddress: pair.quoteTokenAddress,
          baseTokenDecimals: pair.baseTokenDecimals,
          quoteTokenDecimals: pair.quoteTokenDecimals,
          makeFee: pair.makeFee,
          takeFee: pair.takeFee,
          listed: pair.listed,
          active: pair.active,
          rank: pair.rank
        }

        return result
      },
      { }
    )

    let sortedPairs = pairs.map(pair => {
      let pairSymbol = getPairSymbol(pair.baseTokenSymbol, pair.quoteTokenSymbol)
      return pairSymbol
    })

    return {
      ...state,
      byPair: {
        ...state.byPair,
        ...byPair
      },
      sortedPairs: [ ...state.sortedPairs, ...sortedPairs ]
    }
  }

  return event
}


export const tokenPairsReset = (pairs: TokenPairs) => {
  const event = (state: TokenPairState) => {
    let byPair = pairs.reduce(
      (result, pair) => {
        let pairSymbol = getPairSymbol(pair.baseTokenSymbol, pair.quoteTokenSymbol)
        result[pairSymbol] = {
          pair: pairSymbol,
          baseTokenSymbol: pair.baseTokenSymbol,
          quoteTokenSymbol: pair.quoteTokenSymbol,
          baseTokenAddress: pair.baseTokenAddress,
          quoteTokenAddress: pair.quoteTokenAddress,
          baseTokenDecimals: pair.baseTokenDecimals,
          quoteTokenDecimals: pair.quoteTokenDecimals,
          makeFee: pair.makeFee,
          takeFee: pair.takeFee,
          listed: pair.listed,
          active: pair.active,
          rank: pair.rank
        }

        return result
      },
      { }
    )

    let sortedPairs = pairs.map(pair => {
      let pairSymbol = getPairSymbol(pair.baseTokenSymbol, pair.quoteTokenSymbol)
      return pairSymbol
    })

    return {
      ...state,
      byPair,
      sortedPairs
    }
  }

  return event
}

export const tokenPairRemoved = (baseToken: Token) => {
  const event = (state: TokenPairState) => {
    let newByPair = Object.keys(state.byPair)
      .filter(key => getBaseToken(key) !== baseToken.symbol)
      .reduce((result, current) => {
        result[current] = state.byPair[current]
        return result
      }, {})

    return {
      byPair: newByPair
    }
  }

  return event
}

export const tokenPairDataUpdated = (tokenPairData: Array<Object>) => {
  const event = (state: TokenPairDataMap) => {

    let data = tokenPairData.reduce((result, item) => {
      return {
        ...result,
        [item.pair]: {
          ...state.data[item.pair],
          ...item
        }
      }
    }, {})
    
    let newState = {
      ...state,
      data: {
        ...state.data,
        ...data
      },
    }

    return newState
  }
  return event
}

export const tokenPairFavorited = (tokenPair: string, favorited: boolean) => {
  const event = (state: TokenPairState) => {
    let newState

    favorited
      ? (newState = [...state.favorites, tokenPair])
      : (newState = state.favorites.filter(elem => elem !== tokenPair))

    return {
      ...state,
      favorites: newState
    }
  }

  return event
}

export default function getTokenPairsDomain(state: TokenPairState) {
  return {
    getPairs: (): any => Object.keys(state.byPair),
    getPair: (code: string): any => state.byPair[code],
    getPairsByCode: () => state.byPair,
    getTokenPairsData: () => state.data,
    getTokenPairsDataArray: () => Object.values(state.data),
    getFavoritePairs: () => state.favorites,
    getCurrentPair: (): TokenPair => state.byPair[state.currentPair],

    getListedPairs: (): TokenPair => {
      let pairs: any = Object.values(state.byPair)
      let listedPairs = pairs.filter(pair => pair.listed === true)

      return listedPairs
    },

    //Merge token pair properties and data
    getTokenPairsWithDataObject: () => {
      let symbols = Object.keys(state.byPair)
      return symbols.reduce((
        (result, symbol) => {
          if (state.data[symbol] && state.byPair[symbol]) {
            result[symbol] = {
            ...state.data[symbol],
            ...state.byPair[symbol]
            }
          }
          
          return result
        }
      ), {})      
    },

    getTokenPairsWithDataArray: () => {
      let tokenPairData = []
      let symbols = state.sortedPairs

      symbols.forEach(symbol => {
        if (state.data[symbol] && state.byPair[symbol]) {
          tokenPairData.push({
            ...state.data[symbol],
            ...state.byPair[symbol]
          })
        }
      })

      return tokenPairData
    },
  }
}
