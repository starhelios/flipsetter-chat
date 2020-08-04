import React from 'react';
import PT from 'prop-types';
import noop from 'lodash/noop';
import map from 'lodash/map';

import {
  blackboardPatternImg, circlePatternImg, fencePatternImg, metalPatternImg,
  orangePatternImg, spacePatternImg, woodPatternImg, wood2PatternImg, watterPatternImg,
} from '../../../../images';

import {
  Modal, Scroller, Wrapper, Patterns, Container, Touch, ImagPreTouch,
} from './styles';

const BackgroundPatternModal = ({ visible, onClose }) => {
  const backgrondPatterns = [{
    id: 'asdasdf3443',
    image: blackboardPatternImg,
  }, {
    id: 'asdasdf34431',
    image: circlePatternImg,
  }, {
    id: 'asdasdf34432',
    image: woodPatternImg,
  }, {
    id: 'asdasdf34433',
    image: wood2PatternImg,
  }, {
    id: 'asdasdf3443ewfr',
    image: fencePatternImg,
  }, {
    id: 'asdaswertdf34433',
    image: metalPatternImg,
  }, {
    id: 'asdasdfsdf34433',
    image: orangePatternImg,
  }, {
    id: 'asdasqw3rdf34433',
    image: spacePatternImg,
  }, {
    id: 'asdasdf34434',
    image: watterPatternImg,
  }];

  return (
    <Modal visible={visible} onClose={onClose}>
      <Container>
        <Scroller>
          <Wrapper>
            {map(
              backgrondPatterns,
              (pattern) => (
                <ImagPreTouch key={pattern.id}>
                  <Touch onPress={onClose}>
                    <Patterns source={pattern.image} />
                  </Touch>
                </ImagPreTouch>
              ),
            )}
          </Wrapper>
        </Scroller>
      </Container>
    </Modal>
  );
};

BackgroundPatternModal.propTypes = {
  visible: PT.bool.isRequired,
  onClose: PT.func,
};

BackgroundPatternModal.defaultProps = {
  onClose: noop,
};

export default BackgroundPatternModal;
