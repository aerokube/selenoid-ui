import styled from 'styled-components/macro'

const mainGreen = '#59a781';
const brightGreen = '#57ff76';
const brightRed = '#fc4022';
const mainRed = '#cf3223';

export const StyledStatus = styled.div`
  position: relative;
  text-transform: uppercase;
  color: #fff;
  margin-left: 50px;

.indicator {
  line-height: 30px;
  transition: color 0.5s ease-out 0s;

  &:before {
    content: "";
    width: 10px;
    height: 10px;
    border: 1px solid #fff;
    position: absolute;
    border-radius: 50%;
    left: -20px;
    top: 8px;
    transition: border-color 0.5s ease-out 0s, box-shadow 0.5s ease-out 0.2s
  }

  &_ok {
    color: ${mainGreen};

    &:before {
      box-shadow: 0 0 10px ${brightGreen};
      border-color: ${mainGreen};
    }
  }

  &_error {
    color: ${mainRed};

    &:before {
      box-shadow: 0 0 10px ${brightRed};
      border-color: ${mainRed};
    }
  }
}
`;