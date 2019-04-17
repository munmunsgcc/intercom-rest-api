import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  border-radius: 10px;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15);
  width: 50vw;
  padding: 10px;
  margin: 20px auto auto auto;
`;

const InfoText = styled.div`
  font-family: PT Sans;
  font-size: 15px;
`;

const InfoInput = styled.input.attrs({ type: 'text' })`
  padding: 5px;
  font-family: PT Sans;
  font-size: 15px;
  margin-left: 5px;
  border-radius: 5px;
  width: 70%;
  color: black;
`;

const Button = styled.button`
  font-family: PT Sans;
  font-size: 15px;
  padding: 5px 10px;
  border-radius: 5px;
`;

const post = ({ type, method, data = true }) => fetch(`/${type}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ [method]: data }),
}).then(result => result.json().then(response => response));

const setClickableMethod = ({
  text, button, input, inputValue, buttonClick, inputClick,
}) => {
  const infoInputRef = useRef(null);
  let inputComponent = <InfoInput ref={infoInputRef} onClick={inputClick} />;

  if (typeof inputValue !== 'undefined') {
    inputComponent = (
      <InfoInput ref={infoInputRef} onClick={inputClick} value={inputValue} readOnly />
    );
  }

  return (
    <InfoText>
      {text}
      {typeof input !== 'undefined' ? inputComponent : ''}
      {typeof button !== 'undefined' ? (
        <Button
          onClick={() => {
            buttonClick(infoInputRef);
          }}
        >
          Click here
        </Button>
      ) : (
        ''
      )}
    </InfoText>
  );
};

setClickableMethod.defaultProps = {
  text: '',
  button: false,
  input: false,
  inputValue: '',
  buttonClick: () => {},
  inputClick: () => {},
};

setClickableMethod.propTypes = {
  text: PropTypes.string,
  button: PropTypes.bool,
  input: PropTypes.bool,
  inputValue: PropTypes.string,
  buttonClick: PropTypes.func,
  inputClick: PropTypes.func,
};

const Content = () => (
  <Container>
    {setClickableMethod({
      text: 'Visitor ID',
      input: true,
      inputValue: window.Intercom('getVisitorId'),
      inputClick: (e) => {
        e.target.select();
        document.execCommand('copy');
      },
    })}
    {setClickableMethod({
      text: 'Update User:',
      button: true,
      input: true,
      buttonClick: (inputRef) => {
        post({
          type: 'users',
          method: 'update',
          data: { email: inputRef.current.value, custom_attributes: { chocolate: 1 } },
        }).then((response) => {
          console.log(response);
        });
      },
    })}
    {setClickableMethod({
      text: 'Find User:',
      input: true,
      button: true,
      buttonClick: (inputRef) => {
        post({ type: 'users', method: 'find', data: { email: inputRef.current.value } }).then(
          (response) => {
            console.log(response);
          },
        );
      },
    })}
    {setClickableMethod({
      text: 'List Users:',
      button: true,
      buttonClick: () => {
        post({ type: 'users', method: 'list' }).then((response) => {
          console.log(response);
        });
      },
    })}
    {setClickableMethod({
      text: 'Convert Visitor to User:',
      button: true,
      buttonClick: () => {
        post({
          type: 'visitors',
          method: 'convert',
          data: {
            visitor: { user_id: window.Intercom('getVisitorId') },
            user: { email: 'testing123@gmail.com' },
            type: 'user',
          },
        }).then((response) => {
          console.log(response);
        });
      },
    })}
  </Container>
);

export default Content;
