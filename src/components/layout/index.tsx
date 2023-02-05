import React, { ReactNode } from 'react'

// import classNames from 'classnames'

interface Props {
  children: ReactNode
  className?: string
}

export function Layout(props: Props) {
  // const classes = classNames(props.className, 'Footer', 'dark:bg-slate-900 dark:text-white min-h-[100vh]  flex flex-col')
  return (
    <div>
      {/* <Header /> */}
      <div>{props.children}</div>
      {/* <Footer /> */}
    </div>
  )
}
