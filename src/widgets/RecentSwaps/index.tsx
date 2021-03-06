import { openEtherscanLink } from 'airswap.js/src/utils/etherscan';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';

import theme from '../../app/theme';
import Flex from '../../components/Flex';
import MediaQuery from '../../components/MediaQuery';
import { HorizontalSpacer, VerticalSpacer } from '../../components/Spacer';
import Tooltip from '../../components/Tooltip';
import { H6, H7, H8 } from '../../components/Typography';
import WithLoading from '../../components/WithLoading';
import { ReactComponent as ArrowUpRightIcon } from '../../static/arrow-up-right-icon.svg';
import { ReactComponent as SwapIcon } from '../../static/swap-icon.svg';
import { getFormattedSwapValue, getSwapValue } from '../../utils/swap';
import { calculateDifferenceInTrade, getFormattedNumber } from '../../utils/transformations';
import { WidgetTitle } from '../styles';
import TokenPairIcon from '../WidgetComponents/TokenPairIcon';
import WidgetCard from '../WidgetComponents/WidgetCard';
import Container, { RecentSwapProps } from './Container';
import {
  EtherscanIcon,
  HeaderContainer,
  HeaderItem,
  ItemContainer,
  SwapList,
  SwapListContainer,
  SwapListItem,
} from './styles';

function RecentSwapsWidget(props: RecentSwapProps) {
  const tableConfig = [
    {
      label: 'Trade',
      width: '10%',
    },
    {
      label: 'Signer Token',
      width: '25%',
    },
    {
      label: '',
      width: '5%',
    },
    {
      label: 'Sender Token',
      width: '25%',
    },
    {
      label: 'Value',
      width: '20%',
    },
    {
      label: 'Time',
      width: '15%',
    },
    {
      label: 'Details',
      width: '10%',
    },
  ];

  const getDisplayAmountFormatted = (amount, symbol) => {
    return `${getFormattedNumber({ num: Number(amount), digits: 6, minDecimals: 0, maxDecimals: 6 })} ${symbol}`;
  };

  const getDisplayAmount = (amount, symbol) => {
    return `${amount} ${symbol}`;
  };

  const RecentSwapItem = useMemo(
    () => ({ index, style }) => {
      const swap = props.trades[index];

      return (
        <div style={style} key={`swap-list-item-${swap.transactionHash}`}>
          <SwapListItem>
            <MediaQuery size="sm">
              <Flex shrink={0} direction="row">
                <TokenPairIcon senderToken={swap.takerToken} signerToken={swap.makerToken} />
                <HorizontalSpacer units={2} />
              </Flex>
              <Flex expand grow={1} align="flex-start">
                <H8 color="white" opacity={0.25}>
                  {calculateDifferenceInTrade(swap.timestamp * 1000)}
                </H8>
                <VerticalSpacer units={1} />
                <Flex expand direction="row" justify="space-between">
                  <H8 color="white" opacity={0.75}>
                    {getDisplayAmountFormatted(swap.makerAmountFormatted, swap.makerSymbol)}
                  </H8>
                  <SwapIcon />
                  <H8 color="white" opacity={0.75}>
                    {getDisplayAmountFormatted(swap.takerAmountFormatted, swap.takerSymbol)}
                  </H8>
                </Flex>
              </Flex>
            </MediaQuery>
            <MediaQuery size="md-up">
              <ItemContainer width={tableConfig[0].width}>
                <Flex>
                  <TokenPairIcon senderToken={swap.takerToken} signerToken={swap.makerToken} />
                </Flex>
              </ItemContainer>
              <ItemContainer width={tableConfig[1].width}>
                <Tooltip
                  maxWidth={150}
                  tooltipContent={
                    <H7 noWrap color="white">
                      {getDisplayAmount(swap.makerAmountFormatted, swap.makerSymbol)}
                    </H7>
                  }
                >
                  <H6 color="white" opacity={0.75}>
                    {getDisplayAmountFormatted(swap.makerAmountFormatted, swap.makerSymbol)}
                  </H6>
                </Tooltip>
              </ItemContainer>
              <ItemContainer width={tableConfig[2].width}>
                <SwapIcon />
              </ItemContainer>
              <ItemContainer width={tableConfig[3].width}>
                <Tooltip
                  maxWidth={150}
                  tooltipContent={
                    <H7 noWrap color="white">
                      {getDisplayAmount(swap.takerAmountFormatted, swap.takerSymbol)}
                    </H7>
                  }
                >
                  <H6 color="white" opacity={0.75}>
                    {getDisplayAmountFormatted(swap.takerAmountFormatted, swap.takerSymbol)}
                  </H6>
                </Tooltip>
              </ItemContainer>
              <ItemContainer width={tableConfig[4].width}>
                <Tooltip
                  maxWidth={150}
                  tooltipContent={
                    <H7 noWrap color="white">
                      {getSwapValue(swap)}
                    </H7>
                  }
                >
                  <H6 color="white" opacity={0.5} weight={theme.text.fontWeight.thin}>
                    {getFormattedSwapValue(swap)}
                  </H6>
                </Tooltip>
              </ItemContainer>
              <ItemContainer width={tableConfig[5].width}>
                <H6 color="white" opacity={0.5} weight={theme.text.fontWeight.thin}>
                  {calculateDifferenceInTrade(swap.timestamp * 1000)}
                </H6>
              </ItemContainer>
              <ItemContainer width={tableConfig[6].width}>
                <EtherscanIcon onClick={() => openEtherscanLink(swap.transactionHash, 'tx')}>
                  <ArrowUpRightIcon />
                </EtherscanIcon>
              </ItemContainer>
            </MediaQuery>
          </SwapListItem>
        </div>
      );
    },
    [props.trades.length],
  );

  return (
    <WidgetCard width="700px">
      <Flex expand direction="row" justify="space-between">
        <WidgetTitle>
          <FormattedMessage defaultMessage="Recent Swaps" />
        </WidgetTitle>
      </Flex>
      <SwapListContainer>
        <WithLoading isLoading={!props.trades || props.trades.length < 1}>
          <MediaQuery size="sm">
            <VerticalSpacer units={3} />
          </MediaQuery>
          <MediaQuery size="md-up">
            <HeaderContainer>
              {tableConfig.map(config => (
                <HeaderItem key={config.label} width={config.width}>
                  {config.label}
                </HeaderItem>
              ))}
            </HeaderContainer>
          </MediaQuery>
          <SwapList>
            <AutoSizer>
              {({ width, height }) => (
                <FixedSizeList
                  className="recent-swaps-list"
                  width={width}
                  height={height}
                  itemCount={props.trades.length}
                  itemSize={60}
                >
                  {RecentSwapItem}
                </FixedSizeList>
              )}
            </AutoSizer>
          </SwapList>
        </WithLoading>
      </SwapListContainer>
    </WidgetCard>
  );
}

export default Container(RecentSwapsWidget);
