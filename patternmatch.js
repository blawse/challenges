const axios = require('axios');

/**
 * A "normalized" version of an image is the pattern that is left when all
 * empty rows at the top and bottom are removed, and empty columns at the left
 * and right are removed
 * NOTE: This can be optimized quite a bit... was going for speed of implementation
 * instead of optimizing performance of solution
 * @param image
 * @returns {string}
 */
function normalize(image) {
   let rows = image.split(" ");

   // Remove empty top and bottom rows
   while (rows.length > 0  &&  rows[0].indexOf("1") < 0) rows.shift();
   while (rows.length > 0  &&  rows[rows.length-1].indexOf("1") < 0) rows.pop();

   // Rotate and remove empty top and bottom rows again (easier than dealing with the columns)
   let r90 = rotate(rows.join(" "));
   rows = r90.split(" ");
   while (rows.length > 0  &&  rows[0].indexOf("1") < 0) rows.shift();
   while (rows.length > 0  &&  rows[rows.length-1].indexOf("1") < 0) rows.pop();

   // Rotate 3 more times to get back to original orientation
   let r180 = rotate(rows.join(" "));
   let r270 = rotate(r180);
   let r0 = rotate(r270);

   return r0;
}

/**
 * Rotate an "image string" clockwise by 90 degrees
 * @param image
 */
function rotate(image) {
   let newRows = [];

   // Convert to an easier to address 2 dimensional array of characters
   let rows = image.split(" ");
   let rowsArray = [];
   rows.forEach(function(r) {
      rowsArray.push(r.split(''));
   });

   // Allow rotating image strings of any size (not hardcoding to 8 x 8)
   // Declaring several redundant variables just for clarity in the later code
   let oldRowCount = rows.length;
   let oldColumnCount = rows[0].length;

   let newRowCount = oldColumnCount;
   let newColCount = oldRowCount;

   for (let newRowIndex = 0; newRowIndex < newRowCount; newRowIndex++) {
      let newRow = [];
      for (let newColIndex = 0; newColIndex < newColCount; newColIndex++) {
         newRow.push(rowsArray[oldRowCount - newColIndex - 1][newRowIndex]);
      }
      newRows.push(newRow.join(''));
   }

   return newRows.join(" ");
}

/**
 * Return an array of pointcloud indexes that match the reference image
 * @param reference
 * @param pointclouds
 * @returns {Promise<Array>}
 */
async function match(reference, pointclouds) {
   console.log({ reference, pointclouds });

   // Get all rotations of the reference image
   let ref0 = reference;
   let ref90 = rotate(ref0);
   let ref180 = rotate(ref90);
   let ref270 = rotate(ref180);

   // Create a hashmap of normalized versions of the reference image at all rotations
   let references = {};

   references[normalize(ref0)] = true;
   references[normalize(ref90)] = true;
   references[normalize(ref180)] = true;
   references[normalize(ref270)] = true;

   // Compare pointclouds to all the reference images
   let matches = [];
   pointclouds.forEach(function(pointcloud, index) {
      // If the normalized point cloud matches any reference image, then we have a match
      if (references[normalize(pointcloud)]) {
         matches.push(index);
      }
   });

   return matches;
}

async function runTest(url) {
   let test = await axios.get(url, { });
   let result = await match(test.data.reference, test.data.pointclouds);
   console.log(result);
}


//runTest("https://s3.amazonaws.com/whare-dev/challenge/data1.json");
runTest("https://s3.amazonaws.com/whare-dev/challenge/data2.json");