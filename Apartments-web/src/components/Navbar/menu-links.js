import { Stack , Box} from "@chakra-ui/react"
import { MenuItem } from "./menu-item"


export const MenuLinks = (props) => {
    return (
        <Box
        display={{ base: props.isOpen ? "block" : "none", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}>
             <Stack
            spacing={8}
            align="center"
            justify={["center", "flex-start", "flex-end"]}
            direction={["column", "row", "row", "row"]}
            pt={[4, 4, 0, 0]}>
                <MenuItem to="/">Home</MenuItem>
                <MenuItem to="/how">How It Works</MenuItem>
            </Stack>
        </Box>
       
    )
}