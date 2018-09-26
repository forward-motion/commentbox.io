import { parse } from 'qs';

const defaultOptions = {
    className: 'commentbox',
    defaultBoxIdPrefix: 'commentbox',
    pageLocation: window.location,
    /**
     *
     * @param {Location} pageLocation
     * @returns {string|null}
     */
    getCommentId(pageLocation) {
        const queryParams = parse(pageLocation.search.replace('?', ''));
        return queryParams.tlc; // look for ?tlc={commentId}
    },
    /**
     *
     * @param {string} boxId
     * @param {Location} pageLocation
     * @returns {string}
     */
    createBoxUrl(boxId, pageLocation) {

        pageLocation.search = ''; // removes query string!
        pageLocation.hash = boxId; // creates link to this specific Comment Box
        return pageLocation.href; // return url string
    }
};

export default function commentBox(projectId, passedOptions = defaultOptions) {

    if (!projectId) {
        throw new Error('Please supply a valid projectId.');
    }

    const {
        className,
        defaultBoxIdPrefix,
        pageLocation,
        getCommentId,
        createBoxUrl
    } = Object.assign({}, defaultOptions, passedOptions);

    const boxes = document.getElementsByClassName(className);
    const numBoxes = boxes.length;

    for (let i = 0; i < numBoxes; i++) {

        const box = boxes[i];
        
        if (box.getAttribute('data-loaded')) {
            continue;
        }
        
        const boxId = box.id || `${defaultBoxIdPrefix}${numBoxes === 1 ? '' : `-${i + 1}`}`;
        const commentId = getCommentId(pageLocation);
        const boxUrl = createBoxUrl(boxId, pageLocation);
        const iframe = document.createElement('iframe');
        const baseUrl = 'https://app.commentbox.io';
        iframe.src = `${baseUrl}/${projectId}?box=${encodeURIComponent(boxUrl)}${commentId ? `#${commentId}` : ''}`;
        box.appendChild(iframe);
        box.setAttribute('data-loaded', 'true');
    }
}