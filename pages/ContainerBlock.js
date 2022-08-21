import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useInnerHeight } from '../hooks/innerHeight'


const ContainerBlock = ({ children, customMeta, ...props }) => {

  const router = useRouter()

  const innerHeight = useInnerHeight()

  const meta = {
    title: 'UFO Sightings 🛸',
    description: `UFO sights around the world. Based on N.U.F.O.R.C data`,
    type: 'website',
    image: '',
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
        <meta name="keywords" content="ufo,ovni,ovnis,nuforc,sightings"/>

        {/* Open Graph */}
        <meta property='og:type' content={meta.type} />
        <meta property='og:title' content={meta.title} />
        <meta property='og:description' content={meta.description} />
        <meta property='og:type' content={meta.type} />
        <meta property='og:site_name' content={meta.title} />

        {/* <meta
          property='og:url'
          // content={`https://${router.asPath}`}
        />
        
        <link
          rel='canonical'
          // href={`https://${router.asPath}`}
        /> */}

        {/* Twitter */}
        <meta name='twitter:image' content={meta.image} />
        <meta name='twitter:title' content={meta.title} />
        <meta name='twitter:description' content={meta.description} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@michelcruz_me' />

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
