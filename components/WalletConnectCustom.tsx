import * as React from 'react'

import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface WalletConnectCustomProps {
  className?: string
  classNameConnect?: string
  classNameConnected?: string
  classNameWrongNetwork?: string
  labelConnect?: string
  labelWrongNetwork?: string
}

export const WalletConnectCustom = ({
  // className,
  // classNameConnect,
  // classNameConnected,
  // classNameWrongNetwork,
  labelConnect,
  labelWrongNetwork,
}: WalletConnectCustomProps) => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, authenticationStatus }) => {
        const connected = account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <>
            {/* <div className={className}> */}
            {(() => {
              if (!connected) {
                return (
                  <>
                    {/* <Button variant="unstyled" className={classNameConnect} onClick={openConnectModal}> */}
                    <Text size="xs" as="sub" fontWeight="normal" onClick={openConnectModal}>
                      {labelConnect}
                    </Text>
                  </>
                )
              }

              if (chain.unsupported) {
                return (
                  // <Button variant="unstyled" className={classNameWrongNetwork} onClick={openChainModal}>
                  <Text onClick={openChainModal}>{labelWrongNetwork}</Text>
                )
              }

              return (
                <>
                  {/* <button className={classNameConnected} onClick={openChainModal} style={{ display: 'flex', alignItems: 'center' }} type="button"> */}
                  {/* <Button variant="unstyled" onClick={openChainModal}> */}
                  <HStack align="stretch">
                    {/* {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 18,
                            height: 18,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}>
                          {chain.iconUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} style={{ width: 18, height: 18 }} />
                          )}
                        </div>
                      )} */}
                    {/* <Text size="xs" as="sub">
                        {chain.name?.toUpperCase()}
                      </Text> */}
                    <Text size="xs" as="sub" fontWeight="normal">
                      LOGGED IN AS {account.address?.slice(0, 6) + '...' + account.address?.slice(-4)}
                    </Text>
                  </HStack>
                  {/* </Button> */}
                </>
              )
            })()}
            {/* </div> */}
          </>
        )
      }}
    </ConnectButton.Custom>
  )
}

WalletConnectCustom.defaultProps = {
  className: '',
  labelConnect: 'Connect Wallet',
  labelWrongNetwork: 'Wrong Network',
  classNameConnect: 'btn btn-primary w-full',
  classNameConnected: 'btn btn-primary w-full',
  classNameWrongNetwork: 'btn btn-red w-full',
}

export default WalletConnectCustom
