'use client'
import Image from 'next/image'
import Button from '@/components/Button/Button'
import { useRouter } from 'next/navigation'

export default function IndexPage() {
  const router = useRouter()
  function handleClick() {
    router.push('/personal-details')
  }
  return (
    <div className='flex flex-col md:items-center md:justify-center h-[calc(100dvh)] px-4 py-[10px]'>
      <div className='flex flex-col md:w-[520px] gap-y-16'>
        <Image src='/img/maslow-logo-colour.svg' alt={'maslow logo'} width={98} height={85} />
        <h3 className='font-baskervald leading-tight mt-[63px] md:mt-0'>
          Don&apos;t worry! After we have a quick chat, you&apos;ll be able to book a call with of
          our co-ordinators.
        </h3>
        <div className='md:w-full w-[113px] md:static absolute bottom-[84px] right-[15px] md:mb-[16px] self-end'>
          <Button text='Continue' isDisabled={false} onClick={handleClick} buttonType='primary' />
        </div>
      </div>
    </div>
  )
}
