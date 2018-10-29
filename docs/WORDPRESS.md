## Installation

Before you begin, please create a project in the [CommentBox.io Dashboard](https://dashboard.commentbox.io). Click [here](https://commentbox.io/docs/dashboard) to learn more about the dashboard and how to use it.

1. In your Wordpress admin panel, to **Plugins** > **Add Plugin**
2. Search for **"CommentBox.io"**
3. Click **Install Now**
4. Activate the plugin
5. On the sidebar, navigate to the new **CommentBox.io** option to open the Wordpress settings page.
6. Go to [the CommentBox.io dashboard](https://dashboard.commentbox.io/) to sign up and create a project.
7. Once the project is created, enter the project ID in the appropriate field in the Wordpress settings page.
8. Optionally customize the plugin, which you can read about below.
9. Click **Save**, and the plugin will now be available wherever the original Wordpress comment box previously appeared.

## Customization

There are several customization options available to you in the CommentBox.io Wordpress settings page. These options correspond to the core plugin's advanced options.

### Class Name

The plugin will create a `div` tag with a "commentbox" class. If you're using the "commentbox" class for some other purpose, you can simply pass in your preferred class name here.

### Box ID

The plugin will create a `div` tag with a "commentbox" ID. If you're using the "commentbox" ID for some other purpose, you can simply pass in your preferred ID here.

### Comment Link Param

In order for us to link directly to a comment made on your page, we pass in an extra query parameter to your URL. By default, this parameter is "tlc". For example, if a user posted a comment to `https://example.com/my-page`, we would link to that comment using this URL: `https://example.com/my-page?tlc={commentId}`.

If you are already using "tlc", or simply wish to rename it to something else, you can replace it here.

### Background Color

The plugin's background is transparent, to adapt to your website. You may change this color to any valid CSS color, e.g. `#000` or `rgb(0, 0, 0)`.

### Text Color

Since most websites tend to have light backgrounds, the default text color is black. You may change the this color to any valid CSS color, e.g. `#fff` or `rgb(255, 255, 255)`.

### Subtext Color

The "subtext" is the text below the comment form. You may change the background color to any valid CSS color, e.g. `#fff` or `rgb(255, 255, 255)`.

### Comment Count Selector

If you'd like to show the comment count elsewhere on your page, you can provide a CSS selector here, and the plugin will update the text contents of that element with the comment count.

## Importing Existing Wordpress Comments

Importing existing Wordpress comments is not supported at this time, but it's in the works and will be available very soon. Stay tuned!
