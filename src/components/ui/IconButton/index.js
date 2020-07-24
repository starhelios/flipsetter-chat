import React from 'react';

import { Touch, Icon } from './styles';

export const IconButton = ({ iconSource, iconSize, tintColor }) => {
  return (
    <Touch>
      <Icon source={iconSource} size={iconSize} tintColor={tintColor} />
    </Touch>
  );
};
