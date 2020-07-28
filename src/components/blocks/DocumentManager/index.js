import React from 'react';

import {
  Container, Header, Hr, Folder, File, CloseMenu,
} from './styles';

import { buildingsImg, workingImg } from '../../../images';

const FILE_LIST = [{
  id: 'gw4rt54w235r45w2r',
  thumbImg: buildingsImg,
  fileName: 'Buildings.jpg',
},
{
  id: 'gw4rt54w235r42345w2r',
  thumbImg: workingImg,
  fileName: 'Working.jpg',
},
{
  id: 'gw4rt54wredw235r45w2r',
  thumbImg: workingImg,
  fileName: 'Buildings.jpg',
},
{
  id: 'gw4rt54wsefrdv3wee4235r45w2r',
  thumbImg: buildingsImg,
  fileName: 'Working.jpg',
}];

export const DocumentManager = ({ onClose }) => {
  return (
    <Container>
      <CloseMenu onPress={onClose} />
      <Header>Document Manager</Header>
      <Hr />
      <Folder
        data={FILE_LIST}
        renderItem={({ item, index }) => <File file={item} isEven={(index % 2) !== 0} />}
      />
    </Container>
  );
};
