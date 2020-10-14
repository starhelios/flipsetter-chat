import React from 'react';

import { Touch, Icon, IconWrapper } from './styles';

export const IconButton = ({ isChoosen, iconSource, iconSize, tintColor, ...restProps }) => {
  return (
    <Touch {...restProps}>
      <IconWrapper isChoosen={isChoosen}>
        <Icon source={iconSource} size={iconSize} tintColor={tintColor} isChoosen={isChoosen} />
      </IconWrapper>
    </Touch>
  );
};
