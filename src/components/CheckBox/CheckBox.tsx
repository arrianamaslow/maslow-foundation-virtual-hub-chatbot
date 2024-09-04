import React from 'react'
import Image from 'next/image'
import style from './CheckBox.module.css'

type CheckBoxProps = {
  tickIsActive: boolean
}

const tickedBox = (
  <div className={`${style.boxBorder} ${style.selectedBox}`}>
    <Image src='/img/checkbox-tick.svg' alt='selected option tick' width={16} height={16} />
  </div>
)

const unTickedBox = <div className={style.boxBorder} />

const CheckBox: React.FC<CheckBoxProps> = ({ tickIsActive }) => {
  return tickIsActive ? tickedBox : unTickedBox
}

export default CheckBox
