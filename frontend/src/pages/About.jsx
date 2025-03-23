import React from 'react'
import Title from '../components/Title.jsx'
import {assets} from '../assets/assets.js'
import NewsLetterBox from '../components/NewsLetterBox.jsx'
const About = () => {
  return (
    <div className='px-2 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'> {/*  */}
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={"ABOUT"} text2={"US"}/>
      </div>
      <div className='my-10 flex flex-col  md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti excepturi qui veritatis tenetur dignissimos, quis minima non, numquam consequatur pariatur perspiciatis?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores iure doloribus dicta, placeat consequatur numquam dolor ad voluptate quisquam? Maxime earum, mollitia similique dolores nulla harum non officiis quae. Doloremque, excepturi.</p>
        <b className='text-gray-800'>Our Mission</b>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore aliquam facilis voluptatem ullam quod maxime doloremque, incidunt hic harum officia ab laudantium labore dolores.</p>
        </div>
      </div>
      <div className='text-4xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Lorem ipsum dolor sit amet.</b>
          <p className='text-gray-600'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae ipsam, iste hic dolorem sequi numquam, possimus sit ex, laborum aliquid ullam?</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Lorem ipsum dolor sit amet.</b>
          <p className='text-gray-600'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae ipsam, iste hic dolorem sequi numquam, possimus sit ex, laborum aliquid ullam?</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Lorem ipsum dolor sit amet.</b>
          <p className='text-gray-600'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae ipsam, iste hic dolorem sequi numquam, possimus sit ex, laborum aliquid ullam?</p>
        </div>
      </div>
      <NewsLetterBox/>
    </div>
  )
}

export default About
