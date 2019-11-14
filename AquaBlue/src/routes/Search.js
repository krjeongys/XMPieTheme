import { Legacy } from './Legacy'

export default class Search extends Legacy {}

Search.getInitialProps = async (ctx) => {
  return {
    searchValue: ctx.query.id
  }
}
