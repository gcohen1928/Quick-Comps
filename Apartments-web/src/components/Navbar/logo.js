import React from "react"
import { Box, Text } from "@chakra-ui/react"

export const Logo = (props) => {
  return (
    <Box {...props}>
      <Text fontSize="lg" fontWeight="bold">
        Apartments Scanner
      </Text>
    </Box>
  )
}