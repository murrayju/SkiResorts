// @flow
import React from 'react';
import styled from 'styled-components';

import { Spinner } from './Icon';

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
`;

const LoadingText = styled.h4`
  && {
    display: inline;
    margin-left: 20px;
    vertical-align: middle;
    color: inherit;
  }
`;

type Props = {
  loading?: boolean,
  verb?: string,
  what?: string,
};

const Loading = ({ loading, verb = 'Loading', what = '' }: Props) => (
  <>
    {loading && (
      <Box>
        <Spinner size={32} />
        <LoadingText>
          {verb}
          {what ? ` ${what}` : ''}
          ...
        </LoadingText>
      </Box>
    )}
  </>
);
Loading.defaultProps = {
  loading: true,
  verb: 'Loading',
  what: '',
};

export default Loading;
