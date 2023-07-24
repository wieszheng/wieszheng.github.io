export function fetchVersion() {
    return fetch('./version.json')
        .then(res => res.json())
        .then(json => json.version ?? '')
        .then(version => {
            if (!version) return
            const tagLineParagragh = document.querySelector('div.VPHero.has-image.VPHomeHero > div > div.main > h1.name > span.clip')
            const docsVersionSpan = document.createElement('samp')
            docsVersionSpan.classList.add('version-tag')
            docsVersionSpan.innerText = version
            tagLineParagragh?.appendChild(docsVersionSpan)
        })
}