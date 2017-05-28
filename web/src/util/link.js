export default function link(href) {
    let link = document.createElement('a');
    link.setAttribute('href', href);
    return link;
}
