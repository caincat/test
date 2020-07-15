import router from './router'
import store from './store'
import { Message,Loading } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login','/404'] // no redirect whitelist

let loadingInstance

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // 全屏加载遮罩
  loadingInstance = Loading.service({
    fullscreen: true,
    background: 'rgba(0,0,0,0.5)'
  });

  // set page title
  // document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
      loadingInstance.close();
    } else {
      const hasRoutes = store.getters.routes
      if (hasRoutes) {
        next()
      } else {
        try {
          // get user menus    
          await store.dispatch('user/getMenus')
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/logout')
          // Message.error('Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
          loadingInstance.close();
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
      loadingInstance.close();
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
  loadingInstance.close();
})
