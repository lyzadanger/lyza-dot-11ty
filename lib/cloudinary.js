/**
 * @typedef CloudinaryConfig
 * @prop {string} id - User ID for cloudinary
 */

const fallbackImageUrl =
  "https://res.cloudinary.com/dfsssdwbu/image/fetch/v1709240637/https://www.lyza.com/images/lyza.gif";

/**
 * 11ty plugin that adds a filter to generate an Open Graph image from the
 * title of the post/page and optionally including a specific image for
 * that post. This works by constructing a monster URL using Cloudinary's
 * Transformation URL API.
 *
 * https://cloudinary.com/documentation/transformation_reference
 *
 * @param { import('@11ty/eleventy/src/UserConfig') }  eleventyConfig
 * @param {CloudinaryConfig} [config]
 */
module.exports = (eleventyConfig, config = {}) => {
  if (!config || !config.id) {
    return fallbackImageUrl;
  }

  // Return URL to composited Open Graph image
  eleventyConfig.addShortcode(
    "cloudinaryOGImage",
    /**
     * @param {string} title - Title of post or content page
     * @param {string} [imageUrl] - URL to a post- or content-specific image
     *                 It will be resized and positioned in the OG image
     */
    (title, imageUrl) => {
      // A number of characters must be double-escaped to render on a text
      // layer on Cloudinary. Prepare the title, else failure mode ugly.
      // https://support.cloudinary.com/hc/en-us/articles/202521512-How-to-add-a-special-characters-in-text-overlays
      const encodedTitle = encodeURIComponent(
        title.replaceAll(/[\?#,\/\%]/g, encodeURIComponent),
      );

      // Make font larger if there is no post-specific image
      const titleSize = imageUrl ? "60" : "72";
      // - with post image: text positioned left under LDG type treatment,
      //     spanning half width of OG image
      // - no post image: text positioned centered under LDG type treatment,
      //     spanning most of the width of the OG image
      const titleLayerOptions = imageUrl
        ? "c_fit,w_540/fl_layer_apply,g_west,x_40"
        : "c_fit,w_800/fl_layer_apply,g_north,y_240";

      const cloudinaryUrlParts = [
        // Establish the bounds of the image canvas and denote that the end of
        // the URL will be a URL to "fetch" the backgorund image from
        `https://res.cloudinary.com/${config.id}/image/fetch/w_1200,h_600,q_100`,
        // Static: Render "Lyza / Danger / Gardner" text layers at top left
        // Danger comes last because it's composited on top of the other two
        "co_rgb:000,l_text:Playfair%20Display_72_900_line:Lyza,c_fit,w_540/fl_layer_apply,g_north_west,x_40,y_40",
        "co_rgb:000,l_text:Playfair%20Display_72_900_line:Gardner,c_fit,w_540/fl_layer_apply,g_north_west,x_40,y_135",
        "co_rgb:e60a62,l_text:Playfair%20Display_72_900_line:Danger,c_fit,w_540/fl_layer_apply,g_north_west,x_60,y_92",
      ];

      // If the content has an image to be used, make it half the width of the
      // OG image (taking margins into account), aligned on the right. This needs
      // to be composited behind some of the following layers.
      if (imageUrl) {
        const encodedURL = Buffer.from(imageUrl, "utf8").toString("base64");
        cloudinaryUrlParts.push(
          `l_fetch:${encodedURL}/fl_layer_apply,c_fit,h_500,w_540,g_east,x_40`,
        );
      }

      cloudinaryUrlParts.push(
        // Static: Render a photo of me in bottom right. This contains Base-64
        // encoded URL to image of me on cloudinary. This image may partially
        // obscure the post image (by design).
        "l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGZzc3Nkd2J1L2ltYWdlL3VwbG9hZC92MTcwOTIyNjEyOC9seXphX2loNnJray5naWY=/fl_layer_apply,g_south_east",
        // Static: Render "Lyza.com" on bottom right, near photo of me
        "co_rgb:e60a62,l_text:Playfair%20Display%20SC_36_bold_line_spacing_-20:Lyza.Com,c_fit,w_500/fl_layer_apply,g_south_east,x_220,y_20",
        // Render the title of the post/content. Last to ensure it's composited
        // on top
        `co_rgb:44403c,l_text:Playfair%20Display_${titleSize}_400_italic_line_spacing_-15:${encodedTitle},${titleLayerOptions}`,
      );

      // And, finally, give the URL of the image that will be at the
      // background of all of this, which is just a white rectangle
      cloudinaryUrlParts.push(
        "https://res.cloudinary.com/dfsssdwbu/image/upload/v1709226095/white_ldpjpk.jpg",
      );

      return cloudinaryUrlParts.join("/");
    },
  );
};
