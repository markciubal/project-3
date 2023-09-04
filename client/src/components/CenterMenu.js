import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
// CSS Imports, for styling center menu.
// import "@szhsin/react-menu/dist/theme-dark.css";
import "@szhsin/react-menu/dist/index.css";
import Auth from '../utils/auth'; // Import Auth

const LoggedInComponents = (props) => {
  if (Auth.loggedIn()) {
    return <MenuItem onClick={() => { props.setIsPostPaneOpen(true)}}>Post</MenuItem>

  }
}

function CenterMenu(props) {
  return (
    <Menu id="right-button"
      menuButton={
      <MenuButton>
        <span id="center-down-button">{`@ ${props.centerLatitude.toFixed(props.coordinateRoundTo)}, ${props.centerLongitude.toFixed(props.coordinateRoundTo)}`} {props.currentEmoji}</span></MenuButton>}>
      <LoggedInComponents setIsPostPaneOpen={props.setIsPostPaneOpen}/>
    </Menu>
  );
}

export default CenterMenu;