import React from "react"
import { NavBarContainer } from "./navbar-container"
import {Logo} from './logo'
import { MenuLinks } from "./menu-links"
import { MenuToggle } from "./menu-toggle"


export const NavBar = (props) => {
    const [isOpen, setIsOpen] = React.useState(false)
  
    const toggle = () => setIsOpen(!isOpen)
  
    return (
      <NavBarContainer {...props}>
        <Logo
          w="200px"
          color={["black", "black", "black", "black"]}
        />
        <MenuToggle toggle={toggle} isOpen={isOpen} />
        <MenuLinks isOpen={isOpen} />
      </NavBarContainer>
    )
  }