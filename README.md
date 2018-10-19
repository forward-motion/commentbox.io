## Installation

Before you begin, please create a project in the [CommentBox.io Dashboard](https://dashboard.commentbox.io). Click [here](https://commentbox.io/docs/dashboard) to learn more about the dashboard and how to use it.

```bash
npm install commentbox.io --save
```
or
```html
<script src="https://unpkg.com/commentbox.io/dist/commentBox.min.js"></script>
```

## Usage

In your HTML, place an empty `div` tag with the "commentbox" class:
```html
<div class="commentbox"></div>
```

Then, in your JavaScript, initialize with your project ID:
```js
import commentBox from 'commentbox.io';
// or
const commentBox = require('commentbox.io');
// or if using the CDN, it will be available as a global "commentBox" variable.

commentBox('my-project-id');
```

That's it!

## Usage in React

Supporting React is pretty simple:

```jsx
import React from 'react';
import commentBox from 'commentbox.io';

class PageWithComments extends React.Component {
    
    componentDidMount() {

        this.removeCommentBox = commentBox('my-project-id');
    }

    componentWillUnmount() {

        this.removeCommentBox();
    }
    
    render() {
        
        return (
            <div className="commentbox" />
        );
    }
}
```
The principles are the same as in the non-React example, except that you'll want to be sure to call the `commentBox` function in the `componentDidMount` lifecycle event. The `commentBox` function returns a handy function to clean itself up, so you can call this cleanup function when your component unmounts in`componentWillUnmount`.

## Advanced Usage

With its default options, CommentBox.io works well for most use cases, however, there are some cases that require extra customization. This is handled by the optional second argument to the `commentBox` function, which is an options object. Here are its defaults:
```js
commentBox('my-project-id', {
    className: 'commentbox', // the class of divs to look for
    defaultBoxId: 'commentbox', // the default ID to associate to the div
    tlcParam: 'tlc', // used for identifying links to comments on your page
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
        
    }
});
```

We will explore these options via various use cases:

### Using a different identifying class

If you're using the "commentbox" class for some other purpose, you can simply pass in your preferred class as the `className` option.
```html
<div class="my-box-of-comments"></div>
```
```js
commentBox('my-project-id', { className: 'my-box-of-comments' });
```

### Using a different box ID

If you're using the "commentbox" id for some other purpose, you can simply pass in your preferred id as the `defaultBoxId` option.
```html
<div class="commentbox"></div>
```
```js
commentBox('my-project-id', { defaultBoxId: 'my-commentbox' });
```

Alternatively, you may give the `div` whatever ID you wish:
```html
<div class="commentbox" id="my-commentbox"></div>
```
```js
commentBox('my-project-id');
```

### Multiple boxes on the same page

In order to support multiple boxes on the same page, each with its own set of comments, simply add a unique id to each box:
```html
<div class="commentbox" id="article"></div>
<div class="commentbox" id="sidebar"></div>
```

### Using a different "tlc" param

In order for us to link directly to a comment made on your page, we pass in an extra query parameter to your URL. By default, this parameter is "tlc". For example, if a user posted a comment to `https://example.com/my-page`, we would link to that comment using this URL: `https://example.com/my-page?tlc={commentId}`.

If you are already using "tlc", or simply wish to rename it to something else, you can replace the `tlcParam` option:
```js
commentBox('my-project-id', { tlcParam: 'c_id' });
```

### Uniquely identifying boxes on your site

The plugin determines which boxes are unique based on the URL to that box, minus the query parameters. For example, if your page at `https://example.com/my-page` contained a single box with all it's default options, the URL to that box would be `https://example.com/my-page#commentbox`. 

As mentioned above, you can also change the box ID, or have multiple boxes with their own unique IDs, which would generate box URLs using those IDs as the hash instead of "#commentbox".

By default, the plugin ignores query parameters. This is because for most use cases, query parameters are not widely used to generate page content, and are instead used as either tracking mechanisms or to supply extra arguments to the same content. This means that both `https://example.com/my-page` and `https://example.com/my-page?foo=bar` will contain the same box with the same comments, which is usually desirable.

There are of course cases where this is not desirable, for example if your website content relied on a "page_id" parameter: `https://example.com/pages.php?page_id=5`. In this case, all your pages would have the exact same set of comments!

In order to account for this situation, you can modify how the plugin creates box URLs using the `createBoxUrl` option.

In the following example, we will leverage the [`qs` module](https://www.npmjs.com/package/qs) in order to get the "page_id" parameter:
```js
import qs from 'qs';

commentBox('my-project-id', {
    createBoxUrl(boxId, pageLocation) {
    
        const queryParams = qs.parse(pageLocation.search.replace('?', ''));
        const relevantParams = {
            'page_id': queryParams['page_id']
        };
        pageLocation.search = qs.stringify(relevantParams); // we will now include "?page_id=5" in the box URL
        pageLocation.hash = boxId; // creates link to this specific Comment Box on your page
        return pageLocation.href; // return url string
    }
});
```
Note that `pageLocation` is a `Location` object, which you can read more about here: https://developer.mozilla.org/en-US/docs/Web/API/Location.

Another such case is if you are using the URL hash for routing purposes. In this case, you would not want the hash to be replaced with the hash of the box, but you would still want each box to be unique based on its ID. We could accomplish this in many ways, but one such way would be to include the box ID in the query params, instead of the hash:


```js
commentBox('my-project-id', {
    createBoxUrl(boxId, pageLocation) {
    
        pageLocation.search = `?box=${encodeURIComponent(boxId)}`; // we will now include "?box=commentbox" in the box URL
        //pageLocation.hash = boxId; leave the hash alone
        return pageLocation.href; // return url string
    }
});
```

### Displaying comment count outside of the plugin

Some implementations may choose to have a "comments" button that displays the box only when clicked, and may want to show the number of comments available before the box is shown. To get this number, simply pass in the `onCommentCount` option:
```js
commentBox('my-project-id', {
    onCommentCount(count) {
        // use the count however you wish.
    }
});
```
Note that this event may fire multiple times.