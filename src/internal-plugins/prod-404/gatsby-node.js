exports.onCreatePage = ({ page, store, boundActionCreators }) => {
  // Copy /404/ to /404.html as many static site hosts expect
  // site 404 pages to be named this.
  // https://www.gatsbyjs.org/docs/add-404-page/
  console.log(page.path);
  if (page.path.match(/\/404\/$/)) {
    console.log(page.path, page.path.replace(/\/404\/$/, `404.html`));
    boundActionCreators.createPage({
      ...page,
      path: page.path.replace(/404\/$/, `404.html`),
    })
  }
}
