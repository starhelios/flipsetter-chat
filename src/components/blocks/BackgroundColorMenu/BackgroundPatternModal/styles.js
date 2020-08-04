import styled from 'styled-components/native';

export const Modal = styled.Modal.attrs({
  transparent: true,
  supportedOrientations: ['portrait', 'landscape'],
})`
  display: flex;
`;
export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Scroller = styled.ScrollView`
  width: 350px;
  max-height: 500px;
  background-color: white;
  border-radius: 8px;
  border-width: 1px;
  border-color: black;
`;

export const Wrapper = styled.View`
  padding: 15px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

export const Touch = styled.TouchableOpacity``;

export const Patterns = styled.Image`
  height: 130px;
  width: 130px;
  border-radius: 6px;
`;

export const ImagPreTouch = styled.View`
  border-width: 1px;
  border-color: black;
  margin: 10px;
  border-radius: 6px;
`;
