import { openEtherscanLink } from 'airswap.js/src/utils/etherscan';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import theme from '../../app/theme';
import ArrowButton from '../../components/Button/ArrowButton';
import Flex from '../../components/Flex';
import MediaQuery from '../../components/MediaQuery';
import { HorizontalSpacer, VerticalSpacer } from '../../components/Spacer';
import Table, { TableRow, TableRowItem } from '../../components/Table';
import Tooltip from '../../components/Tooltip';
import { H6, H7 } from '../../components/Typography';
import WithLoading from '../../components/WithLoading';
import { ReactComponent as ArrowUpRightIcon } from '../../static/arrow-up-right-icon.svg';
import { ReactComponent as SwapIcon } from '../../static/swap-icon.svg';
import { calculateDifferenceInTrade, getFormattedNumber } from '../../utils/transformations';
import { WidgetTitle } from '../styles';
import TokenPairIcon from '../WidgetComponents/TokenPairIcon';
import WidgetCard from '../WidgetComponents/WidgetCard';
import Container, { RecentSwapProps } from './Container';

const EtherscanIcon = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;

    path {
      stroke: ${theme.palette.primaryColor};
    }
  }
`;

const MobileSwapEvent = styled(Flex).attrs({ expand: true, direction: 'row' })`
  padding: 20px 0;
`;

function RecentSwapsWidget(props: RecentSwapProps) {
  const [expanded, setExpanded] = useState(false);
  const columns = ['Trade', 'Sender Token', '', 'Signer Token', 'Value', 'Time', 'Details'];

  const getDisplayAmountFormatted = (amount, symbol) => {
    return `${getFormattedNumber(Number(amount), 6, 6)} ${symbol}`;
  };

  const getDisplayAmount = (amount, symbol) => {
    return `${amount} ${symbol}`;
  };

  return (
    <WidgetCard width="650px" expanded={expanded} setExpanded={setExpanded} expandedContent={<div />}>
      <Flex expand direction="row" justify="space-between">
        <WidgetTitle>
          <FormattedMessage defaultMessage="Recent Swaps" />
        </WidgetTitle>
        <ArrowButton text="View All" onClick={() => setExpanded(true)} />
      </Flex>
      <WithLoading isLoading={!props.trades || props.trades.length < 4}>
        <MediaQuery size="sm">
          <VerticalSpacer units={4} />
          {props.trades.slice(0, 4).map(swap => (
            <MobileSwapEvent key={swap.transactionHash}>
              <Flex shrink={0} direction="row">
                <TokenPairIcon senderToken={swap.takerToken} signerToken={swap.makerToken} />
                <HorizontalSpacer units={2} />
              </Flex>
              <Flex expand grow={1} align="flex-start">
                <H7 color="white" opacity={0.25}>
                  {calculateDifferenceInTrade(swap.timestamp * 1000)}
                </H7>
                <VerticalSpacer units={1} />
                <Flex direction="row" justify="space-between" expand>
                  <H6 color="white" opacity={0.75}>
                    {getDisplayAmountFormatted(swap.makerAmountFormatted, swap.makerSymbol)}
                  </H6>
                  <SwapIcon />
                  <H6 color="white" opacity={0.75}>
                    {getDisplayAmountFormatted(swap.takerAmountFormatted, swap.takerSymbol)}
                  </H6>
                </Flex>
              </Flex>
            </MobileSwapEvent>
          ))}
        </MediaQuery>
        <MediaQuery size="md-up">
          <VerticalSpacer units={6} />
          <Table columns={columns}>
            {props.trades.slice(0, 4).map((swap, index) => (
              <TableRow fadeIn index={index} key={swap.transactionHash}>
                <TableRowItem>
                  <Flex>
                    <TokenPairIcon senderToken={swap.takerToken} signerToken={swap.makerToken} />
                  </Flex>
                </TableRowItem>
                <TableRowItem>
                  <Tooltip
                    maxWidth={150}
                    tooltipContent={
                      <H7 expand color="white">
                        {getDisplayAmount(swap.makerAmountFormatted, swap.makerSymbol)}
                      </H7>
                    }
                  >
                    <H6 color="white" opacity={0.75}>
                      {getDisplayAmountFormatted(swap.makerAmountFormatted, swap.makerSymbol)}
                    </H6>
                  </Tooltip>
                </TableRowItem>
                <TableRowItem>
                  <SwapIcon />
                </TableRowItem>
                <TableRowItem>
                  <Tooltip
                    maxWidth={150}
                    tooltipContent={
                      <H7 expand color="white">
                        {getDisplayAmount(swap.takerAmountFormatted, swap.takerSymbol)}
                      </H7>
                    }
                  >
                    <H6 color="white" opacity={0.75}>
                      {getDisplayAmountFormatted(swap.takerAmountFormatted, swap.takerSymbol)}
                    </H6>
                  </Tooltip>
                </TableRowItem>
                <TableRowItem>
                  <Tooltip
                    maxWidth={150}
                    tooltipContent={
                      <H7 expand color="white">
                        {getDisplayAmount(swap.ethAmount, 'ETH')}
                      </H7>
                    }
                  >
                    <H6 color="white" opacity={0.5} weight={theme.text.fontWeight.thin}>
                      {getDisplayAmountFormatted(swap.ethAmount, 'ETH')}
                    </H6>
                  </Tooltip>
                </TableRowItem>
                <TableRowItem>
                  <H6 color="white" opacity={0.5} weight={theme.text.fontWeight.thin}>
                    {calculateDifferenceInTrade(swap.timestamp * 1000)}
                  </H6>
                </TableRowItem>
                <TableRowItem>
                  <EtherscanIcon onClick={() => openEtherscanLink(swap.transactionHash, 'tx')}>
                    <ArrowUpRightIcon />
                  </EtherscanIcon>
                </TableRowItem>
              </TableRow>
            ))}
          </Table>
        </MediaQuery>
      </WithLoading>
    </WidgetCard>
  );
}

export default Container(RecentSwapsWidget);
