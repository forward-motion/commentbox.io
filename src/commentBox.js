import { parse, stringify } from 'qs';

const defaultOptions = {
    className: 'commentbox', // the class of divs to look for
    defaultBoxId: 'commentbox', // the default ID to associate to the div
    tlcParam: 'tlc', // used for identifying links to comments on your page
    backgroundColor: null, // default transparent
    textColor: null, // default black
    subtextColor: null, // default grey
    singleSignOn: null,
    /**
     * Creates a unique URL to each box on your page.
     *
     * @param {string} boxId
     * @param {Location} pageLocation - a copy of the current window.location
     * @returns {string}
     */
    createBoxUrl(boxId, pageLocation) {

        pageLocation.search = ''; // removes query string!
        pageLocation.hash = boxId; // creates link to this specific Comment Box on your page
        return pageLocation.href; // return url string
    },
    /**
     * Fires once the plugin loads its comments.
     * May fire multiple times in its lifetime.
     *
     * @param {number} count
     */
    onCommentCount(count) {

    },
    testMode: false
};

const defaultSingleSignOn = {
    buttonText: 'Single Sign-On',
    buttonIcon: '',
    buttonColor: '',
    autoSignOn: false,
    onSignOn(onComplete, onError) {

    },
    onSignOut() {

    }
};

export default function commentBox(projectId, passedOptions = defaultOptions) {

    if (!projectId) {
        throw new Error('Please supply a valid projectId.');
    }

    const {
        className,
        defaultBoxId,
        tlcParam,
        backgroundColor,
        textColor,
        subtextColor,
        createBoxUrl,
        onCommentCount,
        testMode
    } = Object.keys(defaultOptions).reduce((options, key) => {

        options[key] = (passedOptions && passedOptions[key]) ? passedOptions[key] : defaultOptions[key];

        return options;

    }, {});

    let singleSignOn = passedOptions.singleSignOn || null;
    if (singleSignOn) {
        singleSignOn = Object.keys(defaultSingleSignOn).reduce((options, key) => {

            options[key] = singleSignOn[key] || defaultSingleSignOn[key];

            return options;

        }, {});
    }

    const pageLocation = document.createElement('a');
    pageLocation.href = window.location.href;
    const boxes = document.getElementsByClassName(className);
    const numBoxes = boxes.length;
    const boxIds = {};
    const appDomain = testMode ? 'localhost:8000' : 'app.commentbox.io';
    const appProtocol = testMode ? 'http:' : 'https:';
    const appUrl = `${appProtocol}//${appDomain}`;

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
        const iframeParams = {
            id: boxId,
            url: boxLocation.href,
            tlc_param: tlcParam ,
            tlc: commentId,
            background_color: backgroundColor,
            text_color: textColor,
            subtext_color: subtextColor,
        };
        const makeIframe = () => {

            iframeUrl.href = appUrl;
            iframeUrl.pathname = projectId;
            iframeUrl.search = stringify(iframeParams);

            iframe.setAttribute('src', iframeUrl.href);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('style', 'width: 100%');
            box.appendChild(iframe);
            box.setAttribute('data-loaded', 'true');
        };

        if (singleSignOn) {
            Object.assign(iframeParams, {
                sso: '1',
                sso_text: singleSignOn.buttonText,
                sso_icon: singleSignOn.buttonIcon,
                sso_color: singleSignOn.buttonColor,
            });

            if (singleSignOn.autoSignOn) {
                let called = false;

                singleSignOn.onSignOn(userPayload => {

                    if (called) {
                        throw new Error('Callback already called.');
                    }
                    called = true;

                    if (userPayload) {
                        iframeParams.sso_user_payload = userPayload;
                    }

                    makeIframe();

                }, err => {

                    if (called) {
                        throw new Error('Callback already called.');
                    }
                    called = true;

                    makeIframe();
                });
            } else {
                makeIframe();
            }

        } else {
            makeIframe();
        }
    }

    const receiveMessage = function receiveMessage(e) {

        const messageLocation = document.createElement('a');
        messageLocation.href= e.origin;

        if (e.data && messageLocation.hostname === appDomain || messageLocation.protocol === appProtocol) {

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
                    case 'sso-user-payload':
                        if (singleSignOn) {

                            let called = false;

                            singleSignOn.onSignOn(userPayload => {

                                if (called) {
                                    throw new Error('Callback already called.');
                                }
                                called = true;
                                const message = JSON.stringify(userPayload ? {
                                    event: 'sso-user-payload',
                                    payload: userPayload
                                } : {
                                    event: 'sso-user-payload-error',
                                    payload: 'Could not sign in.'
                                });
                                e.source.postMessage(message, e.origin);

                            }, err => {

                                if (called) {
                                    throw new Error('Callback already called.');
                                }
                                called = true;
                                const message = JSON.stringify({
                                    event: 'sso-user-payload-error',
                                    payload: err.message
                                });
                                e.source.postMessage(message, e.origin);
                            });
                        }
                        break;
                    case 'sso-logout':
                        if (singleSignOn) {
                            singleSignOn.onSignOut();
                        }
                        break;
                }

                if (iFrame.getAttribute('data-comments-loaded') && iFrame.getAttribute('data-tlc') && !iFrame.getAttribute('data-tlc-scrolled')) {

                    const rect = iFrame.getBoundingClientRect();
                    window.scrollTo( 0, window.scrollY + rect.top + parseInt(iFrame.getAttribute('data-tlc')) );
                    iFrame.setAttribute('data-tlc-scrolled', 'true');
                }

            } catch(err) {

            }
        }
    };

    window.addEventListener('message', receiveMessage);

    return function removeEventListener() {

        window.removeEventListener('message', receiveMessage);
    };
}