import React, { useState } from 'react';
import { OpinionForm, IFormInput } from './form/opinion-form';
import { Modalizer } from './modal/modalizer';
import { SubmitIndicator } from './modal/submit-indicator';

function App() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [formValues, setFormValues] = useState<IFormInput | null>(null);
  const [activeElementStocked, setActiveElementStocked] = useState<HTMLElement | null>(null);

  return (
    <>
    </>
  );
}

export default App;
