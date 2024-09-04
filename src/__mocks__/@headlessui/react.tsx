/**
 * @jest-environment jsdom
 */

import { DialogProps } from '@headlessui/react'
import React, { ReactNode } from 'react'

type DialogPanelTestProps = {
  children?: ReactNode
}

interface DialogTestProps extends DialogProps {
  children?: ReactNode
}

const DialogPanel: React.FC<DialogPanelTestProps> = ({ children }) => {
  return <div data-testid='mock-dialog-panel-component'>{children}</div>
}

const Dialog: React.FC<DialogTestProps> = ({ open, children }) => {
  return (
    <div data-testid='mock-dialog-component'>
      {open ? 'DIALOGUEOPENED' : 'DIALOGUECLOSED'}
      {children}
    </div>
  )
}

export { Dialog, DialogPanel }
