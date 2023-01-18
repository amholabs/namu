import React from 'react'

import classNames from 'classnames'

interface Props {
  className?: string
}

export function Footer(props: Props) {
  const classes = classNames(props.className, 'Footer', 'px-4 py-6 flex flex-col justify-center items-center')

  return (
    <footer className={classes}>
      <div className="mt-2 flex items-center">
        <h1>Footer</h1>
      </div>
    </footer>
  )
}
