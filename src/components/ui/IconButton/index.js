import React from 'react'

import { Touch, Icon } from './styles'

export const IconButton = ({ iconSource }) => {
  return <Touch><Icon source={{ uri: iconSource }} /></Touch>
}

