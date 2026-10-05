import { useRoute } from '@/lib/router'
import { Header, Footer, Dock, ViewBar, dockShowsOn } from '@/components/Shell'
import { cropBySlug } from '@/lib/season'
import Home from '@/pages/Home'
import Products from '@/pages/Products'
import ProductPage from '@/pages/ProductPage'
import Crops from '@/pages/Crops'
import CropPage from '@/pages/CropPage'
import Partner from '@/pages/Partner'
import Lab, { Verify } from '@/pages/Lab'
import Knowledge from '@/pages/Knowledge'
import KnowledgeHub from '@/pages/KnowledgeHub'
import Nutrients from '@/pages/Nutrients'
import SoilPoverty from '@/pages/SoilPoverty'
import DataHub from '@/pages/DataHub'
import Composition from '@/pages/Composition'
import Article from '@/pages/Article'
import { PotashLoop } from '@/components/story/PotashLoop'
import { KNOWLEDGE_ARTICLES, CIRCULAR_HUB, CIRCULAR_PAGES, PARTNER_PAGES } from '@/data/rebuilt'
import About from '@/pages/About'
import CompanyProfile from '@/pages/CompanyProfile'
import Simulator from '@/pages/Simulator'
import Soil from '@/pages/Soil'
import Tools from '@/pages/Tools'
import Dealers from '@/pages/Dealers'
import NotFound from '@/pages/NotFound'

/** DEMO A+B — "The Field carries the Argument". Hash-routed shell; every page ends in WhatsApp. */
export default function App() {
  const route = useRoute()
  let page
  switch (route.name) {
    case 'products': page = <Products />; break
    case 'composition': page = <Composition />; break   // D-202
    case 'product': page = <ProductPage slug={route.slug} />; break
    case 'crops': page = <Crops />; break
    case 'crop': page = <CropPage slug={route.slug} />; break
    case 'soil': page = <Soil rel={route.rel} district={route.district} />; break
    case 'partner': {
      const pp = route.slug ? PARTNER_PAGES.find(x => x.slug === route.slug) : null
      page = pp ? <Article page={pp} /> : <Partner />
      break
    }
    case 'lab': page = <Lab />; break
    case 'verify': page = <Verify />; break
    case 'knowledge': {
      // /knowledge is the hub; /knowledge/<slug> is an article. why-pakistan-must-shift keeps its
      // bespoke page because it carries the charts; the rest render from rebuilt.ts.
      if (!route.slug) { page = <KnowledgeHub />; break }
      if (route.slug === 'why-pakistan-must-shift') { page = <Knowledge />; break }
      // D-186: the 17 nutrients and the Liebig barrel, a bespoke page because it carries the tool.
      if (route.slug === 'nutrients') { page = <Nutrients />; break }
      // D-245: Soil Poverty Series No. 1, Tahir Abbas's potash report, a bespoke page because it carries the charts.
      if (route.slug === 'soil-poverty-punjab-potash') { page = <SoilPoverty />; break }
      // D-246: Knowledge > Data, the index of every interactive lens.
      if (route.slug === 'data') { page = <DataHub />; break }
      const a = KNOWLEDGE_ARTICLES.find(x => x.slug === route.slug)
      page = a ? <Article page={a} /> : <KnowledgeHub />
      break
    }
    case 'circular': {
      const c = route.slug ? CIRCULAR_PAGES.find(x => x.slug === route.slug) : CIRCULAR_HUB
      // D-179, 26 Sep 2026: the potash loop opens the hub, drawing first and the text after (Tahir).
      page = c && c !== CIRCULAR_HUB ? <Article page={c} /> : (
        <>
          <section className="ce-story"><div className="wrap">
            <span className="eyebrow">Circular economy · the potash loop</span>
            <p className="ce-story-h">From the field to the boiler and back to the field.</p>
            <div className="mt-6"><PotashLoop /></div>
          </div></section>
          <Article page={CIRCULAR_HUB} />
        </>
      )
      break
    }
    case 'about': page = <About />; break
    case 'profile': page = <CompanyProfile />; break
    case 'simulator': page = <Simulator slug={route.slug} />; break
    case 'tools': page = <Tools />; break
    case 'dealers': page = <Dealers />; break
    case 'becomeDealer': {
      const d = PARTNER_PAGES.find(x => x.slug === 'distributor')
      page = d ? <Article page={d} /> : <NotFound />
      break
    }
    case 'notfound': page = <NotFound />; break
    default: page = <Home />
  }
  return (
    <div>
      <Header route={route} />
      <ViewBar />
      <main key={route.name + ('slug' in route ? String(route.slug) : '')} className={route.name === 'home' ? 'home' : undefined}>{page}</main>
      <Footer />
      {dockShowsOn(route.name) && (
        <Dock
          partner={route.name === 'partner' || route.name === 'dealers'}
          crop={route.name === 'crop' ? cropBySlug(route.slug)?.name : undefined}
        />
      )}
    </div>
  )
}
