import React from 'react';
import { Icon } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Colors from '../../config/Colors';

export default class TabBarIcon extends React.Component {
  FA = false;
  render() {
     if(this.FA === true){
       return (
          <FontAwesome5
              name={this.props.name}
              size={25}
              style={{ alignItems: 'center', justifyContent: 'center',}}
              color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
       );
     }
     else{
       return (
         <Icon
             type='FontAwesome'
             name={this.props.name}
             size={20}
             style={{ alignItems: 'center', justifyContent: 'center', textAlignVertical: 'center'}}
             color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
         />
       );
     }
  }
}