exports.showError404 = (req, res, next) => {
    res.status(404).render('404', {
        docTitle: 'Page Not Found',
        errorCSS: true,
        path: ''
    });
}