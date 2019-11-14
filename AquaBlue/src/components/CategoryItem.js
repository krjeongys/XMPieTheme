import './CategoryItem.scss'
import {Link} from '$routes'
import LinesEllipsis from 'react-lines-ellipsis'

/**
 * This component represents the category in the store
 * It contains the category image and details
 *
 * @param {object} model - the category
 * @param {string} url - the url to redirects when clicking the category
 * @param {string} [className] - the css class to add to main div
 */
const CategoryItem = ({model, url, className}) => {

  if (!model) {
    return <div className="category-item" />
  }

  const imageUrl = model.ImageUrl ? model.ImageUrl : require(`$assets/images/default.png`)

  return (
    <Link to={url}>
      <a className={`category-item ${className || ''}`}>
        <div className="image-wrapper">
          <img src={imageUrl}/>
        </div>
        <div className="category-name">
          <LinesEllipsis text={model.Name} maxLine={2} basedOn='words'/>
        </div>
      </a>
    </Link>
  )
}

export default CategoryItem
