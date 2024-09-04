'use client'
import React, { useState } from 'react'
import TextInput from '@/components/TextInput/TextInput'
import DateInput from '@/components/DateInput/DateInput'
import Button from '@/components/Button/Button'
import { useRouter } from 'next/navigation'
import Radios from '@/components/Radios/Radios'
import { useAppDispatch } from '@/lib/hooks'
import { setUserId } from '@/lib/features/userIdSlice'
import { z } from 'zod'
import { postRequest } from '@/lib/functions/postRequest'

export default function PersonalDetailsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [nameInfo, setNameInfo] = useState({ name: '', isValid: false })
  const [locationInfo, setLocationInfo] = useState({ location: '', isValid: false })
  const [dateInfo, setDateInfo] = useState({ date: '', isValid: false })
  const [emailInfo, setEmailInfo] = useState({ email: '', isValid: false })
  const [phoneNumberInfo, setPhoneNumberInfo] = useState({ phoneNumber: '', isValid: false })
  const [preferredContactMethod, setPreferredContactMethod] = useState('Email')

  async function handleClick() {
    const { userId } = await postRequest(
      '/api/SQL_Queries/setPersonalDetails',
      {
        fullName: nameInfo.name,
        location: locationInfo.location,
        dateOfBirth: dateInfo.date,
        email: emailInfo.email,
        phoneNumber: phoneNumberInfo.phoneNumber,
        preferredContactMethod
      },
      z.any()
    )

    try {
      window.localStorage.setItem('userId', userId)
    } catch {}
    dispatch(setUserId(parseInt(userId)))
    router.push('/chat')
  }

  return (
    <div className='fixed h-[100dvh] bottom-0 flex flex-col items-center w-screen overflow-y-none bg-neutral-100 justify-between'>
      <div className='align-top flex justify-around items-end w-full md:py-[24px] py-[16px]'>
        <div>
          <img
            className='min-w-[107px] max-w-[172px] w-[20vw] flex justify-center'
            src='/img/maslow-title-logo-variation.svg'
          />
        </div>
      </div>

      <div className='flex  flex-col md:py-[64px] md:px-[83px] pt-[32px] px-[16px] pb-[64px]  md:items-center md:w-[840px] w-full overflow-auto bg-white h-screen border md:rounded-xl md:shadow-xl'>
        <div className='mt-auto mb-auto  md:w-[674px]'>
          <div className=' md:w-full md:flex md:flex-col  md:items-center'>
            <div className='md:w-[674px]'>
              <div className='flex md:w-full flex-col'>
                <p className='font-baskervald md:h-[42px] h-[32px] md:text-[38px] text-[23px] leading-none whitespace-pre-wrap break-after-column'>
                  Personal Details
                </p>
              </div>

              <div className='md:pb-[65px] md:w-full md:pt-[65px] pt-[32px] pb-[32px]'>
                <TextInput
                  questionText="What's your full name?"
                  placeholderText='John Smith'
                  validation={(name) => {
                    if (name.length >= 1) {
                      setNameInfo({ name, isValid: true })
                      return ''
                    } else {
                      setNameInfo({ name, isValid: false })
                      return 'Required'
                    }
                  }}
                />
              </div>

              <div className='md:pb-[65px] pb-[32px] md:w-full max-md:w-fit'>
                <DateInput
                  setDate={(date: string, isValid: boolean) => setDateInfo({ date, isValid })}
                  questionText="When's your date of birth?"
                />
              </div>

              <div className='md:w-full '>
                <TextInput
                  questionText='What town/city are you based in?'
                  placeholderText='London'
                  validation={(location) => {
                    if (location.length >= 1) {
                      setLocationInfo({ location, isValid: true })
                      return ''
                    } else {
                      setLocationInfo({ location, isValid: false })
                      return 'Required'
                    }
                  }}
                />
              </div>
            </div>

            <div className=' md:w-full md:flex md:flex-col  md:items-center md:pt-[70px] pt-[40px]'>
              <div className='flex md:w-full flex-col'>
                <p className='font-baskervald md:h-[42px] md:text-[38px] text-[21px] leading-none whitespace-pre-wrap break-after-column'>
                  Contact Details
                </p>
              </div>
              <div className='md:pb-[65px] md:w-full md:pt-[65px] pb-[32px] pt-[32px]'>
                <TextInput
                  questionText='Email'
                  placeholderText='John.Smith@gmail.com'
                  validation={(email: string) => {
                    const validEmail = email.match(
                      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )
                    if (email.length === 0) {
                      setEmailInfo({ email, isValid: false })
                      return 'Required'
                    } else if (validEmail) {
                      setEmailInfo({ email, isValid: true })
                      return ''
                    } else {
                      setEmailInfo({ email, isValid: false })
                      return 'Invalid email'
                    }
                  }}
                />
              </div>

              <div className='md:w-full '>
                <TextInput
                  questionText='Phone number'
                  placeholderText='07123456789'
                  validation={(phoneNumber: string) => {
                    const validNumber = phoneNumber.match(
                      /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/
                    )
                    if (phoneNumber.length === 0) {
                      setPhoneNumberInfo({ phoneNumber, isValid: false })
                      return 'Required'
                    } else if (validNumber) {
                      setPhoneNumberInfo({ phoneNumber, isValid: true })
                      return ''
                    } else {
                      setPhoneNumberInfo({ phoneNumber, isValid: false })
                      return 'Invalid phone number'
                    }
                  }}
                />
              </div>

              <div className='md:w-full md:pt-[65px] pt-[40px] '>
                <p className='md:text-[21px] text-[17px] md:pb-[16px] pb-[11px] font-normal font-lato leading-none whitespace-pre-wrap break-after-column'>
                  Preferred method of contact:
                </p>
                <div className='md:text-[17px] text-[14px] font-normal font-lato'>
                  <Radios
                    defaultSelectedIndex={0}
                    radioGroupName={'Preferred method of contact'}
                    radioValues={['Email', 'Phone']}
                    radioClickedCallback={function (value: React.SetStateAction<string>): void {
                      setPreferredContactMethod(value)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='md:w-full flex flex-row items-center !justify-end  '>
          <div className='flex md:w-full !justify-end pt-[40px] md:pt-[65px]'>
            <Button
              text='Continue'
              isDisabled={
                !(
                  nameInfo.isValid &&
                  locationInfo.isValid &&
                  dateInfo.isValid &&
                  emailInfo.isValid &&
                  phoneNumberInfo.isValid
                )
              }
              onClick={handleClick}
              buttonType='primary'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
