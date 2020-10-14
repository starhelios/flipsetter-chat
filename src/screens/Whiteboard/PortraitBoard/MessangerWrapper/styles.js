import styled from 'styled-components/native';
import Color from '../../../../config/Colors';
import { Image, Text, IconButton } from '../../../../components/ui';
import { logoImg, closeIcon } from '../../../../images';

export { Messenger } from '../../../../components/blocks';

export const Modal = styled.Modal`
  flex: 1;
`;

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const Header = styled.View`
  background-color: ${Color.headerBackgroundColor};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  paddingHorizontal: 10px;
`;
export const Logo = styled(Image).attrs({
  source: logoImg,
})`
  height: 40px;
  width: 40px;
`;
export const HeaderText = styled(Text)`
  color: ${Color.white};
  font-weight: bold;
  font-size: 25px;
  padding-left: 5px;
`;

export const CloseButton = styled(IconButton).attrs({
  iconSource: closeIcon,
  iconSize: 20,
  tintColor: Color.white,
})``;

export const AvatarsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

export const Avatar = styled.Image`
  height: 36px;
  width: 36px;
  margin-right: 6px;
`;
