import React from 'react'
import ReactGA from 'react-ga'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router'

import Card from '../../components/card/Card'
import Modal from '../../components/modal/Modal'

import { IGenericProduct, IPartPropsCSSProperties } from '../../@types/types'
import { ALL_PRODUCTS } from '../../assets/products'
import { loadFromLocalStorage, removeFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage'
import './Home.scss'

const Home = () => {
  const history = useHistory()
  const [showIntroductionModal, setShowIntroModal] = React.useState<boolean>(loadFromLocalStorage('showIntro', true))
  const [trackMe, setTrackMe] = React.useState<boolean>(loadFromLocalStorage('trackMe', false))

  const [showAreYouSure, setShowAreYouSure] = React.useState<false | string>(false)
  const unsavedProducts = detectUnsavedProducts()
  const untouchedProducts = ALL_PRODUCTS.filter(p => !unsavedProducts.map(x => x.product.id).includes(p.id))

  React.useEffect(() => {
    if (!showIntroductionModal && trackMe) {
      ReactGA.initialize('UA-170883719-1')
      ReactGA.set({ anonymizeIp: true })
      ReactGA.pageview(window.location.pathname + window.location.search)
    }
  }, [showIntroductionModal, trackMe])

  return (
    <div className="page home">
      <Helmet>
        <title>CUSTOMIZER</title>
        <meta property="og:title" content="CUSTOMIZER" />
        <meta property="og:description" content="Customize and create your own dream sneaker concepts!" />
        <meta property="og:image" content="%PUBLIC_URL%/preview.png" />
      </Helmet>
      <div className="content-box">
        <div className="product-box">
          <h3>Sneakers</h3>
          <div className="card-row">
            {unsavedProducts.map(unsavedProduct => (
              <Card 
                key={unsavedProduct.product.id}
                partProps={unsavedProduct.partProps}
                product={unsavedProduct.product}
                handleClick={() => history.push(`/edit/${unsavedProduct.product.id}`)}
              />
            ))}
            {untouchedProducts.filter(p => p.enabled).map(product => (
              <Card 
                key={product.id}
                product={product}
                handleClick={() => handleCheckForUnsavedProduct(product.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal
        showModal={showIntroductionModal}
        closeText={'I agree'}
        onClose={() => {
          setShowIntroModal(false)
          saveToLocalStorage('showIntro', false)
          saveToLocalStorage('trackMe', true)
          setTrackMe(true)
        }}
        onCancel={() => {
          setShowIntroModal(false)
          saveToLocalStorage('showIntro', false)
          saveToLocalStorage('trackMe', false)
        }}
        cancelText={'Do not track me'}
        uuid={'introModal'}
        inContent={true}
      >
        <div className="intro-inner">
          <h3>Hello world!</h3>
          <p>I am a huge sneaker fan in general, but felt like some sneakers have been releasing in some mediocre colorways.</p>
          <p>I thought that even I could do better.</p>
          <p>So I found this new site... just kidding, I made this as a hobby project and want to share it with the world!</p>
          <p>Don't bait too many people with this please <span role="img" aria-label="sweating smile emoji">😅</span></p>

          <h3>Privacy policy</h3>
          <p>This website uses cookies, JavaScript and other comparable technologies in order to give you the best experience possible. With this, I can analyse and track the behaviour of visitors to and on this website with Google Analytics.</p>
          <a href="customizer/privacy.html" target="_blank" rel="noopener noreferrer">Click here to view the full privacy policy.</a>

          <p>Cookies are used on this website in order to save customizations of products and custom colors. These cookies are stored for an indefinite amount of time and are required for the website to function properly. This is done so that you can pick up where you left off at any given time on the same device.</p>
          <p><b>By clicking "I agree" you are agreeing to the privacy policy. By clicking "Do not track me" you are not agreeing to the privacy policy and will only be subject to required cookies and scripts needed to run this website.</b></p>
        </div>
      </Modal>

      <Modal
        showModal={showAreYouSure !== false}
        closeText={'Restart from scratch'}
        onClose={() => {
          if (showAreYouSure) {
            removeFromLocalStorage(showAreYouSure)
          }
          setShowAreYouSure(false)
          history.push(`/edit/${showAreYouSure}`)
        }}
        uuid={'are-you-sure'}
        buttonColors={{ backgroundColor: '#d30f0f', color: '#fff' }}
        onCancel={() => setShowAreYouSure(false)}
        cancelText={'Keep my design'}
      >
        <div>
          <h3>Wait!</h3>
          <p>You have already done some work on your <b>{ALL_PRODUCTS.find(x => x.id === showAreYouSure)?.name || 'product'}</b></p>
          <p>If you continue, you will lose all your previously done work <b>permanently</b>.</p>
          <b>Save the file as an image or take a screenshot of it to save your work!</b>
        </div>
      </Modal>

    </div>
  )

  function handleCheckForUnsavedProduct(id: string) {
    const previous = loadFromLocalStorage(id, undefined)

    if (previous) {
      setShowAreYouSure(id)
    } else {
      history.push(`/edit/${id}`)
    }
  }

  function detectUnsavedProducts() : { product: IGenericProduct, partProps: IPartPropsCSSProperties }[] {
    const savedProducts = ALL_PRODUCTS.map(product => ({ 
      product,
      partProps: loadFromLocalStorage(product.id, null) as IPartPropsCSSProperties 
    })).filter(p => p.partProps !== null)

    return savedProducts
  }
}

export default Home