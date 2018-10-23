## Usage

### Signing Up

You can sign up to create your own CommentBox.io projects via the dashboard at https://dashboard.commentbox.io. You can create an unlimited number of projects, each with their own pricing plans.

Signing up can be done via social login or by email. All sign ups require email verification.

### Pricing

Our pricing is based on the amount of monthly bandwidth used to serve comments, as well as the number of comments published per month. The Personal plan includes a free tier of < 1GB bandwidth and < 100 comments, with no credit card necessary if you stay within the limits. If you do go over the limits, the Standard plan's pricing applies, and you will receive an invoice via email from Stripe, our payment provider.

Also note that there is no limit on any plan to the number of comments that can be published.

We offer three plans:
- **Personal** - best for low-traffic blogs who receive less than 100 comments a month
    - No charge for less than 1GB bandwidth used per month
        - If you go past this limit, you will be charged $0.55 per GB
    - No charge for less than 100 comments published per month
        - If you go past this limit, you will be charged $5 per group of 100
    - Limited moderation options
    - No comment searching or filtering
    - No extra moderators
    - No credit card required (unless you go over the free limits)
- **Standard** - best for businesses or moderate-traffic personal blogs who receive more than 100 comments a month
    - Starting at: $5 per month
        - Your monthly bill will be at least $5, regardless of usage.
    - Monthly Bandwidth: $0.55 per GB
        - Complete GB only. You will not be charged for partial values.
    - Monthly Comments Published: $5 per 100 comments published
        - Complete groups only. You will not be charged for partial groups.
    - Granular moderation rules are available
    - Searching and filtering are available
    - Extra moderators are available (up to 10)
    - A credit card is required to sign up, due to the minimum monthly comment volume charge.
- **Professional** - best for high traffic publications who receive 1,000+ comments a month
    - All the features of the Standard plan, but with lower costs per volume.
    - Starting at: $30
        - Your monthly bill will be at least $30, regardless of usage.
    - Monthly Bandwidth: $0.25 per GB
        - Complete GB only. You will not be charged for partial values.
    - Monthly Comments Published: $30 for every group of 1,000 comments published
        - Complete groups only. You will not be charged for partial groups.
    
### Moderation Rules

We offer three different kinds of moderation:
- **Manual** - all comments must be manually approved
- **Automatic** - all comments are automatically approved
- **Granular** - all comments are automatically approved, except those that to not pass the enabled filters.

Granular moderation is often best suited for high volumes of comments, and is only available in the Standard or Professional plans.

Here's the breakdown of the granular filters that you can enable:
- **Comments containing links** - if a URL is found in a comment, it will not pass.
- **Comments from authors blocked on other websites** - if a user posts a comment on your website, but they were previously blocked on another website, their comment will not pass.
- **Comments from authors with previously removed comments** - if a user posts a comment on your website, but you have previously removed on of their comments, their comment will not pass.
- **Comments from anonymous authors** - if an anonymous user posts a comment, it will not pass.
- **Comments matching previously removed comments** - if a comment has the same content as a previous comment that has been deleted by you, it will not pass.

We plan to expand this list in the near future, so if there's a filter you'd like to see implemented, please let us know.

### Extra Moderators

For users on the Standard or Professional plan, you may add up to 10 moderators. To do so, simply add their email addresses to the corresponding section during project setup. Note that we will not notify these users via email, in order to prevent abuse or spam. However, they will be notifed once they log in to the dashboard using the email that you've specified.

Once logged in, they will be presented with the option to accept or reject your request. They also have the option to reject and block future requests to join that project.

If they accept, the project will become available in their projects dropdown in the dashboard. They will have limited access to the project's Setup page, where they will only be able to modify their email preferences. However, they will have full access to the Comments page,
where they can take any action to approve or remove comments. The same is true for moderating directly in the plugin.

### Webhooks

Webhooks are an excellent way to programmatically respond to events that occur. We offer two ways to implement webhooks: a generic event webhook, or a Slack webhook.

#### Generic Event Webhook

You can opt to implement a webhook to receive various events. To do so, create an endpoint that listens for POST requests with a JSON body. Then, set the URL in the appropriate section in the project setup in the dashboard. We will then ping that URL with relevant data as events occur. 

Please note that your endpoint must be able to verify requests sent to it by inspecting the "Basic" Authorization header, whose credentials must match those generated in the dashboard after saving your project.

We will POST a request to your endpoint with a JSON body that includes two parameters: `event` and `data`.

The `event` parameter is a string that can be one of: 
- `comment.pending`
- `comment.approved`
- `comment.deleted`
- `comment.flagged`

In the future, we may expand this list to include other events such as voting.

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

You can also moderate comments within the plugin, with the ability to remove published comments, block users, and pin comments.

### Blocking Users

You or your moderators can block users either in the dashboard or within the plugin. You can block a user forever, or choose a specific length of time to block them. This will display their blocked status in the plugin, and prevent them from commenting for the duration of the block.

### Changing Payment Method

You may change your credit card details either from the Account modal, or in a project's setup page. Note that there can only be one payment method established for a user, which is applied to all projects created by that user, so setting a new payment method applies to all existing projects as well.

### Deleting a Project

You may delete an existing project via the "danger zone" link at the bottom of the project's Setup page. Note that this removes all existing project data, including comments.

### Deleting Your Account

You may delete your account at any time via the "danger zone" in the Account modal. Note that this removes all your projects' data, including comments.

### Exporting Comments

You may export all published comments from the Comments page of a project. The comments are organized by the unique comment boxes from where they originated, and are saved in a JSON file for each box.

Each file is a JSON object that contains a `data` and `sig` property. The `data` property is an array of comments, while `sig` is a signature unique to the comments in the file as well as their versions.

You can download all files as a single zip file, or individually by selecting the appropriate option in the menu.