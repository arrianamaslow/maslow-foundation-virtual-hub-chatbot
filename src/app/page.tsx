'use client'
import Image from 'next/image'
import Button from '@/components/Button/Button'
import { useRouter } from 'next/navigation'

export default function IndexPage() {
  const privacyPolicyURL = '/'
  const router = useRouter()
  function handleClick() {
    router.push('/second-introduction')
  }
  return (
    <div className='flex flex-col md:items-center md:justify-center h-[calc(100dvh)] px-4 py-4'>
      <div className='flex flex-col md:w-[520px]'>
        <div className='w-full'>
          <Image src='/img/maslow-logo-colour.svg' alt={'maslow logo'} width={98} height={85} />
          <h3 className='font-baskervald leading-tight mt-[64px]'>
            Hello I&apos;m the Maslow Foundation&apos;s chatbot, Masbot! <br />
            <br />
            I&apos;m here to help you get the support you need for your situation.
          </h3>
        </div>
      </div>
      <div className='flex flex-col justify-between mt-auto md:mt-[64px] w-full md:w-[520px]'>
        <div className='md:w-full w-[113px] md:static absolute bottom-[84px] right-[15px] md:mb-[16px] self-end'>
          <Button text='Continue' isDisabled={false} onClick={handleClick} buttonType='primary' />
        </div>

        <div className='inline-block items-start self-start leading-[18px] mb-[15px]'>
          <p className='text-[14px] inline'>
            By continuing I agree to the Maslow Foundation&apos;s{' '}
          </p>
          <a href={privacyPolicyURL} className='text-[14px] font inline font-bold'>
            <u>privacy policy</u>
          </a>
        </div>
      </div>
    </div>
  )
}
