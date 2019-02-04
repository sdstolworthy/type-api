import { Seed } from '../_helpers/seed'
import { Post } from './post.entity'

const seed: Seed = new Seed(Post, [
  {
    title: 'The first post title',
    body: 'The first post body',
  },
  {
    title: 'The second post title',
    body: 'The second post body',
  },
])

seed.seed()

export default seed
