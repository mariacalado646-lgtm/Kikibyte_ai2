import { Route } from 'react-router'
import { Hero }     from '../components/Hero'
import { About }    from '../components/About'
import { Services } from '../components/Services'
import { Compliance } from '../components/Compliance'
import { News }     from '../components/News'
import { Contact }  from '../components/Contact'
import { NewsPage } from '../pages/NewsPage'
import { ArticlePage } from '../pages/ArticlePage'

const Home = () => (
    <>
    <Hero /><About /><Services /><Compliance /><News /><Contact />
    </>
)

export const publicRoutes = [
    <Route key="home"    path="/"               element={<Home />} />,
<Route key="news"    path="/noticias"       element={<NewsPage />} />,
<Route key="article" path="/noticias/:slug" element={<ArticlePage />} />,
]
