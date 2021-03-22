import React, { useEffect, useState } from 'react';

// хук, отвечающий за валидацию
const useValidation = (value, validations) => {
  const [isEmpty, setEmpty] = useState(true);
  const [minLengthError, setMinLengthError] = useState(false);
  const [maxLengthError, setMaxLengthError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case 'minLength':
          value.length < validations[validation] ? setMinLengthError(true) : setMinLengthError(false);
          break;
        case 'isEmpty':
          value ? setEmpty(false) : setEmpty(true);
          break;
        case 'maxLength':
          value.length > validations[validation] ? setMaxLengthError(true) : setMaxLengthError(false);
          break;
        case 'isEmail':
          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          re.test(String(value).toLowerCase()) ? setEmailError(false) : setEmailError(true);
          break;
      }
    }
  }, [value])

  return {
    isEmpty,
    minLengthError,
    emailError,
    maxLengthError,
  }
}


// обработчики, которые считывают изменения в инпутах, кастомный хук
const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setDirty] = useState(false);

  const valid = useValidation(value, validations)

  // читает изменения
  const onChange = (e) => {
    setValue(e.target.value)
  }
  // обрабатывает в тот момент когда пользоатель покинул инпут
  const onBlur = (e) => {
    setDirty(true)
  }

  return {
    value,
    onChange,
    onBlur,
    isDirty,
    ...valid,
  }

}

function App() {
  const email = useInput('', { isEmpty: true, minLength: 3,  emailError: true });
  const password = useInput('', { isEmpty: true, minLength: 5,  maxLength: 6});

  return (
    <div className="App">
      <form action="">
        <h1>Registration</h1>
        {(email.isDirty && email.isEmpty) && <div style={{ color: 'red' }}>Filed can not be empty</div>}
        {(email.isDirty && email.minLengthError) && <div style={{ color: 'red' }}>min lenght is 3 symbols</div>}
        {(email.isDirty && email.emailError) && <div style={{ color: 'red' }}>not correct email</div>}
        <input
          onChange={e => email.onChange(e)}
          onBlur={e => email.onBlur(e)}
          value={email.value}
          name='email'
          type="text"
          placeholder='enter your email...' />


        {(password.isDirty && password.isEmpty) && <div style={{ color: 'red' }}>Filed can not be empty</div>}
        {(password.isDirty && password.minLengthError) && <div style={{ color: 'red' }}>min lenght is 3 symbols</div>}
        {(password.isDirty && password.maxLengthError) && <div style={{ color: 'red' }}>not correct email</div>}
        <input
          onChange={e => password.onChange(e)}
          onBlur={e => password.onBlur(e)}
          value={password.value}
          name='password'
          type="password"
          placeholder='enter your password' />

        <button type='submit'>Registration</button>
      </form>
    </div>
  );
}

export default App;
