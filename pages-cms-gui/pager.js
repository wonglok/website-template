
export const MyMetaTags = ({ title = 'New page', desc, url, image, largerImage }) => {
  return <>
    {/* <!-- Primary Meta Tags --> */}
    <title>{title}</title>
    <meta name="title" content={title} />
    {desc && <meta name="description" content={desc} />}

    {/* <!-- Open Graph / Facebook --> */}
    <meta property="og:title" content={title} />
    <meta property="og:type" content="website" />
    {url && <meta property="og:url" content={url} />}
    {desc && <meta property="og:description" content={desc} />}
    {image && <meta property="og:image" content={image} />}

    {/* <!-- Twitter --> */}
    <meta property="twitter:title" content={title} />
    {largerImage && <meta property="twitter:card" content={largerImage} />}
    {url && <meta property="twitter:url" content={url} />}
    {desc && <meta property="twitter:description" content={desc} />}
    {image && <meta property="twitter:image" content={image} />}

    <link rel="apple-touch-icon" sizes="180x180" href="/fav/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/fav/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/fav/favicon-16x16.png" />
    <link rel="icon" href="/fav/favicon.ico" />
  </>
}

export const PageRunner = () => {

}
