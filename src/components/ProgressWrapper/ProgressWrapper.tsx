import React, { ReactNode } from 'react'
import BackButton from '@/components/BackButton/BackButton'
import ProgressBar from '@/components/ProgressBar/ProgressBar'
import Button from '@/components/Button/Button'
export type ProgressWrapperProps = {
  stepHeaderText: string
  backButtonUrl: string
  currentProgressSegment: number
  totalProgressSegments: number
  isContinueDisabled: boolean
  onContinueClicked: () => void
  children: ReactNode
}
const ProgressWrapper: React.FC<ProgressWrapperProps> = ({
  stepHeaderText,
  onContinueClicked,
  backButtonUrl,
  currentProgressSegment,
  totalProgressSegments,
  isContinueDisabled: isDisabled,
  children
}) => {
  return (
    <div className='h-full flex flex-col w-full md:pb-[64px] md:px-[83px] px-[16px] py-[32px] bg-white md:rounded-xl md:shadow-xl '>
      <div className='h-[40px] hidden md:block'>
        {currentProgressSegment !== 1 && <BackButton href={backButtonUrl} />}
      </div>
      <div className='flex flex-col gap-y-[24px] md:gap-y-[30px] grow'>
        <h3 className='font-baskervald text-[20px] md:text-[38px]' data-testid='step-header-text'>
          {stepHeaderText}
        </h3>
        <ProgressBar
          totalSegments={totalProgressSegments}
          currentSegment={currentProgressSegment}
        />
        <div className='flex grow'>{children}</div>
        <div className='grow md:hidden'></div>
        <div className='flex self-end md:self-auto'>
          <Button
            text={'Continue'}
            buttonType={'primary'}
            isDisabled={isDisabled}
            onClick={onContinueClicked}
          />
        </div>
      </div>
    </div>
  )
}
export default ProgressWrapper
