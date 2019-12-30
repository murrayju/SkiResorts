import styled from 'styled-components';

export const Container = styled.div`
  flex: 1 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: 100%;
  max-width: ${({ fullWidth }) => (fullWidth ? '100%' : '1200px')};
  overflow-y: ${({ scroll }) => (scroll ? 'auto' : 'visible')};
  overflow-x: ${({ scroll }) => (scroll ? 'hidden' : 'visible')};
  > * {
    flex: 0 0 auto;
  }
`;

export const Heading = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
`;

export const FlowLeft = styled.div`
  flex: 1 1 auto;
  @media (max-width: 500px) {
    h2 {
      font-size: 20px;
      margin: 11px 0;
    }
  }
`;

export const FlowRight = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-end;
  margin: 0 -10px;
  > * {
    margin: 0 10px 5px;
    &:last-child {
      margin-right: 13px;
    }
    @media (max-width: 500px) {
      margin: 3px 5px;
      &:last-child {
        margin-right: 13px;
      }
    }
  }
`;

export const FormGroupFlowBox = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-flow: row wrap;
  margin: 0 -10px;
  position: relative;
  width: 100%;

  > .form-group {
    flex: 1 1 auto;
    margin: 0 10px 10px;
    min-width: 75%;
    @media (min-width: 500px) {
      min-width: 200px;
    }
  }
  > .checkbox {
    flex: 1 1 auto;
    margin: 0 10px 10px;
    min-width: 75%;
  }
`;
