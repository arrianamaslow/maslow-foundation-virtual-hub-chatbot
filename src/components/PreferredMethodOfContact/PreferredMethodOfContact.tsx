'use client'
import Radios from '@/components/Radios/Radios'

import React, { useState } from 'react'

const PreferredMethodOfContact: React.FC = () => {
  const [preferredContactMethod, setPreferredContactMethod] = useState<string>('not selected')
  return (
    <div className='text-[1.313rem] w-[23.438rem]'>
      <p className='font-bold'>Preferred method of contact</p>
      <Radios
        radioGroupName='preferredContactMethodRadioButton'
        radioClickedCallback={setPreferredContactMethod}
        radioValues={['Phone', 'Email']}
      />
    </div>
  )
}

export default PreferredMethodOfContact
