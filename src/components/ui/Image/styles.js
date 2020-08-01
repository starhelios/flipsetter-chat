import styled from 'styled-components/native';

export const Container = styled.Image.attrs((props) => ({
  resizeMode: 'cover',

  ...props,
}))`
  ${(props) => (props.tintColor ? `tintColor:${props.tintColor}` : '')};
  height: ${(props) => (props.size ? `${props.size}px` : 'auto')};
  width: ${(props) => (props.size ? `${props.size}px` : 'auto')};
`;
