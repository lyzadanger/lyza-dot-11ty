"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A number of characters must be double-encoded to render on a text layer on
 * Cloudinary. Failure to do so is not a friendly failure mode.
 *
 * @see https://support.cloudinary.com/hc/en-us/articles/202521512-How-to-add-a-special-characters-in-text-overlays
 * @param {String} str - String to encode for use on text layer.
 */
function encodeCloudinaryText(str) {
    return encodeURIComponent(str.replaceAll(/[\?#,\/\%]/g, encodeURIComponent));
}
/**
 * This eleventy plugin provides the `cloudinaryOGImage` shortcode, which
 * returns a URL that can be used as the `content` attribute value
 * in `<meta property="og:image">` tags.
 *
 * It will composite an image using the Cloudinary Transformation URL API.
 *
 * https://cloudinary.com/documentation/transformation_reference
 */
module.exports = (eleventyConfig, { accentColor, cloudinaryId }) => {
    if (!cloudinaryId) {
        throw new Error("Lyza-Cloudinary Plugin requires a cloudinary ID");
    }
    const textAccentColor = accentColor.replace("#", "");
    const cloudinaryOGImageUrl = (og) => {
        const encodedTitle = encodeCloudinaryText(og.title);
        // Make font larger if there is no post-specific image
        const titleSize = og.image ? "58" : "72";
        // - with content image: text positioned left under LDG type treatment,
        //     spanning half width of OG image
        // - no content image: text positioned centered under LDG type treatment,
        //     spanning most of the width of the OG image
        const titleLayerOptions = og.image
            ? "c_fit,w_540/fl_layer_apply,g_north_west,x_50,y_250"
            : "c_fit,w_900/fl_layer_apply,g_north,y_240";
        const cloudinaryUrlParts = [
            // Establish the bounds of the image canvas and denote that the end of
            // the URL will be a URL to "fetch" the backgorund image from
            `https://res.cloudinary.com/${cloudinaryId}/image/fetch/w_1200,h_630,q_100`,
            // Static: Render "Lyza / Danger / Gardner" text layers at top left
            // Danger comes last because it's composited on top of the other two
            "co_rgb:000,l_text:Playfair%20Display_72_900:Lyza/fl_layer_apply,g_north_west,x_50,y_40",
            "co_rgb:000,l_text:Playfair%20Display_72_900:Gardner/fl_layer_apply,g_north_west,x_50,y_135",
            `co_rgb:${textAccentColor},l_text:Playfair%20Display_72_900:Danger/fl_layer_apply,g_north_west,x_70,y_92`,
        ];
        // If the content has an image to be used, make it half the width of the
        // OG image (taking margins into account), aligned on the right. This
        // needs to be composited behind some of the following layers.
        if (og.image) {
            const encodedURL = Buffer.from(og.image, "utf8").toString("base64");
            cloudinaryUrlParts.push(`l_fetch:${encodedURL}/fl_layer_apply,c_fit,h_500,w_540,g_east,x_50`);
        }
        cloudinaryUrlParts.push(
        // Render a photo of me in bottom right. This contains a Base-64 encoded
        // URL to image of me on cloudinary. This image may partially obscure
        // the post image (by design).
        "l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGZzc3Nkd2J1L2ltYWdlL3VwbG9hZC92MTcwOTIyNjEyOC9seXphX2loNnJray5naWY=/fl_layer_apply,g_south_east", 
        // Render "Lyza.com" on bottom right, near photo of me
        `co_rgb:${textAccentColor},l_text:Playfair%20Display%20SC_36_bold:Lyza.Com/fl_layer_apply,g_south_east,x_220,y_15`, 
        // Render the title of the post/content. Last to ensure it's composited
        // on top
        `co_rgb:44403c,l_text:Playfair%20Display_${titleSize}_400_italic_line_spacing_-15:${encodedTitle},${titleLayerOptions}`);
        // And, finally, give the URL of the image that will be at the
        // background of all of this, which is just a white rectangle
        cloudinaryUrlParts.push("https://res.cloudinary.com/dfsssdwbu/image/upload/v1709226095/white_ldpjpk.jpg");
        return cloudinaryUrlParts.join("/");
    };
    // Return URL to composited Open Graph image
    eleventyConfig.addShortcode("cloudinaryOGImage", cloudinaryOGImageUrl);
};
