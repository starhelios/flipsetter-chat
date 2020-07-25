import React from 'react';

import { Touch, Icon } from './styles';

export const IconButton = ({ iconSource, iconSize, tintColor, ...restProps }) => {
  return (
    <Touch {...restProps}>
      <Icon source={iconSource} size={iconSize} tintColor={tintColor} />
    </Touch>
  );
};
