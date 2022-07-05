import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useInnerHeight } from '../hooks/innerHeight'


const ContainerBlock = ({ children, customMeta, ...props }) => {

  const innerHeight = useInnerHeight()

  const meta = {
    title: 'Movies-Map',
    description: `Movies in SF`,
    type: 'website',
    ...customMeta,
  }

  return (
    <>
      <Head>
        <meta name='robots' content='follow, index' />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
        <title>{meta.title}</title>

        <meta name="author" content="Michel Cruz" />
        <meta name='description' content={meta.description} />
        <meta name="keywords" content="michel,cruz,michel cruz,taurien,portfolio,web,ux,ui,graphic,design,graphic design,designer,developer,web developer,frontend,backend,front-end,back-end,fullstack,full-stack,javascript,freelance"/>

        {/* Open Graph */}
        <meta property='og:type' content={meta.type} />
        <meta property='og:title' content={meta.title} />
        <meta property='og:description' content={meta.description} />
      </Head>
      
      <main
        style={{ height: `${innerHeight}px` }}
        className={`font-work_sans`} {...props}
      >
        {children}
      </main>
    </>
  )
}

export default ContainerBlock
