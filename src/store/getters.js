const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  routes: state => state.user.routes,
  config: state => state.settings.config
}
export default getters
