# commentbox.io

Note that if you are reading this anywhere outside of the website, you might want to visit https://commentbox.io/docs instead. The content is the same as below, but in a much nicer, prettier layout.

## Embed Installation

```bash
npm install commentbox.io --save
```
or
```html
<script src="https://unpkg.com/commentbox.io/dist/commentBox.min.js"></script>
```

## Embed Usage

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

## Advanced Embed Usage

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

By default, the plugin ignores query parameters. This is because for most use cases, query parameters are not widely used to generate page content, and are instead used as either tracking mechanisms or to supply extra arguments to the same content. this means that both `https://example.com/my-page` and `https://example.com/my-page?foo=bar` will contain the same box with the same comments, which is usually desirable.

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
Note that `pageLocation` is a `Location` object, which you can read more about here: [https://developer.mozilla.org/en-US/docs/Web/API/Location].

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

## Plugin Usage

### Signing up

Commenting, replying, voting, and flagging require a logged in user. You can sign up directly in the plugin, either by attempting to post a comment, or clicking on the avatar button.

Signing up can be done via social login or by email. Email sign ups require email verification.

### Commenting

The plugin supports limited (but compliant) Markdown:
- italic:

\_text\_ or \*text\* creates _text_

- bold:

\__text\__ or \**text\** creates __text__

- italic + bold:

\___text\___ or \***text\*** creates ___text___

- inline quotes:

\`text\` creates `text`

- block quotes:

\```

text

\``` 

creates
```
text
```
- code (with language-specific styles):

\```js

const text = 'text';

\```

creates
```js
const text = 'text';
```

#### Limits
- At this time, links are not automatically hyperlinked. This may change in the future.
- Comments may be up to 16,384 characters in length.
- Comments are editable for 8 minutes.
- You may edit a comment up to 9 times.

### Voting

You may upvote comments to show your support for quality content. This will bubble the comment up higher on the page. Similarly, downvoting comments may push comments further down the page.

### Flagging

If you spot spam or otherwise malicious comments, flagging them will alert moderators to it to take further action.

### Moderation

The plugin supports limited moderation, where moderators may directly remove published comments from it. However, the dashboard is necessary to moderate pending comments, as they do not show up in the plugin.


## Dashboard Usage

### Signing Up

You can sign up to create your own CommentBox.io projects via the dashboard at [https://dashboard.commentbox.io]. You can create an unlimited number of projects, each with their own pricing plans.

Signing up can be done via social login or by email. All sign ups require email verification.

### Pricing

Our pricing is based on the amount of monthly bandwidth used to serve comments, as well as the number of comments published per month. The Personal plan includes a free tier of < 1GB bandwidth and < 1K comments, with no credit card necessary if you stay within the limits. The Standard plan's pricing applies after.

Also note that there is no limit to the number of comments published on any plan.

We offer three plans:
- **Personal** - best for low-traffic blogs who receive less than 1,000 comments a month
    - No charge for less than 1GB bandwidth used per month
        - If you go past this limit, you will be charged $0.50 per GB
    - No charge for less than 1,000 comments published per month
        - If you go past this limit, you will be charged $5 per group of 1,000
    - Limited moderation options
    - No comment searching or filtering
    - No extra moderators
    - No credit card required (unless you go over the free limits)
- **Standard** - best for businesses or high-traffic personal blogs who receive more than 1,000 comments a month
    - Bandwidth costs: $0.50 per GB
    - Comment costs: $5 for every group of 1,000 comments published
        - This is grouped, so if you received 0 - 999 comments, you would still be charged $5, as you are within the 1,000 group.
    - Granular moderation rules are available
    - Searching and filtering are available
    - Extra moderators are available (up to 10)
    - A credit card is required to sign up, due to the minimum monthly comment volume charge.
- **Professional** - best for high traffic publications who receive 15,000+ comments a month
    - All the features of the Standard plan, but with lower costs per volume.
    - Bandwidth costs: $0.25 per GB
    - Comment costs: $50 for every group of 15,000 comments published
    
### Moderation Rules

We offer three different kinds of moderation:
- Manual - all comments must be manually approved
- Automatic - all comments are automatically approved
- Granular - all comments are automatically approved, except those that to not pass the enabled filters.

Granular moderation is often best suited for high volumes of comments, and is only available in the Standard or Professional plans.

Here's the breakdown of the granular filters that you can enable:
- Comments containing links - if a URL is found in a comment, it will not pass.
- Comments from authors blocked on other websites - if a user posts a comment on your website, but they were previously blocked on another website, their comment will not pass.
- Comments from authors with previously removed comments - if a user posts a comment on your website, but you have previously removed on of their comments, their comment will not pass.
- Comments from anonymous authors - if an anonymous user posts a comment, it will not pass.
- Comments matching previously removed comments - if a comment has the same content as a previous comment that has been deleted by you, it will not pass.

We plan to expand this list in the near future, so if there's a filter you'd like to see implemented, please let us know.

### Extra Moderators

For users on the Standard or Professional plan, you may add up to 10 moderators. To do so, simply add their email addresses to the corresponding section during project setup. Note that we will not notify these users via email, in order to prevent abuse or spam. However, they will be notifed once they log in to the dashboard using the email that you've specified.

Once logged in, they will be presented with the option to accept or reject your request. They also have the option to reject and block future requests to join that project.

If they accept, the project will become available in the projects dropdown. They will have limited access to the Setup page, where they will only be able to modify their email preferences. However, they will have full access to the Comments page,
where they can take any action to approve or remove comments. The same is true for moderating directly in the plugin.

### Webhooks

We offer two ways to implement webhooks: a generic event webhook, or a Slack webhook.

#### Generic Event Webhook

You can opt to implement a webhook to receive various events. To do so, create an endpoint that listens for POST requests with a JSON body. Then, set the URL in the appropriate section in the project setup in the dashboard. We will then ping that URL with relevant data as events occur. 

Please note that your endpoint must be able to verify requests sent to it by inspecting the "Basic" Authorization header, whose credentials must match those generated in the dashboard after saving your project.

We will POST a request to your endpoint with a JSON body that includes two parameters: `event` and `data`.

The `event` parameter is a string that can be one of: "comment.pending", "comment.approved", "comment.deleted", "comment.flagged".

The `data` parameter is an object that has the following parameters:
- `id`: the comment Id
- `body`: the comment body, which is in Markdown
- `version`: a string representing a number from 0-9, which increase by 1 each time a comment is edited
- `url`: the URL of the box where the comment was created
- `tlcParam`: the query parameter to use when linking to that specific comment on the page
- `createdAt`: the date the comment was created, in milliseconds
- `updatedAt`: the date the comment was updated, in milliseconds

Additionally, the comment may include the following parameters, if it is not anonymous:
- `userId`: the author's user ID
- `userDisplayName`: the author's name
- `userPhotoURL`: the author's photo, if available

Note that for deleted comments, only the `id` parameter will be available.

#### Slack Webhook

You may opt to receive particular notifications via Slack. Simply paste the [Slack Webhook URL](https://api.slack.com/incoming-webhooks) into the appropriate section in the project setup in the dashboard, and select the events you'd like to post to Slack.
 
### Moderating Comments

You or your moderators can moderate comments in the dashboard, in the Comments page.

The dashboard allows you to see which comments are pending moderation as well as which published comments have been flagged.

To moderate a comment in the dashboard, simply select the checkbox to the right of it, which will bring up a toolbar with the relevant options. You can select up to 1,000 comments at a time to bulk-moderate them.

- For pending comments, you can choose to either approve or remove them.
- For flagged comments, you can choose to remove the flagged status.
- For approved comments, you can choose to remove them.

You can also moderate comments within the plugin, albeit only with the ability to remove published comments.

### Blocking Users

You or your moderators can block users either in the dashboard or within the plugin. You can block a user forever, or choose a specific length of time to block them. This will display their blocked status in the plugin, and prevent them from commenting for the duration of the block.

### Changing Payment Method

You may change your credit card details either from the Account modal, or in a project's setup page. Note that there can only be one payment method established for a user, which is applied to all projects created by that user, so setting a new payment method applies to all existing projects as well.

### Deleting a Project

You may delete an existing project via the "danger zone" link at the bottom of the project's Setup page. Note that this removes all existing project data, including comments.

### Deleting Your Account

You may delete your account at any time via the "danger zone" in the Account modal. Note that this removes all your projects' data, including comments.

