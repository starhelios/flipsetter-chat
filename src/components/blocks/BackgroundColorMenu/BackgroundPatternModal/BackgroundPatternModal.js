import React from 'react';
import PT from 'prop-types';
import noop from 'lodash/noop';
import map from 'lodash/map';
import uuid from 'react-native-uuid';

import { backgrondPatterns } from '../../../../consts/BackgroundPatterns';

import {
  Modal, Scroller, Wrapper, Patterns, Container, Touch, ImagPreTouch,
} from './styles';

const BackgroundPatternModal = ({
  visible, onClose, onSavePath, call, user, onChangeBackground,
}) => {
  const onChoose = (pattern) => {
    const fullData = {
      id: uuid.v1(),
      timestamp: (new Date()).getTime(),
      user: {
        id: user.id,
        name: `${user.first} ${user.last}`,
        type: 1,
      },
      data: {
        color: 'rgba(0,0,0,1)',
        src: pattern.pathWeb,
        style: 5,
      },
      type: 20,
    };

    onSavePath(call.threadId, call.id, fullData);
    onChangeBackground({ patternName: pattern.pathWeb });
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <Container>
        <Scroller>
          <Wrapper>
            {map(
              backgrondPatterns,
              (pattern) => (
                <ImagPreTouch key={pattern.id}>
                  <Touch onPress={() => onChoose(pattern)}>
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
  user: PT.object.isRequired,
  call: PT.object.isRequired,
  onClose: PT.func,
  onSavePath: PT.func.isRequired,
  onChangeBackground: PT.func.isRequired,
};

BackgroundPatternModal.defaultProps = {
  onClose: noop,
};

export default BackgroundPatternModal;
