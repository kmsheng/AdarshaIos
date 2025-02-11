import {openDb, setSideMenuStatus, loadStorage, setDeviceSize,
  setOrientation, setDeviceOrientation} from '../modules/main';
import {openToc} from '../modules/category';
import SideMenu from 'react-native-side-menu';
import React, {Component, Navigator, PropTypes} from 'react-native';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {Biography, DetailView, MasterView, Menu} from '../components';
import {connect} from 'react-redux/native';
import {renderSpinner, attachKeyboard} from '../helpers';
import {styles} from './Main.style';
import Orientation from 'react-native-orientation';
import {MENU_WIDTH} from '../constants/AppConstants';

@connect(state => ({
  isLoading: state.main.get('isLoading'),
  isSideMenuOpen: state.main.get('isSideMenuOpen')
}), {openDb, openToc, loadStorage, setSideMenuStatus,
  setDeviceOrientation, setOrientation, setDeviceSize})
@attachKeyboard
class Main extends Component {

  static PropTypes = {
    openDb: PropTypes.func.isRequired,
    openToc: PropTypes.func.isRequired,
    loadStorage: PropTypes.func.isRequired,
    setDeviceOrientation: PropTypes.func.isRequired,
    setOrientation: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSideMenuOpen: PropTypes.bool.isRequired,
    setDeviceSize: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.preload();
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = orientation => this.props.setOrientation(orientation);

  async preload() {

    let {openDb, openToc, loadStorage, setDeviceOrientation, setDeviceSize} = this.props;

    try {
      await setDeviceSize();
      await setDeviceOrientation();
      Orientation.addOrientationListener(this._orientationDidChange);

      await loadStorage();
      await openToc();
      await openDb();
    }
    catch (e) {
      console.error('preload err: ', e);
    }
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  handleSideMenuChange = isOpen => {
    this.props.setSideMenuStatus(isOpen);
  };

  renderContent = (route, navigator) => {

    if ('Biography' === route.name) {
      return <Biography vpos={route.vpos} navigator={navigator} title={route.title} />;
    }

    if ('DetailView' === route.name) {

      let detailViewProps = {
        navigator,
        route,
        keyword: route.keyword,
        rows: route.rows
      };

      return <DetailView {...detailViewProps} />;
    }
    return <MasterView navigator={navigator} route={route} />;
  };

  renderScene = (route, navigator) => {

    if (this.props.isLoading) {
      return renderSpinner();
    }

    let sideMenuProps = {
      isOpen: this.props.isSideMenuOpen,
      menu: (<Menu />),
      menuPosition: 'right',
      openMenuOffset: MENU_WIDTH,
      onChange: this.handleSideMenuChange
    };

    return (
      <SideMenu {...sideMenuProps}>
        {this.renderContent(route, navigator)}
      </SideMenu>
    );
  };

  render() {

    let navigatorProps = {
      style: styles.navigatorIos,
      initialRoute: {
        index: 0
      },
      renderScene: this.renderScene.bind(this)
    };

    return <Navigator {...navigatorProps} />;
  }
}

export default Main;
