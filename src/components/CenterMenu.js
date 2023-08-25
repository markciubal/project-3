import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import "@szhsin/react-menu/dist/core.css";
const COORDINATE_ROUND_PLACES = 3;

function CenterMenu(props) {
  return (
    <Menu id="center-button" menuButton={<MenuButton>{`${props.centerLatitude.toFixed(COORDINATE_ROUND_PLACES)}, ${props.centerLongitude.toFixed(COORDINATE_ROUND_PLACES)}`} <span id="center-down-button">▼</span></MenuButton>}>
      <MenuItem>New File</MenuItem>
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