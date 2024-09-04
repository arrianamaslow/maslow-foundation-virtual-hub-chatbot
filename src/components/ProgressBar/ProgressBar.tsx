import React from 'react'
import style from './ProgressBar.module.css'

export type ProgressBarProps = {
  totalSegments: number
  currentSegment: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ totalSegments, currentSegment }) => {
  return (
    <div className={style.segmentContainer}>
      {Array(totalSegments)
        .fill(1)
        .map((e, i) => (
          <div key={i} className={i < currentSegment ? style.doneSegment : style.notDoneSegment} />
        ))}
    </div>
  )
}

export default ProgressBar
