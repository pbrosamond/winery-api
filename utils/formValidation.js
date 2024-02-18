/**
 *
 *
 * @param {JSON} requestBody The data from client side
 * @param {Array} requiredField The required fields for the form
 * If lack of property return {checkCode: 1, field: field}, property is empty return { checkCode: 2, field: field }, valid data return { checkCode: 0, field: 'Valid' }
 */

const ValidatingFields = (requestBody, requiredField) => {
  // Validating the feilds

  for (var i in requiredField) {
    // Checking all required field
    if (!requestBody.hasOwnProperty(requiredField[i])) {
      return { checkCode: 1, field: requiredField[i] };
    }
    // Checking empty values
    else if (!requestBody[requiredField[i]]) {
      return { checkCode: 2, field: requiredField[i] };
    }
  }
  return { checkCode: 0, field: "Valid" };
};
