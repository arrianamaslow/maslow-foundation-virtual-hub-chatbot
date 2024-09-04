import React from 'react'
import Link from 'next/link'

type HeaderProps = {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className='flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
      <div className='flex items-center'>
        <Link
          className='flex-none text-xl font-semibold dark:text-white'
          href='/#'
          aria-label={title}
          passHref
        >
          {title}
        </Link>
      </div>
    </header>
  )
}

export default Header
