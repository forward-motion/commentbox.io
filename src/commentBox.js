import { parse, stringify } from 'qs';

const defaultOptions = {
    className: 'commentbox',
    defaultBoxId: 'commentbox',
    tlcParam: 'tlc',
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
    },
    /**
     *
     * @param {number} count
     */
    onCommentCount(count) {}
};

export default function commentBox(projectId, passedOptions = defaultOptions) {

    if (!projectId) {
        throw new Error('Please supply a valid projectId.');
    }

    const {
        className,
        defaultBoxId,
        tlcParam,
        createBoxUrl,
        onCommentCount
    } = Object.keys(defaultOptions).reduce((options, key) => {

        options[key] = (passedOptions && passedOptions[key]) ? passedOptions[key] : defaultOptions[key];

        return options;

    }, {});

    const pageLocation = document.createElement('a');
    pageLocation.href = window.location.href;
    const boxes = document.getElementsByClassName(className);
    const numBoxes = boxes.length;
    const boxIds = {};

    for (let i = 0; i < numBoxes; i++) {

        const box = boxes[i];

        if (box.getAttribute('data-loaded')) {
            continue;
        }

        const boxId = box.id || defaultBoxId;
        const queryParams = parse(pageLocation.search.replace('?', ''));
        const commentId = queryParams[tlcParam]; // look for ?tlc={commentId}
        const boxLocation = document.createElement('a');

        if (boxIds[boxId]) {
            throw new Error('Each box must have a unique ID');
        }
        boxIds[boxId] = true;
        box.id = boxId;

        boxLocation.href = createBoxUrl(boxId, pageLocation);
        const boxParams = parse(boxLocation.search.replace('?', ''));
        const safeBoxParams = Object.keys(boxParams).reduce((safeBoxParams, param) => {

            if (param.toLowerCase() !== tlcParam.toLowerCase()) {
                safeBoxParams[param] = boxParams[param];
            }
            return safeBoxParams;

        }, {});
        boxLocation.search = (Object.keys(safeBoxParams).length > 0) ? `?${stringify(safeBoxParams)}` : '';

        const iframe = document.createElement('iframe');
        const iframeUrl = document.createElement('a');

        iframeUrl.href = 'https://app.commentbox.io';
        iframeUrl.pathname = projectId;
        iframeUrl.search = stringify({ id: boxId, url: boxLocation.href, tlc_param: tlcParam , tlc: commentId});

        iframe.setAttribute('src', iframeUrl.href);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('scrolling', 'no');
        box.appendChild(iframe);
        box.setAttribute('data-loaded', 'true');
    }

    const receiveMessage = function receiveMessage(e) {

        const messageLocation = document.createElement('a');
        messageLocation.href= e.origin;

        if (messageLocation.hostname === 'localhost' || (messageLocation.hostname === 'app.commentbox.io' && messageLocation.protocol === 'https:' )) {

            try {
                const data = JSON.parse(e.data);
                const { event, id, payload } = data;
                const iFrame = document.getElementById(id).firstChild;

                if (!boxIds[id]) {
                    return;
                }

                switch(event) {
                    case 'count':
                        iFrame.setAttribute('data-comments-loaded', 'true');
                        onCommentCount(payload);
                        break;
                    case 'resize':
                        iFrame.height = `${payload}px`;
                        break;
                    case 'tlc':
                        iFrame.setAttribute('data-tlc', payload);
                        break;
                }

                if (iFrame.getAttribute('data-comments-loaded') && iFrame.getAttribute('data-tlc') && !iFrame.getAttribute('data-tlc-scrolled')) {

                    const rect = iFrame.getBoundingClientRect();
                    window.scrollTo( 0, window.scrollY + rect.top + parseInt(iFrame.getAttribute('data-tlc')) );
                    iFrame.setAttribute('data-tlc-scrolled', 'true');
                }

            } catch(err) {
                console.error(err);
            }
        }
    };

    window.addEventListener('message', receiveMessage);

    return function removeEventListener() {

        window.removeEventListener('message', receiveMessage);
    };
}