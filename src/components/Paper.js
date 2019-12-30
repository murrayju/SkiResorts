import styled from 'styled-components';

const Paper = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  padding: 15px;
  margin-bottom: ${({ noMargin }) => (noMargin ? 0 : '15px')};
  width: 100%;
  flex: ${({ flex }) => (flex === true ? '1 1' : flex || null)};

  > :first-child {
    margin-top: 0;
  }
  > :last-child {
    margin-bottom: 0;
  }
`;

export default Paper;
