import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import PostModal from './PostModal';
// CSS Imports, for styling center menu.
// import "@szhsin/react-menu/dist/theme-dark.css";
import "@szhsin/react-menu/dist/index.css";

function CenterMenu(props) {
  return (
    <Menu id="center-button"
      menuButton={
      <MenuButton>
        <span id="center-down-button">{`@ ${props.centerLatitude.toFixed(props.coordinateRoundTo)}, ${props.centerLongitude.toFixed(props.coordinateRoundTo)}`} {props.currentEmoji}</span></MenuButton>}>
      <MenuItem onClick={() => { props.panAndZoomToMe()}}>Pan and Zoom to Me</MenuItem>
      <MenuItem onClick={() => { props.setIsPostPaneOpen(true)}}>Post</MenuItem>
      {/* <SubMenu label="Edit">
        <MenuItem>-</MenuItem>
        <MenuItem>-</MenuItem>
        <MenuItem>-</MenuItem>
      </SubMenu>
      <MenuItem>-</MenuItem> */}
    </Menu>
  );
}

export default CenterMenu;