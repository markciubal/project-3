import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';

// CSS Imports, for styling center menu.
// import "@szhsin/react-menu/dist/theme-dark.css";
import "@szhsin/react-menu/dist/index.css";

function CenterMenu(props) {
  return (
    <Menu id="center-button"
      menuButton={
      <MenuButton>
        
        <span id="center-down-button"> ▼</span></MenuButton>}>
      {`@ ${props.centerLatitude.toFixed(props.coordinateRoundTo)}, ${props.centerLongitude.toFixed(props.coordinateRoundTo)}`}
      <MenuItem onClick={() => { props.setIsPaneOpen(true)}}>Post</MenuItem>
      <MenuItem>Save</MenuItem>
      <SubMenu label="Edit">
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
      </SubMenu>
      <MenuItem>Print...</MenuItem>
    </Menu>
  );
}

export default CenterMenu;