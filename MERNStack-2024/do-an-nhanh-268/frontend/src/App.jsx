import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Header from './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className='app'>
      <Navbar />
      <Header />
      <Body />
      <Footer />
    </div>
  )
}

export default App