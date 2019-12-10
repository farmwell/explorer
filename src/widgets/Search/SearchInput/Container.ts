import { selectors as swapSelectors } from 'airswap.js/src/swap/redux/'
import { selectors as swapLegacySelectors } from 'airswap.js/src/swapLegacy/redux/'
import { selectors as tokenSelectors } from 'airswap.js/src/tokens/redux'
import { connect } from 'react-redux'

import { STABLECOIN_SYMBOLS } from '../../../constants'
import { TokenMetadata, TokenQuery } from '../../../types/Tokens'

const {
  getAirSwapApprovedTokens,
  getTokensByAddress,
  makeDisplayByToken,
  makeGetNFTItemByAddressAndId,
} = tokenSelectors

interface PassedProps {}

interface ReduxProps {
  stablecoinTokens: TokenMetadata[]
  allOtherTokens: TokenMetadata[]
  getDisplayByToken(tokenQuery: TokenQuery, tokenAmount: string): string
}

export type SearchInputProps = PassedProps & ReduxProps

const mapStateToProps = (state, ownProps: PassedProps) => {
  const allAirSwapTokens: TokenMetadata[] = Object.values(getAirSwapApprovedTokens(state))
  const stablecoinTokens = allAirSwapTokens.filter(token => STABLECOIN_SYMBOLS.includes(token.symbol))
  const allOtherTokens = allAirSwapTokens.filter(token => !STABLECOIN_SYMBOLS.includes(token.symbol))

  return {
    stablecoinTokens,
    allOtherTokens,
    ...ownProps,
  }
}

const mapDispatchToProps = {}

export default Component =>
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Component)