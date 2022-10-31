import React, { useState, useEffect } from 'react'
import Swiper from 'swiper'
import { SliderContainer } from './style'
import 'swiper/dist/css/swiper.css'

function Slider(props) {

  console.log('props', props)
  const { bannerList = [] } = props
  const [ sliderSwiper, setSliderSwiper ] = useState(null);


  useEffect(() => {
    if (bannerList.length && !sliderSwiper) {
      let newSliderSwiper = new Swiper('.slider-container', {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: { el: '.swiper-pagination' }
      });
      // console.log('newSliderSwiper', newSliderSwiper)
      setSliderSwiper(newSliderSwiper);
    }

    console.log('slider useEffect')
  }, [bannerList.length, sliderSwiper]);

  // useEffect(() => {
  //   console.log('slider Effect')
  // });

  return (
    <SliderContainer>
      <div className="before"></div>
      <div className='slider-container'>
        <div className='swiper-wrapper'>
          {
            bannerList.map((slider, index) => {
              return (
                <div className='swiper-slide' key={ index }>
                  <div className='slider-nav'>
                    <img src={ slider.imageUrl } alt="推荐" width="100%" height="100%" />
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className='swiper-pagination'></div>
      </div>
      {/* {
        console.log('slider return')
      } */}
    </SliderContainer>
  )
}

export default React.memo(Slider);
