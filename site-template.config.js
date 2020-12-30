let CONFIG = module.exports = module.exports || {}

CONFIG.BRAND = '86deck'
CONFIG.MAIN_SITE_DEV = `'http://localhost:3000'`
CONFIG.MAIN_SITE_PROD = `https://86deck.withloklok.com`

CONFIG.DB_NAME = `db86deck`
CONFIG.LOGIN_KEY_VISUAL_TYPE = 'iframe' // 'image' or 'iframe'
CONFIG.LOGIN_KEY_VISUAL_IFRAME = '/86deck-main-art.html'
CONFIG.LOGIN_KEY_VISUAL_IMAGE = 'https://source.unsplash.com/IXUM4cJynP0'

CONFIG.CLOUDINARY_ACCOUNT = 'loklok-keystone'
CONFIG.CLOUDINARY_UPLOAD_PRESET_DEV = 'wonglok-portfolio'
CONFIG.CLOUDINARY_UPLOAD_PRESET_PROD = '86deck-portfolio'
CONFIG.CLOUDINARY_UPLOAD_PRESET_PREVIEW = '86deck-portfolio'

//