import React, { Component } from 'react'
import { Carousel, CarouselItem, CarouselIndicators } from 'reactstrap'
import './ImageCarousel.scss'
import Swipeable from 'react-swipeable'
import ImageLoader from './ImageLoader'
import ImageZoom from './ImageZoom'

/**
 * @function ImageCarousel - a component which displays an array of items (childrens)
 * 
 * @param {number} [activeSlide] - The index of the active slide
 * @param {array} images - The list of image urls
 * @param {callback} onChange(index) - a callback for when image changed
 * @param {boolean} zoom - a boolean to decide if zoom is allowed or not (default = true)
 */

class ImageCarousel extends Component {

    constructor(props) {
        super(props)

        this.state = {
            activeSlide: 0
        }

        this.onExiting = this.onExiting.bind(this)
        this.onExited = this.onExited.bind(this)
        this.next = this.next.bind(this)
        this.previous = this.previous.bind(this)
        this.goToIndex = this.goToIndex.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
        if (props.activeSlide !== state.activeSlide) {
            return ({ activeSlide: props.activeSlide })
        }
        return null
    }

    onExiting() {
        this.animating = true
    }

    onExited() {
        this.animating = false
    }

    next() {
        const { onChange, images } = this.props

        if (this.animating) return
        const nextIndex = this.state.activeSlide === images.length - 1 ? 0 : this.state.activeSlide + 1
        this.setState({ activeSlide: nextIndex })
        onChange && onChange(nextIndex)
    }

    previous() {
        const { onChange, images } = this.props

        if (this.animating) return
        const nextIndex = this.state.activeSlide === 0 ? images.length - 1 : this.state.activeSlide - 1
        this.setState({ activeSlide: nextIndex })
        onChange && onChange(nextIndex)
    }

    goToIndex(newIndex) {

        const { onChange } = this.props

        if (this.animating) return
        this.setState({ activeSlide: newIndex })
        onChange && onChange(newIndex)
    }

    render() {

        const { images, zoom } = this.props

        if (!images || images.length === 0) return null

        const imageArray = images.map((item) => { return { src: item } })

        const slides = images.map((image, index) => {
            return <CarouselItem
                key={image}
                onExiting={this.onExiting}
                onExited={this.onExited}
            >
                <div className='img-wrapper'>
                    {zoom === undefined || zoom ?
                        <ImageZoom >
                            <ImageLoader className='image' src={image} />
                        </ImageZoom>
                        :
                        <ImageLoader className='image' src={image} />
                    }

                </div>
            </CarouselItem>
        })


        return <div className='imageCarousel-component'>
            <div className='carousel-arrows'>
                {imageArray.length > 1 && <span className='arrows left-arrow' onClick={this.previous}>&#8249;</span>}
                <div className='images-wrapper'>
                    <div className='imageCarousel carousel-fade'>
                        <Swipeable
                            trackMouse
                            preventDefaultTouchmoveEvent
                            onSwipedLeft={() => imageArray.length > 1 && this.next()}
                            onSwipedRight={() => imageArray.length > 1 && this.previous()}
                        >
                            <Carousel
                                activeIndex={this.state.activeSlide}
                                next={this.next}
                                previous={this.previous}
                                interval={false}
                            >
                                {slides}
                            </Carousel>
                        </Swipeable>
                    </div>
                </div>

                {imageArray.length > 1 && <span className='arrows right-arrow' onClick={this.next}>&#8250;</span>}
            </div>
            <div className='carousel-indicators'>
                {imageArray.length > 1 && <CarouselIndicators items={imageArray} activeIndex={this.state.activeSlide} onClickHandler={this.goToIndex} />}
            </div>
        </div >
    }

}

export default ImageCarousel

